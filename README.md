# GATEWAY

## INFO
### BEFORE RUNNING THE SERVICE
- log into the aws account
- create a new user, assign permissions directly to it, the only permission being: administrator access
- copy the KEY ID and the SECRET ACCESS KEY
- add them to the `~/.aws/credentials` like this:
```
[boardgamesession]
aws_access_key_id = KEY_ID
aws_secret_access_key = SECRET_KEY
```
- add configuration to your `~/.aws/config` as well:
```
[profile boardgamesession]
output=json
region=ap-southeast-2
```

### RUNNING THE SERVICE
run the service locally with `make start`
deploy the service to the production environment once changes approved with `make deploy`

### TESTING THE SERVICE
run the command `make test`

## TODOS
2. more documentation on the hairy bits, like the invites pathway being a bit clunky
3. support multi-invites
4. re-implement the auth cookie attacher, now that `@as-integrations` have updated their methodology and it isn't **complete ass:** https://www.npmjs.com/package/@as-integrations/aws-lambda
