/**
 * Database Models and Types
 * TypeScript interfaces for PostgreSQL database entities
 */

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: number;
  role_id: number;
  manager_id?: number;
  hire_date: string;
  status: 'active' | 'inactive' | 'terminated';
  salary?: number;
  address?: string;
  emergency_contact?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  department_name?: string;
  role_name?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  manager_id?: number;
  budget?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  level: number;
  permissions?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProcess {
  id: number;
  employee_id: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  start_date: string;
  expected_completion: string;
  actual_completion?: string;
  manager_id?: number;
  assigned_equipment?: any[];
  accounts_created?: any[];
  access_requests?: any[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingTask {
  id: number;
  process_id: number;
  task_name: string;
  description?: string;
  category: 'equipment' | 'accounts' | 'access' | 'training' | 'documentation' | 'software' | 'security';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'overdue';
  assigned_to: string;
  due_date: string;
  completed_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_time: string;
  dependencies?: string[];
  approval_required: boolean;
  approver?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ITAsset {
  id: number;
  asset_tag: string;
  name: string;
  category: 'laptop' | 'desktop' | 'monitor' | 'phone' | 'tablet' | 'server' | 'network';
  brand: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  purchase_price: number;
  current_value: number;
  warranty_expiry: string;
  status: 'active' | 'maintenance' | 'retired' | 'lost' | 'available';
  assigned_to?: number;
  location: string;
  specifications?: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SoftwareLicense {
  id: number;
  name: string;
  vendor: string;
  license_type: 'subscription' | 'perpetual' | 'volume';
  total_licenses: number;
  used_licenses: number;
  cost_per_license: number;
  renewal_date: string;
  assigned_employees?: number[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'access' | 'email' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  requester_id: number;
  assigned_to?: string;
  resolution_time?: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface SystemDeployment {
  id: number;
  system_name: string;
  version: string;
  environment_id: number;
  deployment_type: 'new_deployment' | 'update' | 'rollback' | 'hotfix';
  status: 'planned' | 'in_progress' | 'deployed' | 'failed' | 'rolled_back';
  scheduled_time: string;
  deployed_time?: string;
  deployed_by: string;
  affected_services: string[];
  rollback_plan: string;
  health_checks?: any[];
  dependencies?: string[];
  approval_status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemEnvironment {
  id: number;
  name: string;
  type: 'development' | 'staging' | 'production' | 'testing';
  status: 'active' | 'maintenance' | 'inactive';
  current_version: string;
  last_deployment: string;
  uptime: number;
  health_score: number;
  resources?: any;
  services?: any[];
  created_at: string;
  updated_at: string;
}

export interface AccessRequest {
  id: number;
  requester_id: number;
  request_type: 'new_access' | 'modify_access' | 'remove_access' | 'software_access';
  target_system: string;
  access_level: string;
  business_justification: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  approver?: string;
  request_date: string;
  approval_date?: string;
  implementation_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id?: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  resource_type: string;
  resource_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
  filters?: Record<string, any>;
}
