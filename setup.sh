#!/bin/bash

# Project Setup Script for Global Cyber IT - HR Management System
# Author: Development Team
# Description: Automated setup script for development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="Global Cyber IT - HR Management System"
NODE_VERSION="18.17.0"
PYTHON_VERSION="3.9"
POSTGRES_VERSION="14"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    # Check operating system
    OS="$(uname -s)"
    case "${OS}" in
        Linux*)     MACHINE=Linux;;
        Darwin*)    MACHINE=Mac;;
        CYGWIN*)    MACHINE=Cygwin;;
        MINGW*)     MACHINE=MinGw;;
        *)          MACHINE="UNKNOWN:${OS}"
    esac
    print_status "Operating System: ${MACHINE}"
    
    # Check available memory
    if [[ "$MACHINE" == "Linux" ]]; then
        MEMORY=$(free -m | awk 'NR==2{printf "%.1f", $2/1024}')
        print_status "Available Memory: ${MEMORY}GB"
    elif [[ "$MACHINE" == "Mac" ]]; then
        MEMORY=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2 $3}')
        print_status "Available Memory: ${MEMORY}"
    fi
    
    # Check disk space
    DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}')
    print_status "Available Disk Space: ${DISK_SPACE}"
}

# Function to install Node.js and npm
install_nodejs() {
    print_status "Checking Node.js installation..."
    
    if command_exists node; then
        NODE_CURRENT=$(node -v)
        print_status "Node.js found: $NODE_CURRENT"
        
        # Check if version is compatible
        if [[ "$NODE_CURRENT" < "v16" ]]; then
            print_warning "Node.js version $NODE_CURRENT is outdated. Recommended: v$NODE_VERSION"
            read -p "Do you want to update Node.js? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                install_node_fresh
            fi
        else
            print_success "Node.js version is compatible"
        fi
    else
        print_status "Node.js not found. Installing..."
        install_node_fresh
    fi
}

install_node_fresh() {
    # Install Node.js using Node Version Manager (nvm)
    if ! command_exists nvm; then
        print_status "Installing NVM (Node Version Manager)..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi
    
    print_status "Installing Node.js v$NODE_VERSION..."
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    nvm alias default $NODE_VERSION
}

# Function to install Python and dependencies
install_python() {
    print_status "Checking Python installation..."
    
    if command_exists python3; then
        PYTHON_CURRENT=$(python3 --version 2>&1 | cut -d ' ' -f 2)
        print_status "Python found: $PYTHON_CURRENT"
        
        if [[ "$PYTHON_CURRENT" < "$PYTHON_VERSION" ]]; then
            print_warning "Python version $PYTHON_CURRENT might be outdated. Recommended: $PYTHON_VERSION+"
        else
            print_success "Python version is compatible"
        fi
    else
        print_error "Python 3 not found. Please install Python 3.$PYTHON_VERSION+ manually."
        exit 1
    fi
    
    # Install pip if not available
    if ! command_exists pip3; then
        print_status "Installing pip..."
        python3 -m ensurepip --upgrade
    fi
    
    # Install virtual environment
    if ! python3 -c "import venv" 2>/dev/null; then
        print_status "Installing python3-venv..."
        if [[ "$MACHINE" == "Linux" ]]; then
            sudo apt-get update && sudo apt-get install -y python3-venv
        elif [[ "$MACHINE" == "Mac" ]]; then
            brew install python
        fi
    fi
}

