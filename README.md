# Residency / Quarters Allotment Management System

A full-stack application for managing quarters allotment, billing, and complaints for a township/organization.

## Features
- **Admin Dashboard**: Visual analytics of quarters, residents, and complaints.
- **NonEmployee Management**: Register and manage residents.
- **Quarters Management**: Add quarters, manage types, and allot to residents.
- **Billing**: Generate monthly bills and track payments.
- **Complaints**: Maintenance complaint tracking system.
- **Authentication**: Secure login for Admin and Users.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, SQLite, Sequelize

## Setup Instructions

### Prerequisites
- Node.js installed

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`.

## Default Login
You will need to register a user via Postman or Curl first, or use the registration endpoint `/api/auth/register` (Note: UI for registration is not included as per prompt, only Login. You can add a temporary button or use API tool to create the first admin).
**Endpoint**: `POST http://localhost:5000/api/auth/register`
**Body**:
```json
{
  "username": "admin",
  "password": "password123",
  "role": "admin"
}
```

## API Documentation
- **Auth**: `/api/auth/login`, `/api/auth/register`
- **NonEmployees**: `/api/NonEmployees` (CRUD)
- **Quarters**: `/api/quarters`, `/api/quarters` (CRUD)
- **Allotment**: `/api/allotments/allot`, `/api/allotments/cancel/:id` (CRUD)
- **Bills**: `/api/bills` (GET, POST), `/api/bills/:id/pay` (PUT)
- **Complaints**: `/api/complaints` (GET, POST), `/api/complaints/:id/status` (PUT)
