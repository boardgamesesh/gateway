# GRAPHQL LAMBDA

## INFO

### USER FLOWS
** MAGIC USER CREATE ACCOUNT **
1. unauthenticated user sends email, requesting an account
2. email send
  a. no existing user with that email: the account is created with a token, and an email sent with that token
  b. user already exists: no user created, and error returned that they cannot create account
3. user clicks link, and is sent to special frontend page
4. user sends `name` and completes account creation

** MAGIC USER UPDATE ACCOUNT **
1. authenticated user sends user partial
2. existing user account is updated and returned from that mutation properly
3. TODO: validate the things being sent (more than already done with tokens for security)

** MAGIC USER GET ACCOUNT **
1. authenticated user requests their own account information
2. query checks their token age, and sends an updated cookie if it's getting crusty
3. TODO: update the headers sent as well so we can localstorage that JWT, and separate the cookie refresh from the JWT with header information

** USER LOOKUP NON-SENSITIVE INFORMATION **
1. ANY user requests a user via id
2. only the name and id are returned so that users can see their friends
3. TODO: send user profile picture/generated pic hash once we generate them

## TODO
1. FIX THE DAMNED TESTS
2. context cookie is set at the very tip top level; it should instead be set at the `user(id)` query resolver, that way we don't send bullshit to users requesting accounts and many other types of queries & mutations
