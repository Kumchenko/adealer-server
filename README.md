![AppleDealer](https://github.com/Kumchenko/adealer-server/assets/60291758/80384b93-be96-4dce-a615-d2489f7629e8)
# ADealer Server

#### Summary

It's Backend part of [ADealer project](https://github.com/Kumchenko/appledealer), which meet the requirements of RESTfulAPI.

This project implements:

-   Configured storing information in relational database about Orders, CallMes, Services and more.
-   Routes with and without authorization.
-   Routes without Employee Authorization, which can retrieve sensitive data are protected with Authentication of Client, such like GET Order Info with requiring Tel number specified in Order.
-   Authorization Logic for Employees with using JsonWebToken and access_token & refresh_token.
-   CRUD operations for Orders, Calls.
-   Read operations for Models, Components, Services and Qualities with supporting different params.
-   Own type of Errors with i18n property.
-   Handling errors.

#### Technology stack

Node.js, Express, TypeScript, Prisma, JsonWebToken, PostgreSQL, Prettier

#### Table of contents

-   [Getting started](#getting-started)
-   [Usage](#usage)
    -   [NPM run scripts](#npm-run-scripts)
    -   [Endpoints](#endpoints)
        -   [Order endpoints](#orders-endpoints)
        -   [CallMes endpoints](#callmes-endpoints)
        -   [Employee endpoints](#employee-endpoints)
        -   [Other endpoints](#other-endpoints)
    -   [Error handling](#error-handling)
-   [Contacts](#contacts)

---

## Getting started

1. Clone the repo:

```bash
git clone https://github.com/Kumchenko/adealer-server.git
```

2. Create user and schema in your database and get Database connection string.

3. Configure .env files:

-   .env using when run in development mode,
-   .env.preview – for preview mode

Env variables:

| Variable     | Description                                         |
| :----------- | :-------------------------------------------------- |
| DATABASE_URL | Database connection string for Prisma               |
| PORT         | Port on which Server will start and listen requests |
| SECRET_KEY   | Secret key for JSON Web Token                       |
| NODE_ENV     | Type of NodeJS environment: development/production  |

_Example values showed in .env.example_

4. Install all dependencies, apply Prisma Migrations for your Database:

```bash
npm build
```

5. Add some basic data through Prisma Studio(how to open, see below), such like employees, models, components, qualities, services.
   Recommended format for IDs of models, components and qualities is _kebab-case_.

Example:
| Entity | Example ID value |
| :-------- | :--------------- |
| Model | iphone-13-mini |
| Component | rear-camera |
| Quality | original |

6. Run the development server:

```bash
npm run dev
```

7. Default API address after starting server: <http://localhost:5008/api/>

8. If server start, you can send Request to <http://localhost:5008/api/health>, You must receive 200 Status, if server started successfully:
    > { "message": "OK" }

---

## Usage

### NPM run scripts

| Script     | Description                                                                  |
| :--------- | :--------------------------------------------------------------------------- |
| dev        | Run project by Nodemon in development mode                                   |
| pre        | Run project by Nodemon in preview mode                                       |
| start      | Run project by ts-node in preview mode                                       |
| build      | Install all dependencies, apply Prisma Migrations                            |
| prisma-dev | Run Prisma Studio with .env String Connection                                |
| prisma-pre | Run Prisma Studio with .env.preview String Connection                        |
| pretty     | Format .js, .ts, .jsx, .tsx, .json files with Prettier using supplied config |

---

### Endpoints

There are many endpoints, they can be divided in two ways:

-   By authorization: some routes require authorization (/api/auth/\*\*\*), some – not (/api/\*\*\*)

-   By the Entity you want to interact with:
    -   /orders
    -   /callmes
    -   /employee
    -   /service
    -   /component
    -   /quality
    -   /model

Access for them you can get by /api route, so Server process requests only to routes, that starts with /api

**Further details about endpoints you can find below in according tables.**

---

#### Orders Endpoints

Endpoints that doesn't require Authorization:

| Method | URL                               | Description                                                          | Additional                                                                               |
| ------ | --------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| GET    | /api/orders/order/{id}/?tel={tel} | Retrieve Order by ID with Authentication by Phone number of Customer | –                                                                                        |
| POST   | /api/orders/                      | Create Order                                                         | Must contain: name, surname, tel, email, modelId, componentId, qualityId in Request Body |

Endpoints that require Authorization:

| Method | URL                         | Description                                                                                                                                                          | Additional                                                                                                                            |
| ------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/auth/orders/order/{id} | Retrieve Order with specified id                                                                                                                                     | –                                                                                                                                     |
| DELETE | /api/auth/orders/order/{id} | Delete Order with specified id                                                                                                                                       | –                                                                                                                                     |
| UPDATE | /api/auth/orders/order/{id} | Update Order with specified id                                                                                                                                       | Body can contain all the same like in Create Request and also status string which you can find in Prisma schema                       |
| GET    | /api/auth/orders/stats      | Retrieve Orders statistics, like count of all, created, processing, done orders, popular modelId and componentId                                                     | –                                                                                                                                     |
| GET    | /api/auth/orders/           | Retrieve sorted Orders with pagination by specified filter, datetime range, id, modelId, componentId, qualityId and also by coincidence of name, surname, tel, email | Optional params: id, name, surname, tel, email, modelId, componentId, qualityId, filter, perPage, page, from, to, apply, sort, sortBy |

---

#### CallMes Endpoints

Endpoints that doesn't require Authorization:

| Method | URL           | Description   | Additional                              |
| ------ | ------------- | ------------- | --------------------------------------- |
| POST   | /api/callmes/ | Create CallMe | Must contain: name, tel in Request Body |

Endpoints that require Authorization:

| Method | URL                           | Description                                                                                                           | Additional                                                                                          |
| ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| GET    | /api/auth/callmes/callme/{id} | Retrieve CallMe with specified id                                                                                     | –                                                                                                   |
| DELETE | /api/auth/callmes/callme/{id} | Delete CallMe with specified id                                                                                       | –                                                                                                   |
| UPDATE | /api/auth/callmes/callme/{id} | Update CallMe with specified id                                                                                       | Body can contain all the same like in Create Request and also created, checked ISO datetime strings |
| GET    | /api/auth/callmes/stats       | Retrieve CallMes statistics, like count of all, created and checked CallMes                                           | –                                                                                                   |
| GET    | /api/auth/callmes/            | Retrieve sorted CallMes with pagination by specified filter, datetime range, id, and also by coincidence of name, tel | Optional params: id, name, tel, filter, perPage, page, from, to, apply, sort, sortBy                |

---

#### Employee Endpoints

Endpoints that doesn't require Authorization:

| Method | URL                    | Description                                                                                             | Additional                                                                                                                                    |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/employee/login    | Login Employee                                                                                          | Body must contain login and password. Client receive **access_token** and **refresh_token** cookies with maxAge 15 and 30 minutes accordingly |
| GET    | /api/employee/connect/ | Get **connected** cookie for CrossSite cookies Check Flow (read below)                                  | Beginning of CrossSite cookies Check Flow                                                                                                     |
| GET    | /api/employee/test     | Server checks for presence of **connected** cookie, that confirm support of CrossSite cookies on client | End of CrossSite cookies Check Flow. Receive 200 if Success, 4\*\* – if not                                                                   |
| GET    | /api/employee/logout   | Logout Employee                                                                                         | This endpoint invalidate **access_token** and **refresh_token** cookies                                                                       |

Endpoints that require Authorization:

| Method | URL                        | Description                                            | Additional                                              |
| ------ | -------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| GET    | /api/auth/employee/refresh | Refresh **access_token** and **refresh_token** cookies | If **refresh_token** valid – 200 Status, otherwise 401. |
| GET    | /api/auth/employee/info    | Retrieve info about authorized Employee                | –                                                       |

---

#### Other Endpoints

Endpoints that doesn't require Authorization:

| Method | URL                       | Description                                                                                             | Additional                                   |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| GET    | /api/service              | Retrieve services for specified modelId or componentId or for all together, otherwise just all services | Optional params: modelId, componentId        |
| GET    | /api/model                | Retrieve all modelIds                                                                                   | –                                            |
| GET    | /api/component/${modelId} | Retrieve all components for modelId, if specified, otherwise just all componentIds                      | –                                            |
| GET    | /api/quality              | Retrieve all qualityIds                                                                                 | –                                            |
| GET    | /api/health               | For check of Server health                                                                              | If server run – 200 Status with 'OK' message |

---

### Error Handling

This project has specific internal Error type, it's called ApiError:

```
{
    status: number
    name: 'ApiError'
    i18n: string
    message: string
}
```

But in Response it returns **status code** of request and data of such type(see below), because not all errors can be ApiErrors:

```
{
    name: string
    i18n: string
    message: string
    stack?: string
}
```

---

## Contacts

Kyrylo Kumchenko – kirillkumchenko@gmail.com

Project link: <https://github.com/Kumchenko/adealer-server>
