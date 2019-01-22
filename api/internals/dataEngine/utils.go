package dataEngine

import (
	"github.com/jbmanning/auth/api/pkg/www"
	"reflect"
)

type FieldsErrorResponse struct {
	Code   string       `json:"code"`
	Errors []FieldError `json:"errors"`
}

type FieldError struct {
	Field string `json:"field"`
	Code  string `json:"code"`
}

// https://gist.github.com/drewolson/4771479
func validateParams(params interface{}) *FieldsErrorResponse {
	v := reflect.ValueOf(params)

	var errs []FieldError
	for i := 0; i < v.NumField(); i++ {
		fieldType := v.Type().Field(i)
		tag := fieldType.Tag.Get("json")
		fieldValue := v.Field(i)

		if fieldValue.IsNil() {
			errs = append(errs, FieldError{
				Field: tag,
				Code:  www.MissingFieldErrorCode,
			})
		}
	}

	if len(errs) > 0 {
		return &FieldsErrorResponse{
			Code:   www.ValidationFailedErrorCode,
			Errors: errs,
		}
	}
	return nil
}
