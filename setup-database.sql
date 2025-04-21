-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  email VARCHAR(100),
  nationality VARCHAR(50),
  address TEXT,
  phone VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customerPhone) REFERENCES customers(phone) ON DELETE CASCADE
);

-- Insert sample data for customers
INSERT INTO customers (name, gender, email, nationality, address, phone) VALUES
('John Doe', 'Male', 'john@example.com', 'American', '123 Main St, New York', '1234567890'),
('Jane Smith', 'Female', 'jane@example.com', 'British', '456 High St, London', '9876543210'),
('Kiran', 'Male', 'smith@gmail.yahoo', 'Indian', '123 Main St, Mumbai', '7894561231');

-- Insert sample data for bookings
INSERT INTO bookings (customerPhone, checkInDate, checkOutDate, roomType, roomNo, meal, noOfDays, paidTax, actualTotal, totalCost) VALUES
('1234567890', '2023-04-01', '2023-04-03', 'Single', '101', 'Breakfast', 2, 10.00, 100.00, 110.00),
('9876543210', '2023-04-05', '2023-04-07', 'Double', '102', 'Lunch', 2, 12.00, 120.00, 132.00); 