<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# odh-databrowser-core

.Net MVC Frontend to display odh-api-core data

[![CI/CD](https://github.com/noi-techpark/odh-databrowser-core/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/odh-databrowser-core/actions/workflows/main.yml)

## Project Goals/Requirements:

* .Net Core 5
* Docker Support
* Swagger Support
* Identity Server Integration (Keycloak)
* AngularJS

Test instance
https://frontend.tourism.testingmachine.eu/  
Production instance
https://tourism.databrowser.opendatahub.com

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

## REUSE

This project is [REUSE](https://reuse.software) compliant, more information about the usage of REUSE in NOI Techpark repositories can be found [here](https://github.com/noi-techpark/odh-docs/wiki/Guidelines-for-developers-and-licenses#guidelines-for-contributors-and-new-developers).

Since the CI for this project checks for REUSE compliance you might find it useful to use a pre-commit hook checking for REUSE compliance locally. The [pre-commit-config](.pre-commit-config.yaml) file in the repository root is already configured to check for REUSE compliance with help of the [pre-commit](https://pre-commit.com) tool.

Install the tool by running:
```bash
pip install pre-commit
```
Then install the pre-commit hook via the config file by running:
```bash
pre-commit install
```
