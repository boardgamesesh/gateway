# auth

## INFO
### BEFORE RUNNING THE SERVICE
- log into the aws account
- create a new user, assign permissions directly to it, the only permission being: administrator access
- copy the KEY ID and the SECRET ACCESS KEY
- add them to the `~/.aws/credentials` like this:
```
[boarganise]
aws_access_key_id = KEY_ID
aws_secret_access_key = SECRET_KEY
```
- add configuration to your `~/.aws/config` as well:
```
[profile boarganise]
output=json
region=ap-southeast-2
```

### RUNNING THE SERVICE
run the service locally with `make start`
deploy the service to the production environment once changes approved with `make deploy`

### TESTING THE SERVICE
run the command `make test`

## TODOS
1. test setups are all pretty broken after the move to SST
2. load `.env` credits, and solve a way to have them stored in the `config` object instead of **only on drew's machine**