# Function to install PostgreSQL
install_postgresql() {
    print_status "Checking PostgreSQL installation..."
    
    if command_exists psql; then
        POSTGRES_CURRENT=$(psql --version | awk '{print $3}' | cut -d. -f1)
        print_status "PostgreSQL found: $POSTGRES_CURRENT"
        print_success "PostgreSQL is available"
    else
        print_status "PostgreSQL not found. Installing..."
        
        if [[ "$MACHINE" == "Linux" ]]; then
            sudo apt-get update
            sudo apt-get install -y postgresql postgresql-contrib postgresql-client
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        elif [[ "$MACHINE" == "Mac" ]]; then
            if command_exists brew; then
                brew install postgresql@14
                brew services start postgresql@14
            else
                print_error "Homebrew not found. Please install PostgreSQL manually."
                exit 1
            fi
        fi
        
        print_success "PostgreSQL installed successfully"
    fi
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    # Create database user and database
    DB_NAME="globalcyber_hr"
    DB_USER="hr_admin"
    DB_PASSWORD="hr_secure_2024"
    
    print_status "Creating database and user..."
    
    # Check if user exists
    if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
        print_status "Database user '$DB_USER' already exists"
    else
        sudo -u postgres createuser --createdb --login $DB_USER
        sudo -u postgres psql -c "ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';"
        print_success "Database user '$DB_USER' created"
    fi
    
    # Check if database exists
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_status "Database '$DB_NAME' already exists"
    else
        sudo -u postgres createdb -O $DB_USER $DB_NAME
        print_success "Database '$DB_NAME' created"
    fi
    
    # Create .env file with database configuration
    create_env_file
}

