# MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

Write-Host "Checking customer data..."
& "$mysqlPath" "--user=hoteluser" "--password=hotelpass" "-e" @"
USE hotel_management;
SELECT 
    customerRef as 'Ref',
    customerName as 'Name',
    motherName as 'Mother Name',
    gender as 'Gender',
    postCode as 'PostCode',
    mobile as 'Mobile',
    email as 'Email',
    nationality as 'Nationality'
FROM customers;
"@ 