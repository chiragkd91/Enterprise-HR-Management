/**
 * Database Configuration - PostgreSQL connection setup
 * Handles connection to Neon PostgreSQL database
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionString: string;
}

/**
 * Database connection configuration
 * Note: In production, these should be environment variables
 */
export const databaseConfig: DatabaseConfig = {
  host: process.env.REACT_APP_DB_HOST || 'ep-falling-leaf-adt7rhys.c-2.us-east-1.aws.neon.tech',
  port: parseInt(process.env.REACT_APP_DB_PORT || '5432'),
  database: process.env.REACT_APP_DB_NAME || 'neondb',
  username: process.env.REACT_APP_DB_USER || 'neondb_owner',
  password: process.env.REACT_APP_DB_PASSWORD || 'npg_mnUM9d1OwFJo',
  ssl: true,
  connectionString: process.env.REACT_APP_DATABASE_URL || 'postgresql://neondb_owner:npg_mnUM9d1OwFJo@ep-falling-leaf-adt7rhys.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
};

/**
 * Database table schemas
 */
export const tableSchemas = {
  employees: 'employees',
  departments: 'departments',
  roles: 'roles',
  attendance: 'attendance',
  leave_requests: 'leave_requests',
  performance_goals: 'performance_goals',
  performance_reviews: 'performance_reviews',
  assets: 'it_assets',
  software_licenses: 'software_licenses',
  onboarding_processes: 'onboarding_processes',
  onboarding_tasks: 'onboarding_tasks',
  offboarding_processes: 'offboarding_processes',
  system_deployments: 'system_deployments',
  system_environments: 'system_environments',
  support_tickets: 'support_tickets',
  access_requests: 'access_requests',
  notifications: 'notifications',
  audit_logs: 'audit_logs'
};

/**
 * SQL Query templates for common operations
 */
export const queryTemplates = {
  // Employee queries
  getAllEmployees: `
    SELECT e.*, d.name as department_name, r.name as role_name 
    FROM ${tableSchemas.employees} e
    LEFT JOIN ${tableSchemas.departments} d ON e.department_id = d.id
    LEFT JOIN ${tableSchemas.roles} r ON e.role_id = r.id
    WHERE e.active = true
    ORDER BY e.created_at DESC
  `,
  
  getEmployeeById: `
    SELECT e.*, d.name as department_name, r.name as role_name 
    FROM ${tableSchemas.employees} e
    LEFT JOIN ${tableSchemas.departments} d ON e.department_id = d.id
    LEFT JOIN ${tableSchemas.roles} r ON e.role_id = r.id
    WHERE e.id = $1
  `,

  // Onboarding queries
  getOnboardingProcesses: `
    SELECT op.*, e.first_name, e.last_name, e.email, d.name as department_name
    FROM ${tableSchemas.onboarding_processes} op
    JOIN ${tableSchemas.employees} e ON op.employee_id = e.id
    LEFT JOIN ${tableSchemas.departments} d ON e.department_id = d.id
    ORDER BY op.created_at DESC
  `,

  getOnboardingTasks: `
    SELECT ot.*, op.employee_id
    FROM ${tableSchemas.onboarding_tasks} ot
    JOIN ${tableSchemas.onboarding_processes} op ON ot.process_id = op.id
    WHERE op.id = $1
    ORDER BY ot.priority DESC, ot.due_date ASC
  `,

  // Asset queries
  getAllAssets: `
    SELECT a.*, e.first_name, e.last_name
    FROM ${tableSchemas.assets} a
    LEFT JOIN ${tableSchemas.employees} e ON a.assigned_to = e.id
    WHERE a.active = true
    ORDER BY a.created_at DESC
  `,

  // Support ticket queries
  getSupportTickets: `
    SELECT st.*, e.first_name as requester_name, e.email as requester_email
    FROM ${tableSchemas.support_tickets} st
    JOIN ${tableSchemas.employees} e ON st.requester_id = e.id
    ORDER BY st.priority DESC, st.created_at DESC
  `,

  // System deployment queries
  getSystemDeployments: `
    SELECT sd.*, se.name as environment_name
    FROM ${tableSchemas.system_deployments} sd
    JOIN ${tableSchemas.system_environments} se ON sd.environment_id = se.id
    ORDER BY sd.scheduled_time DESC
  `
};

export default databaseConfig;
