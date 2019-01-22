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

	err := json.Unmarshal([]byte(request.Body), params)
	if err != nil {
		return www.GetResp(400, LoginResponse{
			Errors: []string{www.InvalidJSONError},
		})
	} else {
		user = de.GetUser(params.Email)
	}

	if user == nil || !crypto.CompareHashAndPassword(user.Hash, params.Password) {
		user = nil
		return www.GetResp(400, LoginResponse{
			Errors: []string{www.InvalidEmailPasswordError},
		})
	}

	code := 400
	if user != nil {
		code = 200
	}

	return www.GetResp(code, LoginResponse{
		Errors: []string{},
		Name:   user.Name,
	})
}

func main() {
	h := www.ErrorHandlingMiddleware(www.CORSMiddleware(Handler))
	lambda.Start(h)
}
