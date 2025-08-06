# RevoBank Backend API

## Overview
This project is designed to build a secure and scalable banking API for **RevoBank** using **NestJS** and **Prisma**. It provides essential banking operations, including user management, account management, and transaction processing. The API also ensures secure authentication via JWT and role-based access control.

## Features
- **User Authentication**: Users can register, log in, and view/update their profile.
- **Account Management**: Users can create, retrieve, update, and delete their bank accounts.
- **Transaction Management**: Users can deposit, withdraw, and transfer funds between accounts.
- **Admin Access**: Admin users have full access to manage users, accounts, and transactions.
- **Testing**: Comprehensive unit and integration tests are included for all API endpoints.
- **Deployment**: The API is deployed on platforms such as Render, Railway, or Fly.io.

## Technologies Used
- **NestJS**: A progressive Node.js framework for building efficient, scalable APIs.
- **Prisma**: An ORM for database management, handling schema migrations, and querying databases.
- **JWT (JSON Web Token)**: Secure token-based authentication for users.
- **Database**: PostgreSQL, MySQL, or SQLite (configured using Prisma).
- **Testing Tools**: Jest for unit and integration testing.
- **Deployment**: Render, Railway, or Fly.io for live deployment.

## How to Run the Project Locally

### Prerequisites
- Node.js (v14.x or higher)
- Database (PostgreSQL, MySQL, or SQLite)
- Prisma CLI (`npm install prisma -g`)

### URL
- [**API LINK**](https://milestone-4-rijal-muhammad-kamil-production.up.railway.app/)

### Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/revobank-backend.git
    cd revobank-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your `.env` file based on `.env.example`:
    ```bash
    cp .env.example .env
    ```

4. Configure your database settings in the `.env` file (e.g., database URL, JWT secret).

5. Run Prisma migrations to set up the database:
    ```bash
    npx prisma migrate dev
    ```

6. Start the NestJS application:
    ```bash
    npm run start:dev
    ```

7. Your API should now be running locally at `http://localhost:3000`.

## API Endpoints

### User Module
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in and receive a JWT.
- `GET /user/profile`: Retrieve the logged-in user’s profile.
- `PATCH /user/profile`: Update the logged-in user’s profile.

### Account Module
- `POST /accounts`: Create a new bank account for the user.
- `GET /accounts`: List all accounts for the user.
- `GET /accounts/:id`: Get details of a specific account.
- `PATCH /accounts/:id`: Update an existing bank account.
- `DELETE /accounts/:id`: Delete a bank account.

### Transaction Module
- `POST /transactions/deposit`: Deposit money into an account.
- `POST /transactions/withdraw`: Withdraw money from an account.
- `POST /transactions/transfer`: Transfer money between accounts.
- `GET /transactions`: List all transactions for the logged-in user.
- `GET /transactions/:id`: View details of a specific transaction.

## Authentication & Authorization
- **JWT-based authentication** is used for securing API endpoints.
- **Role-based access control** ensures:
  - Users can manage only their own accounts and transactions.
  - Admins can access all users’ data.

## Testing
1. To run unit and integration tests, use the following command:
    ```bash
    npm run test
    ```

2. Jest will run the tests and provide feedback on the functionality, including error handling and business logic validation.

## Deployment

### Database Deployment
- Use **Supabase** for hosting your relational database.

### Backend Deployment
- Deploy your NestJS backend to **Render**, **Railway**.
- After deployment, ensure the API is accessible via a public URL and can connect to the hosted database.

### Deployment URL
Once deployed, you can access the live API at:

- [**Live API Link**](https://your-deployment-url.com)

