-- Database Schema for HR Management System
-- PostgreSQL Database: neondb
-- Connection: postgresql://neondb_owner:npg_mnUM9d1OwFJo@ep-falling-leaf-adt7rhys.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    manager_id INTEGER,
    budget DECIMAL(12,2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    level INTEGER DEFAULT 1,
    permissions JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INTEGER REFERENCES departments(id),
    role_id INTEGER REFERENCES roles(id),
    manager_id INTEGER REFERENCES employees(id),
    hire_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    salary DECIMAL(10,2),
    address TEXT,
    emergency_contact JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create onboarding_processes table
CREATE TABLE IF NOT EXISTS onboarding_processes (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE NOT NULL,
    expected_completion DATE,
    actual_completion DATE,
    manager_id INTEGER REFERENCES employees(id),
    assigned_equipment JSONB,
    accounts_created JSONB,
    access_requests JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create onboarding_tasks table
CREATE TABLE IF NOT EXISTS onboarding_tasks (
    id SERIAL PRIMARY KEY,
    process_id INTEGER REFERENCES onboarding_processes(id) NOT NULL,
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('equipment', 'accounts', 'access', 'training', 'documentation', 'software', 'security')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked', 'overdue')),
    assigned_to VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    completed_date DATE,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_time VARCHAR(20),
    dependencies JSONB,
    approval_required BOOLEAN DEFAULT false,
    approver VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create offboarding_processes table
CREATE TABLE IF NOT EXISTS offboarding_processes (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'initiated' CHECK (status IN ('initiated', 'in_progress', 'completed', 'delayed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    last_working_day DATE NOT NULL,
    reason VARCHAR(20) NOT NULL CHECK (reason IN ('resignation', 'termination', 'retirement', 'transfer')),
    data_backup JSONB,
    equipment_return JSONB,
    access_revocation JSONB,
    exit_interview JSONB,
    manager_id INTEGER REFERENCES employees(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create IT assets table
CREATE TABLE IF NOT EXISTS it_assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('laptop', 'desktop', 'monitor', 'phone', 'tablet', 'server', 'network')),
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    warranty_expiry DATE,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('active', 'maintenance', 'retired', 'lost', 'available')),
    assigned_to INTEGER REFERENCES employees(id),
    location VARCHAR(100),
    specifications JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create software_licenses table
CREATE TABLE IF NOT EXISTS software_licenses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    license_type VARCHAR(20) NOT NULL CHECK (license_type IN ('subscription', 'perpetual', 'volume')),
    total_licenses INTEGER NOT NULL,
    used_licenses INTEGER DEFAULT 0,
    cost_per_license DECIMAL(10,2) NOT NULL,
    renewal_date DATE,
    assigned_employees JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('hardware', 'software', 'network', 'access', 'email', 'other')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    requester_id INTEGER REFERENCES employees(id) NOT NULL,
    assigned_to VARCHAR(100),
    resolution_time INTEGER, -- in hours
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create system_environments table
CREATE TABLE IF NOT EXISTS system_environments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('development', 'staging', 'production', 'testing')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    current_version VARCHAR(50),
    last_deployment TIMESTAMP,
    uptime DECIMAL(5,2) DEFAULT 100.0,
    health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
    resources JSONB,
    services JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system_deployments table
CREATE TABLE IF NOT EXISTS system_deployments (
    id SERIAL PRIMARY KEY,
    system_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    environment_id INTEGER REFERENCES system_environments(id) NOT NULL,
    deployment_type VARCHAR(20) NOT NULL CHECK (deployment_type IN ('new_deployment', 'update', 'rollback', 'hotfix')),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'deployed', 'failed', 'rolled_back')),
    scheduled_time TIMESTAMP NOT NULL,
    deployed_time TIMESTAMP,
    deployed_by VARCHAR(100) NOT NULL,
    affected_services JSONB,
    rollback_plan TEXT,
    health_checks JSONB,
    dependencies JSONB,
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approver VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create access_requests table
CREATE TABLE IF NOT EXISTS access_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES employees(id) NOT NULL,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('new_access', 'modify_access', 'remove_access', 'software_access')),
    target_system VARCHAR(100) NOT NULL,
    access_level VARCHAR(50) NOT NULL,
    business_justification TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
    urgency VARCHAR(10) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    approver VARCHAR(100),
    request_date DATE DEFAULT CURRENT_DATE,
    approval_date DATE,
    implementation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES employees(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT false,
    action_url VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES employees(id) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_processes_employee_id ON onboarding_processes(employee_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_processes_status ON onboarding_processes(status);

CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_process_id ON onboarding_tasks(process_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_status ON onboarding_tasks(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_due_date ON onboarding_tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_it_assets_assigned_to ON it_assets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_it_assets_status ON it_assets(status);
CREATE INDEX IF NOT EXISTS idx_it_assets_category ON it_assets(category);

CREATE INDEX IF NOT EXISTS idx_support_tickets_requester_id ON support_tickets(requester_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);

CREATE INDEX IF NOT EXISTS idx_system_deployments_environment_id ON system_deployments(environment_id);
CREATE INDEX IF NOT EXISTS idx_system_deployments_status ON system_deployments(status);

CREATE INDEX IF NOT EXISTS idx_access_requests_requester_id ON access_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add foreign key constraints
ALTER TABLE departments ADD CONSTRAINT fk_departments_manager 
    FOREIGN KEY (manager_id) REFERENCES employees(id);

-- Insert initial data
INSERT INTO departments (name, description) VALUES 
    ('Engineering', 'Software development and technical teams'),
    ('Human Resources', 'People operations and employee relations'),
    ('Marketing', 'Brand management and customer acquisition'),
    ('Finance', 'Financial planning and accounting'),
    ('Operations', 'Business operations and process management'),
    ('IT', 'Information technology and system administration')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name, description, level) VALUES 
    ('CEO', 'Chief Executive Officer', 10),
    ('CTO', 'Chief Technology Officer', 9),
    ('Engineering Manager', 'Engineering team leader', 8),
    ('Senior Developer', 'Senior software developer', 7),
    ('Developer', 'Software developer', 6),
    ('HR Manager', 'Human resources manager', 8),
    ('HR Specialist', 'Human resources specialist', 6),
    ('Marketing Manager', 'Marketing team leader', 8),
    ('Marketing Coordinator', 'Marketing team member', 6),
    ('Finance Manager', 'Finance team leader', 8),
    ('Financial Analyst', 'Financial analysis specialist', 6),
    ('IT Administrator', 'System administrator', 7),
    ('IT Support', 'Technical support specialist', 5)
ON CONFLICT (name) DO NOTHING;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_processes_updated_at BEFORE UPDATE ON onboarding_processes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_tasks_updated_at BEFORE UPDATE ON onboarding_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_it_assets_updated_at BEFORE UPDATE ON it_assets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_software_licenses_updated_at BEFORE UPDATE ON software_licenses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_environments_updated_at BEFORE UPDATE ON system_environments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_deployments_updated_at BEFORE UPDATE ON system_deployments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_requests_updated_at BEFORE UPDATE ON access_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
