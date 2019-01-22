package main

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	de "github.com/jbmanning/auth/api/internals/dataEngine"
	"github.com/jbmanning/auth/api/pkg/www"
)

type CreateResponse struct {
	Errors         []string `json:"errors"`
	NameErrors     []string `json:"name_errors"`
	EmailErrors    []string `json:"email_errors"`
	PasswordErrors []string `json:"password_errors"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	params := &de.CreateUserParams{}
	err := json.Unmarshal([]byte(request.Body), params)
	if err != nil {
		return www.GetResp(400, CreateResponse{
			Errors:         []string{www.InvalidJSONError},
			NameErrors:     []string{},
			EmailErrors:    []string{},
			PasswordErrors: []string{},
		})
	}

	creationErrs := de.CreateUser(*params)
	success := len(creationErrs.NameErrors) == 0 &&
		len(creationErrs.EmailErrors) == 0 &&
		len(creationErrs.PasswordErrors) == 0

	code := 201
	if !success {
		code = 400
	}

	return www.GetResp(code, CreateResponse{
		Errors:         []string{},
		NameErrors:     creationErrs.NameErrors,
		EmailErrors:    creationErrs.EmailErrors,
		PasswordErrors: creationErrs.PasswordErrors,
	})
}

func main() {
	h := www.ErrorHandlingMiddleware(www.CORSMiddleware(Handler))
	lambda.Start(h)
}
