@echo off
REM Project Setup Script for Global Cyber IT - HR Management System (Windows)
REM Author: Development Team
REM Description: Automated setup script for Windows development environment

title Global Cyber IT - HR Management System Setup

REM Colors for output (Windows doesn't support colors in batch easily, so using echo)
REM Project configuration
set PROJECT_NAME=Global Cyber IT - HR Management System
set NODE_VERSION=18.17.0
set PYTHON_VERSION=3.9
set POSTGRES_VERSION=14

echo ======================================
echo   %PROJECT_NAME%
echo   Automated Setup Script (Windows)
echo ======================================
echo.

echo [INFO] Starting automated setup process...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [WARNING] Running as administrator detected
    echo This script should be run as a regular user for most operations
    echo.
)

REM Function to check system requirements
echo [INFO] Checking system requirements...
echo Operating System: Windows
echo.

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_CURRENT=%%i
    echo [INFO] Node.js found: %NODE_CURRENT%
) else (
    echo [ERROR] Node.js not found. Please install Node.js %NODE_VERSION% from https://nodejs.org/
    echo After installation, rerun this script.
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_CURRENT=%%i
    echo [INFO] npm found: %NPM_CURRENT%
) else (
    echo [ERROR] npm not found. Please reinstall Node.js with npm.
    pause
    exit /b 1
)

REM Check if Python is installed
echo [INFO] Checking Python installation...
python --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=2" %%i in ('python --version') do set PYTHON_CURRENT=%%i
    echo [INFO] Python found: %PYTHON_CURRENT%
) else (
    echo [ERROR] Python not found. Please install Python %PYTHON_VERSION%+ from https://python.org/
    echo Make sure to add Python to PATH during installation.
    pause
    exit /b 1
)

REM Check if pip is available
pip --version >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] pip is available
) else (
    echo [ERROR] pip not found. Please reinstall Python with pip.
    pause
    exit /b 1
)

REM Check for PostgreSQL
echo [INFO] Checking PostgreSQL installation...
psql --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=3" %%i in ('psql --version') do set POSTGRES_CURRENT=%%i
    echo [INFO] PostgreSQL found: %POSTGRES_CURRENT%
) else (
    echo [WARNING] PostgreSQL not found.
    echo Please install PostgreSQL %POSTGRES_VERSION% from https://postgresql.org/download/windows/
    echo Or install via package manager like Chocolatey: choco install postgresql
    echo.
    set /p CONTINUE="Continue without PostgreSQL? (y/N): "
    if /i not "%CONTINUE%"=="y" (
        echo Setup cancelled. Please install PostgreSQL and rerun the script.
        pause
        exit /b 1
    )
)

REM Create environment configuration file
echo [INFO] Creating environment configuration...
(
echo # Database Configuration
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=globalcyber_hr
echo DB_USER=hr_admin
echo DB_PASSWORD=hr_secure_2024
echo DATABASE_URL=postgresql://hr_admin:hr_secure_2024@localhost:5432/globalcyber_hr
echo.
echo # Application Configuration
echo NODE_ENV=development
echo PORT=3000
echo API_BASE_URL=http://localhost:5000
echo.
echo # Security Configuration
echo JWT_SECRET=your_jwt_secret_key_here_change_in_production
echo SESSION_SECRET=your_session_secret_here_change_in_production
echo ENCRYPTION_KEY=your_encryption_key_here_32_characters
echo.
echo # Email Configuration (Optional - for notifications^)
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER=your_email@gmail.com
echo SMTP_PASS=your_app_password
echo FROM_EMAIL=noreply@globalcyberit.com
echo.
echo # File Upload Configuration
echo MAX_FILE_SIZE=10485760
echo UPLOAD_PATH=./uploads
echo ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
echo.
echo # Feature Flags
echo ENABLE_2FA=true
echo ENABLE_EMAIL_NOTIFICATIONS=true
echo ENABLE_SMS_NOTIFICATIONS=false
echo ENABLE_AUDIT_LOGGING=true
echo.
echo # Development Settings
echo DEBUG=true
echo LOG_LEVEL=debug
echo REACT_APP_API_BASE_URL=http://localhost:5000
echo REACT_APP_ENV=development
) > .env

