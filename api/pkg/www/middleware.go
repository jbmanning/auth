package www

import (
	"github.com/aws/aws-lambda-go/events"
)

type DefaultHandler func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error)

func ErrorHandlingMiddleware(next DefaultHandler) DefaultHandler {
	return func(request events.APIGatewayProxyRequest) (resp events.APIGatewayProxyResponse, err error) {
		defer func() {
			if r := recover(); r != nil {
				resp, err = GetResp(500, InternalServerError)
			}
		}()

		resp, err = next(request)
		return
	}
}

func CORSMiddleware(next DefaultHandler) DefaultHandler {
	return func(request events.APIGatewayProxyRequest) (resp events.APIGatewayProxyResponse, err error) {
		resp, err = next(request)
		resp.Headers["Access-Control-Allow-Origin"] = "*"
		return
	}
}
