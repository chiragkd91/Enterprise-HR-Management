/**
 * API Service Layer - Integration with PostgreSQL Backend
 * Handles all HTTP requests to the backend server with database integration
 */

import { databaseConfig } from '../config/database';
import type { 
  Employee, 
  OnboardingProcess, 
  OnboardingTask, 
  ITAsset, 
  SupportTicket, 
  SystemDeployment,
  AccessRequest,
  Notification,
  ApiResponse,
  QueryParams
} from '../types/database';

interface DatabaseApiResponse<T = any> extends ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: {
    name: string;
    description: string;
  };
}

interface Employee {
  id: number;
  user_id: number;
  employee_id: string;
  department: string;
  position: string;
  hire_date: string;
  status: string;
  manager_id?: number;
}

interface Notification {
  id: number;
  subject: string;
  body: string;
  scheduled_at: string;
  template_name: string;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  data: any;
  position: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;
  private dbConfig = databaseConfig;

  constructor(baseUrl: string = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Make authenticated HTTP request with database integration
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<DatabaseApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: data.message || 'Request failed',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  /**
   * Authentication methods
   */
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me');
  }

  /**
   * Employee management with PostgreSQL integration
   */
  async getEmployees(params?: QueryParams & { department?: string; status?: string }): Promise<DatabaseApiResponse<Employee[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/api/employees${queryParams.toString() ? `?${queryParams}` : ''}`);
  }

  async getEmployee(id: number): Promise<DatabaseApiResponse<Employee>> {
    return this.request(`/api/employees/${id}`);
  }

  async createEmployee(employee: Partial<Employee>): Promise<DatabaseApiResponse<Employee>> {
    return this.request('/api/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<DatabaseApiResponse<Employee>> {
    return this.request(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  }

  async deleteEmployee(id: number): Promise<DatabaseApiResponse<void>> {
    return this.request(`/api/employees/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Attendance management
   */
  async clockIn(location?: { lat: number; lng: number }): Promise<ApiResponse<void>> {
    return this.request('/attendance/clock-in', {
      method: 'POST',
      body: JSON.stringify({ location }),
    });
  }

  async clockOut(location?: { lat: number; lng: number }): Promise<ApiResponse<void>> {
    return this.request('/attendance/clock-out', {
      method: 'POST',
      body: JSON.stringify({ location }),
    });
  }

  async getAttendanceLogs(startDate?: string, endDate?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return this.request(`/attendance/logs?${params.toString()}`);
  }

  /**
   * Leave management
   */
  async submitLeaveRequest(request: {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/leave/request', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getLeaveRequests(): Promise<ApiResponse<any[]>> {
    return this.request('/leave/my-requests');
  }

  async getLeaveBalance(): Promise<ApiResponse<any>> {
    return this.request('/leave/balance');
  }

  /**
   * Performance management
   */
  async getGoals(): Promise<ApiResponse<any[]>> {
    return this.request('/performance/goals');
  }

  async createGoal(goal: {
    title: string;
    description: string;
    target_date: string;
    category: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/performance/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoalProgress(goalId: number, progress: number): Promise<ApiResponse<any>> {
    return this.request(`/performance/goals/${goalId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  /**
   * Global search
   */
  async globalSearch(query: string, modules?: string[]): Promise<ApiResponse<Record<string, any[]>>> {
    const params = new URLSearchParams({ q: query });
    if (modules) {
      modules.forEach(module => params.append('modules', module));
    }
    return this.request(`/api/search?${params.toString()}`);
  }

  /**
   * Notifications
   */
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request('/api/notifications');
  }

  async markNotificationRead(id: number): Promise<ApiResponse<void>> {
    return this.request(`/notifications/${id}/read`, { method: 'POST' });
  }

  /**
   * Dashboard widgets
   */
  async getDashboardWidgets(): Promise<ApiResponse<{ widgets: DashboardWidget[] }>> {
    return this.request('/api/dashboard/widgets');
  }

  /**
   * Advanced reporting
   */
  async getAttendanceReport(params: {
    start_date: string;
    end_date: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/advanced-reports/attendance?${queryParams}`);
  }

  async getPerformanceReport(params: {
    start_date: string;
    end_date: string;
    department?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/advanced-reports/performance?${queryParams}`);
  }

  /**
   * IT Onboarding & Offboarding API
   */
  async getOnboardingProcesses(params?: QueryParams): Promise<DatabaseApiResponse<OnboardingProcess[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/api/onboarding/processes${queryParams.toString() ? `?${queryParams}` : ''}`);
  }

  async getOnboardingProcess(id: number): Promise<DatabaseApiResponse<OnboardingProcess>> {
    return this.request(`/api/onboarding/processes/${id}`);
  }

  async createOnboardingProcess(process: Partial<OnboardingProcess>): Promise<DatabaseApiResponse<OnboardingProcess>> {
    return this.request('/api/onboarding/processes', {
      method: 'POST',
      body: JSON.stringify(process),
    });
  }

  async updateOnboardingProcess(id: number, process: Partial<OnboardingProcess>): Promise<DatabaseApiResponse<OnboardingProcess>> {
    return this.request(`/api/onboarding/processes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(process),
    });
  }

  async getOnboardingTasks(processId: number): Promise<DatabaseApiResponse<OnboardingTask[]>> {
    return this.request(`/api/onboarding/processes/${processId}/tasks`);
  }

  async updateOnboardingTask(processId: number, taskId: number, task: Partial<OnboardingTask>): Promise<DatabaseApiResponse<OnboardingTask>> {
    return this.request(`/api/onboarding/processes/${processId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async completeOnboardingTask(processId: number, taskId: number, notes?: string): Promise<DatabaseApiResponse<OnboardingTask>> {
    return this.request(`/api/onboarding/processes/${processId}/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  /**
   * IT Asset Management API
   */
  async getITAssets(params?: QueryParams & { category?: string; status?: string }): Promise<DatabaseApiResponse<ITAsset[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/api/assets${queryParams.toString() ? `?${queryParams}` : ''}`);
  }

  async getITAsset(id: number): Promise<DatabaseApiResponse<ITAsset>> {
    return this.request(`/api/assets/${id}`);
  }

  async createITAsset(asset: Partial<ITAsset>): Promise<DatabaseApiResponse<ITAsset>> {
    return this.request('/api/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  async updateITAsset(id: number, asset: Partial<ITAsset>): Promise<DatabaseApiResponse<ITAsset>> {
    return this.request(`/api/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(asset),
    });
  }

  async assignAsset(assetId: number, employeeId: number): Promise<DatabaseApiResponse<ITAsset>> {
    return this.request(`/api/assets/${assetId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    });
  }

  async returnAsset(assetId: number, condition?: string, notes?: string): Promise<DatabaseApiResponse<ITAsset>> {
    return this.request(`/api/assets/${assetId}/return`, {
      method: 'POST',
      body: JSON.stringify({ condition, notes }),
    });
  }

  /**
   * IT Support System API
   */
  async getSupportTickets(params?: QueryParams & { status?: string; priority?: string }): Promise<DatabaseApiResponse<SupportTicket[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/api/support/tickets${queryParams.toString() ? `?${queryParams}` : ''}`);
  }

  async getSupportTicket(id: number): Promise<DatabaseApiResponse<SupportTicket>> {
    return this.request(`/api/support/tickets/${id}`);
  }

  async createSupportTicket(ticket: Partial<SupportTicket>): Promise<DatabaseApiResponse<SupportTicket>> {
    return this.request('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  async updateSupportTicket(id: number, ticket: Partial<SupportTicket>): Promise<DatabaseApiResponse<SupportTicket>> {
    return this.request(`/api/support/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticket),
    });
  }

  async assignSupportTicket(ticketId: number, assignee: string): Promise<DatabaseApiResponse<SupportTicket>> {
    return this.request(`/api/support/tickets/${ticketId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assignee }),
    });
  }

  async resolveSupportTicket(ticketId: number, resolution: string): Promise<DatabaseApiResponse<SupportTicket>> {
    return this.request(`/api/support/tickets/${ticketId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolution }),
    });
  }

  /**
   * System Deployment API
   */
  async getSystemDeployments(params?: QueryParams): Promise<DatabaseApiResponse<SystemDeployment[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/api/deployments${queryParams.toString() ? `?${queryParams}` : ''}`);
  }

  async createSystemDeployment(deployment: Partial<SystemDeployment>): Promise<DatabaseApiResponse<SystemDeployment>> {
    return this.request('/api/deployments', {
      method: 'POST',
      body: JSON.stringify(deployment),
    });
  }

  async startDeployment(deploymentId: number): Promise<DatabaseApiResponse<SystemDeployment>> {
    return this.request(`/api/deployments/${deploymentId}/start`, {
      method: 'POST',
    });
  }

  async rollbackDeployment(deploymentId: number): Promise<DatabaseApiResponse<SystemDeployment>> {
    return this.request(`/api/deployments/${deploymentId}/rollback`, {
      method: 'POST',
    });
  }

  /**
   * Access Management API
   */
  async getAccessRequests(params?: QueryParams): Promise<DatabaseApiResponse<AccessRequest[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/api/access/requests${queryParams.toString() ? `?${queryParams}` : ''}`);
  }

  async createAccessRequest(request: Partial<AccessRequest>): Promise<DatabaseApiResponse<AccessRequest>> {
    return this.request('/api/access/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async approveAccessRequest(requestId: number, notes?: string): Promise<DatabaseApiResponse<AccessRequest>> {
    return this.request(`/api/access/requests/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectAccessRequest(requestId: number, reason: string): Promise<DatabaseApiResponse<AccessRequest>> {
    return this.request(`/api/access/requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Document upload for onboarding
   */
  async uploadDocument(file: File, documentType: string, processId?: number): Promise<DatabaseApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    if (processId) formData.append('process_id', processId.toString());

    return this.request('/api/onboarding/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let the browser set the content-type for FormData
    });
  }

  /**
   * Bulk operations
   */
  async bulkUpdateEmployees(updates: Array<{ id: number; data: Partial<Employee> }>): Promise<ApiResponse<any>> {
    return this.request('/bulk-ops/employees', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });
  }

  /**
   * Security and audit logs
   */
  async getSecurityLogs(params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/security/logs${queryParams ? `?${queryParams}` : ''}`);
  }

  async enableTwoFactor(): Promise<ApiResponse<{ qr_code: string; backup_codes: string[] }>> {
    return this.request('/security/2fa/enable', { method: 'POST' });
  }

  async verifyTwoFactor(code: string): Promise<ApiResponse<void>> {
    return this.request('/security/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
export type { User, Employee, Notification, DashboardWidget };
