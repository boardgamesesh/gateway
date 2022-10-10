# MODELS

## INFO
Dynamoose has the concept of models; this is a mix of the query/database interaction layer, and the model validation infrastructure. Right now we only have magic users, or users who solely log in via emails that contain a url that has a query string that matches a short-expiry token that is saved temporarily on the user record.

## TODO
1. Create the new user type for google one-click users
2. tighten up the controls and remove `saveUnknown: true` once we know what kind of settings and other shit we want on those users
