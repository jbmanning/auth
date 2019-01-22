package dataEngine

import (
	lev "github.com/agnivade/levenshtein"
	"github.com/jbmanning/auth/api/pkg/www"
	"github.com/nbutton23/zxcvbn-go"
	"regexp"
)

var topologies = []string{
	"ullllldd",
	"ulllllldd",
	"ullldddd",
	"llllllld",
	"ullllllldd",
	"ulllllld",
	"ullllldddd",
	"ulllldddd",
	"lllllldd",
	"ullllllld",
	"ullllddd",
	"ulldddds",
	"llllllll",
	"ulllllddd",
	"llllllldd",
	"llsddlddl",
	"lllllllld",
	"ullllldds",
	"ulllllldddd",
	"ulllllllldd",
	"ulllllds",
	"ulllllllld",
	"ullllldddds",
	"lllllllll",
	"lllllllldd",
	"ullllllddd",
	"lllllddd",
	"ullldddds",
	"ullllllldddd",
	"ulllllsdd",
	"uuuuuudl",
	"lllldddd",
	"ddulllllll",
	"ullsdddd",
	"ulllldds",
	"ullllllds",
	"ddullllll",
	"llllsddd",
	"llllllllld",
	"llllldddd",
	"llllllllll",
	"llllllddd",
	"ullllllllldd",
	"ullllllllld",
	"ddddddul",
	"ulllllllddd",
	"ulllllldds",
	"uuuuuuds",
	"uudllldddu",
	"ullllsdd",
	"ulllllsd",
	"lllsdddd",
	"lllllldddd",
	"ullllllldds",
	"ddulllll",
	"ulllllllds",
	"ullllddds",
	"ulllldddds",
	"ulllsdddd",
	"ullllsddd",
	"ulllllldddds",
	"ulllddds",
	"llllsdddd",
	"llllllsdd",
	"lllllldds",
	"ddddulll",
	"dddddddd",
	"ullllllsd",
	"uldddddd",
	"llllllsd",
	"udllllllld",
	"lllllllllll",
	"lllllllllld",
	"llllldds",
	"llllddds",
	"ulllllllldddd",
	"uuuuuuuu",
	"ulllsddd",
	"ullllllsdd",
	"ulllllddds",
	"lllllsdd",
	"ullllsdddd",
	"ulllddddd",
	"ulldddddd",
	"ullddddd",
	"llllllllldd",
	"llllllldds",
	"lllllllddd",
	"llllllds",
	"llldddds",
	"uuullldddd",
	"ulllllsddd",
	"ulllllllsd",
	"llllllllsd",
	"llllllldddd",
	"ulllllsdddd",
	"lllllllds",
	"lllldddds",
	"ddddullll",
	"uudllldddd",
}
var lowerRe = regexp.MustCompile("[a-z]")
var upperRe = regexp.MustCompile("[A-Z]")
var digitRe = regexp.MustCompile("[0-9]")
var specialRe = regexp.MustCompile("[^lud]")

var emailReg = regexp.MustCompile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")

func getTopology(in string) string {
	out := lowerRe.ReplaceAllString(in, "l")
	out = upperRe.ReplaceAllString(out, "u")
	out = digitRe.ReplaceAllString(out, "d")
	out = specialRe.ReplaceAllString(out, "s")
	return out
}

func validateName(namePtr *string) []string {
	errs := []string{}
	if namePtr == nil {
		errs = append(errs, www.MissingFieldErrorCode)
	} else {
		name := *namePtr
		if len(name) < 2 || len(name) > 60 {
			errs = append(errs, www.MalformedFieldErrorCode)
		}
	}

	return errs
}

func validateEmail(emailPtr *string) []string {
	errs := []string{}
	if emailPtr == nil {
		errs = append(errs, www.MissingFieldErrorCode)
	} else {
		email := *emailPtr
		if !emailReg.MatchString(email) {
			errs = append(errs, www.MalformedFieldErrorCode)
		}
	}

	return errs
}

func validatePassword(params CreateUserParams) []string {
	errs := []string{}
	if params.Password == nil {
		errs = append(errs, www.MissingFieldErrorCode)
	} else {
		password := *params.Password
		if len(password) < 10 || len(password) > 72 {
			errs = append(errs, www.MalformedFieldErrorCode)
		}

		zxStatus := zxcvbn.PasswordStrength(password, []string{*params.Email, *params.Name})
		if zxStatus.Score < 3 {
			//zxStatus.feedback.suggestions.map((item) => {
			//	errors.push(item);
			//});
			errs = append(errs, www.ZxcvbnFailureError)
		}

		// topology
		pwdTopology := getTopology(password)
		for i := 0; i < len(topologies); i++ {
			if lev.ComputeDistance(pwdTopology, topologies[i]) <= 2 {
				errs = append(errs, www.TopologySimilarError)
				break
			}
		}

		var matches = map[rune]bool{}
		count := 0
		for _, c := range password {
			if _, ok := matches[c]; !ok {
				matches[c] = true
				count++
			}
		}

		if count < 2 {
			errs = append(errs, www.NeedsMoreCharTypesError)
		}
	}

	return errs
}
