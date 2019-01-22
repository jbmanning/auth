package www

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
)

var (
	MissingFieldErrorCode     = "missing_field"
	ValidationFailedErrorCode = "validation_failed"
	MalformedFieldErrorCode   = "malformed_field"
	ZxcvbnFailureError        = "zxcvbn_failure"
	TopologySimilarError      = "topology_similar"
	NeedsMoreCharTypesError   = "needs_more_types"
	EmailTakenError           = "email_taken"
	InvalidJSONError          = "invalid_json"
	InternalServerError       = "internal_error"
	InvalidEmailPasswordError = "invalid_email_password"
)

type DefaultResponse struct {
	Errors []string `json:"errors"`
}

func GetResp(code int, resp interface{}) (events.APIGatewayProxyResponse, error) {
	body, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}

	return events.APIGatewayProxyResponse{
		StatusCode: code,
		Body:       string(body),
	}, nil
}
