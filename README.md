# SIMPLE MARKET PLACE NODE PROJECT

This repository contains a list of REST API endpoint for operating a simple marketplace, It's built using PostgreSQL as database and Nodejs as backend.

## DOCS

The API documentation can be found [here](https://aashvi-oy.github.io/marketplace-node/)

## Environment Setup

To run this project, make sure you have the following installed on your system.

1: [Nodejs](https://nodejs.org/en/download/)

2: [Visual Studio Code](https://code.visualstudio.com/)

3: [PostgreSQL](https://www.postgresql.org/download/)

4: [Prisma](https://www.prisma.io/docs/getting-started/quickstart)

Before moving forward, confirm that the NodeJs is installed by checking its version with 'node -v' command. Also check that you have YARN installed with the 'yarn -v' command.
Next, check the installation of PostgreSQL database with 'postgres --version' command and check that its running with 'psql --version' command.

## Using docker

If you have docker and docker-compose installed on your system, you can use the following command to start the application.
Creating of database, tables and uploading the initial data is done automatically by the docker-compose file. It will also
take care of installing the required modules and starting the application. In case you don't want to use docker, you can follow the steps below.

```bash
docker-compose up
```

## Creating Database

You can either create a database using [pgAdmin](https://www.pgadmin.org/download/) or straight up use raw SQL. pgAdmin comes with an easy to follow UI.
In order to create database using raw SQL queries, all you need to do is to do is connect to Postgres using 'psql -U postgres' command. Later, you can execute SQL queries from within terminal.
e.g.

Connecting to PostgreSQL:
`psql -U postgres`

Creating testdb Database:
`CREATE DATABASE testdb;`

Connecting to recently created Database:
`\c testdb`

Create Table:

```
CREATE TABLE table_name (
  field_name TYPE CONSTRAINTS,
  field_name TYPE(args) CONSTRAINTS
  ...
);
```

## Running the Application

To run the application, move to the source folder i.e. the folder contains 'package.json' file and execute the following command:

```
yarn install
yarn run serve
```

If everything goes well, you should see `Server is running at http://localhost:8080`. Move to (http://localhost:8080/) in default browser.
