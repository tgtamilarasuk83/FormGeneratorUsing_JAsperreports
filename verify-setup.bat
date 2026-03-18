#!/bin/bash
# Windows batch file - save as "verify-setup.bat"

@echo off
REM Colors for output
setlocal enabledelayedexpansion

echo.
echo ================================================
echo  Resume Form - Setup Verification Script
echo ================================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check npm dependencies
echo.
echo [2/4] Checking npm dependencies...
cd /d "%~dp0"
if not exist "node_modules" (
    echo ⚠️  node_modules not found. Installing...
    call npm install
) else (
    echo ✅ node_modules found
)

REM Check Java
echo.
echo [3/4] Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found. Please install JDK 8 or later
    exit /b 1
) else (
    echo ✅ Java is installed
)

REM Check required files
echo.
echo [4/4] Checking required files...
set missing=0

if not exist "app.js" (
    echo ❌ Missing: app.js
    set missing=1
)
if not exist "generateReport.java" (
    echo ❌ Missing: generateReport.java
    set missing=1
)
if not exist "public\index.html" (
    echo ❌ Missing: public\index.html
    set missing=1
)
if not exist "reports\Blank_A4_1.jrxml" (
    echo ❌ Missing: reports\Blank_A4_1.jrxml
    set missing=1
)

if %missing%==0 (
    echo ✅ All required files found
) else (
    exit /b 1
)

REM Check lib folder
echo.
if not exist "lib" (
    echo ⚠️  lib\ folder not found. You'll need to add JasperReports JARs.
    echo    Create lib\ folder and copy JARs from jasperreports-7.0.3-project/dist/
    echo    Also add MySQL JDBC driver to lib\
) else (
    echo ✅ lib\ folder found
)

REM Compile Java
echo.
echo [BONUS] Compiling generateReport.java...
javac -cp "lib/*;." generateReport.java 2>nul
if errorlevel 1 (
    echo ⚠️  Could not compile Java. Make sure lib\ has all JARs
) else (
    echo ✅ generateReport.java compiled successfully
)

echo.
echo ================================================
echo ✅ Setup verification complete!
echo.
echo Next steps:
echo 1. Make sure MySQL is running on localhost:3306
echo 2. Create database: mysql -u root -p < setup.sql
echo 3. Run: node app.js
echo 4. Open: http://localhost:5000
echo ================================================
echo.

pause
