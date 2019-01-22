package crypto

import "golang.org/x/crypto/bcrypt"

var HashCost = 14

func CreateHash(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), HashCost)
	if err != nil {
		panic(err)
	}

	return string(hash)
}

func CompareHashAndPassword(hash string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
