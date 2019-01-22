package dataEngine

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/jbmanning/auth/api/internals/crypto"
	"github.com/jbmanning/auth/api/pkg/www"
	"os"
	"strings"
)

var awsSession = session.Must(session.NewSession(&aws.Config{
	Region: aws.String("us-east-1"),
}))

var dynamo = dynamodb.New(awsSession)
var tblName = aws.String(os.Getenv("TABLE_NAME"))

type getUserDBParams struct {
	Email string `json:"email"`
}

type User struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Hash   string `json:"hash"`
	Active bool   `json:"active"`
}

func GetUser(email string) *User {
	params := getUserDBParams{
		Email: strings.ToLower(email),
	}

	key, err := dynamodbattribute.MarshalMap(params)
	if err != nil {
		panic(err)
	}

	res, err := dynamo.GetItem(&dynamodb.GetItemInput{
		TableName: tblName,
		Key:       key,
	})
	// always nil on successful request
	if err != nil {
		panic(err)
	}

	// User does not exist
	if len(res.Item) == 0 {
		return nil
	}

	user := &User{}
	err = dynamodbattribute.UnmarshalMap(res.Item, user)
	if err != nil {
		panic(err)
	}

	return user
}

type CreateUserParams struct {
	Name     *string `json:"name"`
	Email    *string `json:"email"`
	Password *string `json:"password"`
}

type CreateUserErrors struct {
	NameErrors     []string `json:"name_errors"`
	EmailErrors    []string `json:"email_errors"`
	PasswordErrors []string `json:"password_errors"`
}

func CreateUser(params CreateUserParams) CreateUserErrors {
	nameErrors := validateName(params.Name)
	emailErrors := validateEmail(params.Email)
	passwordErrors := validatePassword(params)

	oldUser := GetUser(*params.Email)
	if oldUser != nil && oldUser.Email == strings.ToLower(*params.Email) {
		emailErrors = append(emailErrors, www.EmailTakenError)
	}

	if len(nameErrors) == 0 && len(emailErrors) == 0 && len(passwordErrors) == 0 {
		newUser := User{
			Name:   *params.Name,
			Email:  strings.ToLower(*params.Email),
			Hash:   crypto.CreateHash(*params.Password),
			Active: false,
		}

		item, err := dynamodbattribute.MarshalMap(newUser)
		if err != nil {
			panic(err)
		}

		_, err = dynamo.PutItem(&dynamodb.PutItemInput{
			TableName:           tblName,
			ConditionExpression: aws.String("attribute_not_exists(email)"),
			Item:                item,
		})
		if err != nil {
			switch v := err.(type) {
			case awserr.RequestFailure:
				if v.StatusCode() == 400 {
					emailErrors = append(emailErrors, www.EmailTakenError)
					break
				}
				panic(err)
			default:
				panic(err)
			}
		}
	}

	return CreateUserErrors{
		NameErrors:     nameErrors,
		EmailErrors:    emailErrors,
		PasswordErrors: passwordErrors,
	}
}
