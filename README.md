# Hotel Management System

A modern hotel management system built with Next.js and MongoDB.

## Features

- Customer management (add, update, delete, search)
- Room management
- Booking management
- User authentication

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hotel-management.git
   cd hotel-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/hotel_management
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Migrating from MySQL to MongoDB

If you have existing data in MySQL and want to migrate to MongoDB, follow these steps:

1. Make sure both MySQL and MongoDB are running.

2. Run the migration script:
   ```bash
   node scripts/migrate-to-mongodb.js
   ```

3. The script will:
   - Connect to your MySQL database
   - Fetch all customers
   - Clear existing data in MongoDB
   - Insert the customers into MongoDB

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Add a new customer
- `PUT /api/customers` - Update a customer
- `DELETE /api/customers?customerRef=123` - Delete a customer
- `GET /api/customers/filter?field=name&value=John` - Filter customers

## License

This project is licensed under the MIT License - see the LICENSE file for details.
