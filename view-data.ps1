# MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# SQL command to view data
$sqlCommand = @"
USE hotel_management;
SELECT * FROM customers;
"@

# Save SQL command to a temporary file
$sqlCommand | Out-File -FilePath "temp.sql" -Encoding UTF8

Write-Host "Viewing database data..."
& "$mysqlPath" -u hoteluser -photelpass -e "source temp.sql"

# Clean up
Remove-Item "temp.sql" 