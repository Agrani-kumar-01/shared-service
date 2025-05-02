# Social Shared API

Social Shared API Code

## Getting Started

This project is built using NodeJS version 20.18.0 which connects to a nosql database, at the moment MongoDB 7.0.14
The following is a list of essential technologies:

- [NodeJS](https://nodejs.org/en/) version 20.18.0 or newer
- [MongoDB](https://www.mongodb.com/) version 7.0.14

## Recommended Technologies

- [Homebrew](https://brew.sh/) to install NVM
- NVM - Node Version Manager is used to manage and use different versions of node
- run `brew install nvm` to install on terminal
- run `nvm install <version>` where version is 20.18.0 or newer on terminal

#### Scripts

Build: Run `npm run build` in project root to generate build files

## Code Structure

> Folder structure options and naming conventions

### A typical top-level directory layout

    .
    ├── src
         ├── enums
         ├── http-response
         ├── mailer
         ├── models
         ├── schemas
         ├── swagger
         ├── utils
    └── package.tson
    └── tsconfig.json
    └── README.md

> Use short lowercase names at least for the top-level files and folders except
> `LICENSE`, `README.md`

### Root folders

+ *src* - holds the whole shared code

### src folder

+ *enums* - holds the shared enums
+ *http-response* - holds the http response wrapper
+ *mailer* - holds the mail sending functionality
+ *models* - holds the shared mongoose models
+ *schemas* - holds the shared schemas
+ *swagger* - holds the components and common structure of api documentation
+ *utils* - contains shared common utils