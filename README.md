# Auth
**_WIP_**: This project will support authentication, authorization, and user management using 
techniques from [OpenID Connect](https://openid.net/connect/) (OIDC) and best practices from 
[OWASP](https://www.owasp.org/index.php/Main_Page). The goal of this project is to learn
to implement a framework from scratch (OpenID) and ensure the use of secure coding practices 
to prevent basic attacks. I am certainly not a security expert and I do not claim this is
a secure implementation. 

**I do not recommend using this project in a production environment
without first verifying it's security.**

## Status
Estimations of implementation status. Many of these features are dependent on one another,
so if one feature takes longer to implement it may hold up other features.

- [ ] User management - 60%
    - [ ] Create
        - [x] Adding user to database
        - [ ] Sending email confirmation
    - [ ] Update
    - [ ] Delete
- [ ] OpenID Connect - 15%
    - [ ] Document endpoints and functionality
    - [ ] Implementation
- [ ] Web Interface - 45%
    - [ ] Interfaces
        - [x] Signup
        - [x] Login
        - [ ] Profile
        - [ ] OIDC Authorization
    - [ ] API interaction   - 20%
        - [ ] User management (Create, Update)
        - [ ] Session (Login, Authorization)


## Deploying
User management and OIDC were implemented using the [Serverless Framework](https://serverless.com/) 
and hosted on [Amazon Web Services](https://aws.amazon.com/) using AWS Lambda, DynamoDB, and API Gateway.

These instructions will get you a copy of the project up and running through your AWS account.

### Prerequisites

This setup is to ensure the serverless framework has everything it needs to function.

1. Node.js v6.5.0 or later.
2. An AWS account. If you don't already have one, you can sign up for a [free trial](https://aws.amazon.com/s/dm/optimization/server-side-test/free-tier/free_np/)
   that includes 1 million free Lambda requests per month.
3. Set-up your Provider Credentials -> Watch the [video](https://www.youtube.com/watch?v=KngM5bfpttA)
   on setting up credentials

### Installing

Installing dependencies is as simple as running `npm install`, followed by using serverless to deploy the
project to the AWS account configured on your local machine.

```
git clone https://github.com/jbmmhk/auth
npm install -g serverless
npm install
serverless deploy
```

Once the script has finished, you will have a functional API running through your AWS account. Towards the
end of the script's execution you should see the URLs for the endpoints attached to API Gateway through your account.

```
endpoints:
  POST - https://<my-url>.execute-api.<my-region>.amazonaws.com/dev/create
```

To test the functionality, you may submit a HTTP POST request to the url you recieved with `email` and `password` parameters
or invoke the function using the serverless CLI and pre-built parameters from `create.json`.

```
serverless invoke -f create -p create.json
```

If submitted with valid parameters, you should recieve a 200 response with an empty errors array.

```json
{
  "errors": []
}
```
