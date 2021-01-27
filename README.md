# odh-databrowser-core

.Net MVC Frontend to display odh-api-core data

## Project Goals/Requirements:

* .Net Core 5
* Docker Support
* Swagger Support
* Identity Server Integration (Keycloak)
* AngularJS

Visible under
https://frontend.tourism.testingmachine.eu/

## Getting started:

Clone the repository

### Environment Variables

* OAUTH_AUTORITY (Oauth Server Authority URL)
* OAUTH_CLIENTID (Client ID for accessing Oauth Server)


### using Docker

`docker-compose up` starts the appliaction on http://localhost:6002/

### using .Net Core CLI

Install .Net Core SDK 5\
go into \odh-databrowser-core\ folder \
`dotnet run`
starts the application on 
https://localhost:6001/
http://localhost:6002/