echo [SUCCESS] Environment configuration created (.env^)
echo [WARNING] Please update the .env file with your actual configuration values
echo.

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
if not exist "package.json" (
    echo [ERROR] package.json not found. Please ensure you're in the correct directory.
    pause
    exit /b 1
)

npm install
if %errorLevel% == 0 (
    echo [SUCCESS] Frontend dependencies installed successfully
) else (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Setup backend
echo [INFO] Setting up backend environment...
if not exist "backend" (
    mkdir backend
    cd backend
    
    REM Create Python virtual environment
    python -m venv venv
    call venv\Scripts\activate.bat
    
    REM Create requirements.txt
    (
    echo Flask==2.3.3
    echo Flask-SQLAlchemy==3.0.5
    echo Flask-Migrate==4.0.5
    echo Flask-Login==0.6.3
    echo Flask-WTF==1.1.1
    echo Flask-Mail==0.9.1
    echo Flask-CORS==4.0.0
    echo Flask-JWT-Extended==4.5.3
    echo psycopg2-binary==2.9.7
    echo python-dotenv==1.0.0
    echo bcrypt==4.0.1
    echo Pillow==10.0.1
    echo pandas==2.1.1
    echo openpyxl==3.1.2
    echo celery==5.3.1
    echo redis==4.6.0
    echo gunicorn==21.2.0
    echo pytest==7.4.2
    echo pytest-flask==1.2.0
    echo requests==2.31.0
    echo python-dateutil==2.8.2
    echo marshmallow==3.20.1
    echo flask-marshmallow==0.15.0
    echo marshmallow-sqlalchemy==0.29.0
    echo alembic==1.12.0
    echo werkzeug==2.3.7
    echo itsdangerous==2.1.2
    echo click==8.1.7
    echo jinja2==3.1.2
    echo markupsafe==2.1.3
    echo blinker==1.6.3
    ) > requirements.txt
    
    REM Install Python dependencies
    pip install -r requirements.txt
    if %errorLevel% == 0 (
        echo [SUCCESS] Backend dependencies installed successfully
    ) else (
        echo [ERROR] Failed to install backend dependencies
    )
    
    cd ..
) else (
    echo [INFO] Backend directory already exists
)

REM Create database schema
echo [INFO] Creating database schema...
if not exist "src\database" mkdir src\database

(
echo -- Global Cyber IT HR Management System Database Schema
echo -- Created: %date% %time%
echo.
echo -- Users table
echo CREATE TABLE IF NOT EXISTS users (
echo     id SERIAL PRIMARY KEY,
echo     username VARCHAR(50^) UNIQUE NOT NULL,
echo     email VARCHAR(100^) UNIQUE NOT NULL,
echo     password_hash VARCHAR(255^) NOT NULL,
echo     first_name VARCHAR(50^) NOT NULL,
echo     last_name VARCHAR(50^) NOT NULL,
echo     role VARCHAR(20^) DEFAULT 'employee',
echo     is_active BOOLEAN DEFAULT true,
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Employees table
echo CREATE TABLE IF NOT EXISTS employees (
echo     id SERIAL PRIMARY KEY,
echo     user_id INTEGER REFERENCES users(id^),
echo     employee_id VARCHAR(20^) UNIQUE NOT NULL,
echo     department VARCHAR(50^),
echo     position VARCHAR(100^),
echo     hire_date DATE,
echo     salary DECIMAL(12,2^),
echo     status VARCHAR(20^) DEFAULT 'active',
echo     manager_id INTEGER REFERENCES employees(id^),
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Leave requests table
echo CREATE TABLE IF NOT EXISTS leave_requests (
echo     id SERIAL PRIMARY KEY,
echo     employee_id INTEGER REFERENCES employees(id^),
echo     leave_type VARCHAR(50^) NOT NULL,
echo     start_date DATE NOT NULL,
echo     end_date DATE NOT NULL,
echo     days_requested INTEGER NOT NULL,
echo     reason TEXT,
echo     status VARCHAR(20^) DEFAULT 'pending',
echo     approved_by INTEGER REFERENCES users(id^),
echo     approved_at TIMESTAMP,
echo     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Insert default admin user
echo INSERT INTO users (username, email, password_hash, first_name, last_name, role^) 
echo VALUES ('admin', 'admin@globalcyberit.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEF8mz.YA0yH7tS', 'Admin', 'User', 'admin'^)
echo ON CONFLICT (username^) DO NOTHING;
) > src\database\schema.sql

echo [SUCCESS] Database schema file created

REM Create development scripts
echo [INFO] Creating development scripts...

REM Create start script for Windows
(
echo @echo off
echo echo Starting Global Cyber IT HR Management System...
echo.
echo REM Start backend (if exists^)
echo if exist "backend" (
echo     echo Starting backend server...
echo     cd backend
echo     call venv\Scripts\activate.bat
echo     set FLASK_ENV=development
echo     set FLASK_DEBUG=1
echo     start /b flask run --host=0.0.0.0 --port=5000
echo     cd ..
echo ^)
echo.
echo REM Start frontend
echo echo Starting frontend development server...
echo start /b npm run dev
echo.
echo echo Development servers started!
echo echo Frontend: http://localhost:3000
echo echo Backend: http://localhost:5000
echo echo.
echo echo Press any key to stop servers...
echo pause ^>nul
echo.
echo REM Stop servers
echo taskkill /f /im node.exe ^>nul 2^>^&1
echo taskkill /f /im python.exe ^>nul 2^>^&1
echo echo Development servers stopped.
) > start-dev.bat

REM Create stop script for Windows
(
echo @echo off
echo echo Stopping development servers...
echo.
echo REM Kill processes on ports 3000 and 5000
echo for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000'^) do taskkill /f /pid %%a ^>nul 2^>^&1
echo for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000'^) do taskkill /f /pid %%a ^>nul 2^>^&1
echo.
echo echo Development servers stopped.
echo pause
) > stop-dev.bat

echo [SUCCESS] Development scripts created

REM Setup git repository
echo [INFO] Setting up Git repository...
if not exist ".git" (
    git init >nul 2>&1
    if %errorLevel% == 0 (
        REM Create .gitignore
        (
        echo # Dependencies
        echo node_modules/
        echo backend/venv/
        echo *.pyc
        echo __pycache__/
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # Logs
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo *.log
        echo.
        echo # Uploads
        echo uploads/
        echo temp/
        echo.
        echo # Database
        echo *.db
        echo *.sqlite
        echo.
        echo # OS generated files
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo *~
        echo.
        echo # Backup files
        echo *.bak
        echo *.backup
        ) > .gitignore
        
        git add . >nul 2>&1
        git commit -m "Initial commit: Global Cyber IT HR Management System setup" >nul 2>&1
        echo [SUCCESS] Git repository initialized
    ) else (
        echo [WARNING] Git not found or failed to initialize repository
    )
) else (
    echo [INFO] Git repository already exists
)

REM Run tests
echo [INFO] Running initial tests...

REM Test Node.js installation
node --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION_CURRENT=%%i
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION_CURRENT=%%i
    echo [SUCCESS] Node.js %NODE_VERSION_CURRENT% and npm %NPM_VERSION_CURRENT% are working
) else (
    echo [ERROR] Node.js or npm test failed
)

REM Test Python installation
python --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION_CURRENT=%%i
    echo [SUCCESS] %PYTHON_VERSION_CURRENT% is working
) else (
    echo [ERROR] Python test failed
)

REM Display final instructions
echo.
echo [SUCCESS] Setup completed successfully!
echo.
echo ======================================
echo   %PROJECT_NAME%
echo ======================================
echo.
echo [INFO] Next steps:
echo 1. Review and update the .env file with your configuration
echo 2. If you have PostgreSQL installed, create the database:
echo    - Open PostgreSQL command line (psql)
echo    - CREATE DATABASE globalcyber_hr;
echo    - CREATE USER hr_admin WITH PASSWORD 'hr_secure_2024';
echo    - GRANT ALL PRIVILEGES ON DATABASE globalcyber_hr TO hr_admin;
echo.
echo 3. Start the development servers:
echo    start-dev.bat
echo.
echo 4. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 5. Default admin credentials:
echo    Email: admin@globalcyberit.com
echo    Password: admin123
echo.
echo [INFO] Additional commands:
echo - Stop servers: stop-dev.bat
echo - Run tests: npm test
echo - Build for production: npm run build
echo.
echo [WARNING] Important: Change default passwords and secrets in production!
echo.
echo Setup completed. Press any key to exit...
pause >nul
