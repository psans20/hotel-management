const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'hoteluser',
      password: 'hotelpass',
      database: 'hotel_management'
    });

    console.log('Connected to database');

    // Create customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        email VARCHAR(100),
        nationality VARCHAR(50),
        address TEXT,
        phone VARCHAR(20) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Customers table created');

    // Create bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customerPhone VARCHAR(20) NOT NULL,
        checkInDate DATE NOT NULL,
        checkOutDate DATE NOT NULL,
        roomType VARCHAR(20) NOT NULL,
        roomNo VARCHAR(10) NOT NULL,
        meal VARCHAR(20) NOT NULL,
        noOfDays INT NOT NULL,
        paidTax DECIMAL(10, 2) NOT NULL,
        actualTotal DECIMAL(10, 2) NOT NULL,
        totalCost DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Bookings table created');

    // Insert sample data for customers
    await connection.execute(`
      INSERT INTO customers (name, gender, email, nationality, address, phone) VALUES
      ('John Doe', 'Male', 'john@example.com', 'American', '123 Main St, New York', '1234567890'),
      ('Jane Smith', 'Female', 'jane@example.com', 'British', '456 High St, London', '9876543210'),
      ('Kiran', 'Male', 'smith@gmail.yahoo', 'Indian', '123 Main St, Mumbai', '7894561231')
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('Sample customer data inserted');

    // Insert sample data for bookings
    await connection.execute(`
      INSERT INTO bookings (customerPhone, checkInDate, checkOutDate, roomType, roomNo, meal, noOfDays, paidTax, actualTotal, totalCost) VALUES
      ('1234567890', '2023-04-01', '2023-04-03', 'Single', '101', 'Breakfast', 2, 10.00, 100.00, 110.00),
      ('9876543210', '2023-04-05', '2023-04-07', 'Double', '102', 'Lunch', 2, 12.00, 120.00, 132.00)
      ON DUPLICATE KEY UPDATE customerPhone=customerPhone
    `);
    console.log('Sample booking data inserted');

    // Close connection
    await connection.end();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase(); 