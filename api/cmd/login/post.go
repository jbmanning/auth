package main

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/jbmanning/auth/api/internals/crypto"
	de "github.com/jbmanning/auth/api/internals/dataEngine"
	"github.com/jbmanning/auth/api/pkg/www"
)

type LoginParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Errors []string `json:"errors"`
	Name   string   `json:"name"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	params := &LoginParams{}
	var user *de.User
	errs := []string{}

	err := json.Unmarshal([]byte(request.Body), params)
	if err != nil {
		errs = append(errs, www.InvalidJSONError)
	} else {
		user = de.GetUser(params.Email)
	}

	if user == nil || !crypto.CompareHashAndPassword(user.Hash, params.Password) {
		user = nil
		errs = append(errs, www.InvalidEmailPasswordError)
	}

	code := 400
	resp := LoginResponse{
		Errors: errs,
	}
	if user != nil {
		code = 200
		resp.Name = user.Name

	}

	body, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}

	return events.APIGatewayProxyResponse{
		StatusCode: code,
		Body:       string(body),
	}, nil
}

func main() {
	h := www.ErrorHandlingMiddleware(www.CORSMiddleware(Handler))
	lambda.Start(h)
}
