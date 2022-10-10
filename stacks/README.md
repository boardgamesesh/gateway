# STACKS

These are SST stacks; general groupings of CI/CD infrastructure that are deployed into AWS.

## INFO
1. database has no range key because user access is generally only ID lookups; queries are only run against `email`
2. the api url isn't imported because this service is a small federated slice; we'll import this URL in our gateway
3. The function needs access to the DB to CRUD user records, it also needs access to SES to send the login emails
4. 

## TODO
1. `Config` is being used to store the db name, we could and probably should use `Config` to store and retrieve our secrets as well
2. remove the old setup where we were still using multiple routes as we were also hosting the restful endpoint that we no longer need