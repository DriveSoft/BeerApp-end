# Documentation

## Queries

### `getCustomer`
- **Description**: Retrieve details of a customer by ID.
- **Arguments**:
  - `id`: ID of the customer.
    - Type: `String`
    - Required: Yes
- **Return Type**: `GetCustomerResponse`

## Mutations

### `signup`
- **Description**: Registers a new user.
- **Arguments**:
  - `signUpInput`: Input data for user registration.
    - Type: `SignUpInput`
    - Required: Yes
- **Return Type**: `SignResponse`

### `signin`
- **Description**: Logs in an existing user.
- **Arguments**:
  - `signInInput`: Input data for user login.
    - Type: `SignInInput`
    - Required: Yes
- **Return Type**: `SignResponse`

### `logout`
- **Description**: Logs out a user.
- **Arguments**:
  - `id`: ID of the user.
    - Type: `String`
    - Required: Yes
- **Return Type**: `LogoutResponse`

### `getNewTokens`
- **Description**: Retrieves new authentication tokens using a refresh token.
- **Arguments**:
  - `customerId`: ID of the customer.
    - Type: `String`
    - Required: Yes
  - `refreshToken`: Refresh token for authentication.
    - Type: `String`
    - Required: Yes
- **Return Type**: `NewTokensResponse`

### `updateCustomer`
- **Description**: Updates customer information.
- **Arguments**:
  - `updateAuthInput`: Updated data for customer.
    - Type: `UpdateAuthInput`
    - Required: Yes
  - `customerId`: ID of the customer.
    - Type: `String`
    - Required: Yes
- **Return Type**: `GetCustomerResponse`

### `deleteCustomer`
- **Description**: Deletes a customer.
- **Arguments**:
  - `id`: ID of the customer to delete.
    - Type: `String`
    - Required: Yes
  - `customerId`: ID of the customer performing the deletion.
    - Type: `String`
    - Required: Yes
- **Return Type**: `DeleteCustomerResponse`


# Node.js recruitment task - senior

This repository contains the base code for recruitment exercise. Complete the tasks listed below and publish the solution on your github. Send us a link to your repository at least 1 day before the interview. 
We will discuss the proposed solution during the interview. You should be ready to present the working application on your local machine.

There is some key features that must be implemented in the recruitment task:

- CRUD operations for customers (get, update, delete) by id or email;

- login and signup operations for customers;

- roles USER and ADMIN;

- access token;

- refresh token;

- restrict access to get customers operation from unauthenticated users;

- restrict access to delete customer and update customer operations from unauthenticated users and customers with USER role;

- ability to verify customer's account after signup with activation code;

## Installation

```bash
# Install packages
npm install

npx prisma generate
```

## Local database

```bash
# Setup local postgres
docker run --name recruitment-task -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11.16

#create .env file with your local database credentials

# Run migration
npx prisma migrate dev

# Run db seed
npx prisma db seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