# Function to create environment configuration file
create_env_file() {
    print_status "Creating environment configuration..."
    
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=globalcyber_hr
DB_USER=hr_admin
DB_PASSWORD=hr_secure_2024
DATABASE_URL=postgresql://hr_admin:hr_secure_2024@localhost:5432/globalcyber_hr

# Application Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:5000

# Security Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
SESSION_SECRET=your_session_secret_here_change_in_production
ENCRYPTION_KEY=your_encryption_key_here_32_characters

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@globalcyberit.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Redis Configuration (Optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Third-party Integration Keys (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=

# Feature Flags
ENABLE_2FA=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_AUDIT_LOGGING=true

# Development Settings
DEBUG=true
LOG_LEVEL=debug
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
EOF

    print_success "Environment configuration created (.env)"
    print_warning "Please update the .env file with your actual configuration values"
}

# Function to install npm dependencies
install_frontend_dependencies() {
    print_status "Installing frontend dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please ensure you're in the correct directory."
        exit 1
    fi
    
    # Install dependencies
    npm install
    
    print_success "Frontend dependencies installed successfully"
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend environment..."
    
    # Create backend directory if it doesn't exist
    if [ ! -d "backend" ]; then
        mkdir -p backend
        cd backend
        
        # Create Python virtual environment
        python3 -m venv venv
        source venv/bin/activate
        
        # Create requirements.txt
        cat > requirements.txt << EOF
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-Login==0.6.3
Flask-WTF==1.1.1
Flask-Mail==0.9.1
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
psycopg2-binary==2.9.7
python-dotenv==1.0.0
bcrypt==4.0.1
Pillow==10.0.1
pandas==2.1.1
openpyxl==3.1.2
celery==5.3.1
redis==4.6.0
gunicorn==21.2.0
pytest==7.4.2
pytest-flask==1.2.0
requests==2.31.0
python-dateutil==2.8.2
marshmallow==3.20.1
flask-marshmallow==0.15.0
marshmallow-sqlalchemy==0.29.0
alembic==1.12.0
werkzeug==2.3.7
itsdangerous==2.1.2
click==8.1.7
jinja2==3.1.2
markupsafe==2.1.3
blinker==1.6.3
EOF
        
        # Install Python dependencies
        pip install -r requirements.txt
        
        print_success "Backend environment setup completed"
        cd ..
    else
        print_status "Backend directory already exists"
    fi
}

# Function to initialize database schema
initialize_database_schema() {
    print_status "Initializing database schema..."
    
    # Create schema file if it doesn't exist
    if [ ! -f "src/database/schema.sql" ]; then
        mkdir -p src/database
        
        cat > src/database/schema.sql << EOF
-- Global Cyber IT HR Management System Database Schema
-- Created: $(date)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(50),
    position VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'active',
    manager_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    date DATE NOT NULL,
    clock_in TIME,
    clock_out TIME,
    total_hours DECIMAL(4,2),
    status VARCHAR(20) DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_salary DECIMAL(12,2),
    deductions DECIMAL(12,2),
    net_salary DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'draft',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, email, password_hash, first_name, last_name, role) 
VALUES ('admin', 'admin@globalcyberit.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewEF8mz.YA0yH7tS', 'Admin', 'User', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
EOF
        
        print_success "Database schema file created"
    fi
    
    # Apply schema to database
    export PGPASSWORD="hr_secure_2024"
    psql -h localhost -U hr_admin -d globalcyber_hr -f src/database/schema.sql
    
    print_success "Database schema initialized"
}

# Function to create development scripts
create_dev_scripts() {
    print_status "Creating development scripts..."
    
    # Create start script
    cat > start-dev.sh << EOF
#!/bin/bash
# Development Server Start Script

echo "Starting Global Cyber IT HR Management System..."

# Start backend (if exists)
if [ -d "backend" ]; then
    echo "Starting backend server..."
    cd backend
    source venv/bin/activate
    export FLASK_ENV=development
    export FLASK_DEBUG=1
    flask run --host=0.0.0.0 --port=5000 &
    BACKEND_PID=\$!
    cd ..
fi

# Start frontend
echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=\$!

echo "Development servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap 'kill \$BACKEND_PID \$FRONTEND_PID 2>/dev/null; exit' INT
wait
EOF

    chmod +x start-dev.sh
    
    # Create stop script
    cat > stop-dev.sh << EOF
#!/bin/bash
# Stop Development Servers

echo "Stopping development servers..."

# Kill processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

echo "Development servers stopped."
EOF

    chmod +x stop-dev.sh
    
    print_success "Development scripts created"
}

# Function to setup git repository
setup_git_repository() {
    print_status "Setting up Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        
        # Create .gitignore
        cat > .gitignore << EOF
# Dependencies
node_modules/
backend/venv/
*.pyc
__pycache__/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Uploads
uploads/
temp/

# Database
*.db
*.sqlite

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Backup files
*.bak
*.backup
EOF
        
        git add .
        git commit -m "Initial commit: Global Cyber IT HR Management System setup"
        
        print_success "Git repository initialized"
    else
        print_status "Git repository already exists"
    fi
}

# Function to run tests
run_tests() {
    print_status "Running initial tests..."
    
    # Test database connection
    if command_exists psql; then
        export PGPASSWORD="hr_secure_2024"
        if psql -h localhost -U hr_admin -d globalcyber_hr -c "SELECT 1;" >/dev/null 2>&1; then
            print_success "Database connection test passed"
        else
            print_error "Database connection test failed"
        fi
    fi
    
    # Test Node.js installation
    if command_exists node && command_exists npm; then
        NODE_VERSION_CURRENT=$(node -v)
        NPM_VERSION_CURRENT=$(npm -v)
        print_success "Node.js $NODE_VERSION_CURRENT and npm $NPM_VERSION_CURRENT are working"
    else
        print_error "Node.js or npm test failed"
    fi
    
    # Test Python installation
    if command_exists python3; then
        PYTHON_VERSION_CURRENT=$(python3 --version)
        print_success "$PYTHON_VERSION_CURRENT is working"
    else
        print_error "Python test failed"
    fi
}

# Function to display final instructions
display_final_instructions() {
    print_success "Setup completed successfully!"
    echo ""
    echo "======================================"
    echo "  $PROJECT_NAME"
    echo "======================================"
    echo ""
    print_status "Next steps:"
    echo "1. Review and update the .env file with your configuration"
    echo "2. Start the development servers:"
    echo "   ./start-dev.sh"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "4. Default admin credentials:"
    echo "   Email: admin@globalcyberit.com"
    echo "   Password: admin123"
    echo ""
    print_status "Additional commands:"
    echo "- Stop servers: ./stop-dev.sh"
    echo "- Run tests: npm test"
    echo "- Build for production: npm run build"
    echo ""
    print_warning "Important: Change default passwords and secrets in production!"
}

# Main execution flow
main() {
    clear
    echo "======================================"
    echo "  $PROJECT_NAME"
    echo "  Automated Setup Script"
    echo "======================================"
    echo ""
    
    # Check if script is run with proper permissions
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root (except for package installation steps)"
        echo "Please run as a regular user with sudo privileges"
        exit 1
    fi
    
    print_status "Starting automated setup process..."
    echo ""
    
    # Execute setup steps
    check_system_requirements
    install_nodejs
    install_python
    install_postgresql
    setup_database
    install_frontend_dependencies
    setup_backend
    initialize_database_schema
    create_dev_scripts
    setup_git_repository
    run_tests
    
    echo ""
    display_final_instructions
}

# Run main function
main "$@"
