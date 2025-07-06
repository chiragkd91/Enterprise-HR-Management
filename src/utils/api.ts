/**
 * API Utility Functions - Integration with Flask backend
 * Handles HTTP requests, authentication, and error handling
 */

import { toast } from 'sonner';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

interface NotificationData {
  id: string;
  subject: string;
  body: string;
  scheduled_at: string;
  template_name: string;
}

interface SearchResult {
  [module: string]: Array<{
    id: string;
    name: string;
    [key: string]: any;
  }>;
}

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: any;
  position: number;
}

/**
 * Base API client with authentication and error handling
 */
class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.authToken = localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Make HTTP request with authentication
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for Flask-Login sessions
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || `HTTP error! status: ${response.status}`);
      }

      return { data, status: response.status };
    } catch (error) {
      console.error('API Request failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Show toast notification for errors
      toast.error(errorMessage);
      
      return { error: errorMessage, status: 0 };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

/**
 * Authentication API functions
 */
export const authAPI = {
  /**
   * Login user
   */
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post('/auth/logout');
    apiClient.clearAuthToken();
    return response;
  },

  /**
   * Register new user
   */
  async register(userData: any): Promise<ApiResponse> {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse> {
    return apiClient.get('/auth/profile');
  },
};

/**
 * Global search API
 */
export const searchAPI = {
  /**
   * Perform global search across modules
   */
  async globalSearch(query: string, modules?: string[]): Promise<ApiResponse<SearchResult>> {
    const params: Record<string, string> = { q: query };
    if (modules && modules.length > 0) {
      params.modules = modules.join(',');
    }
    return apiClient.get('/api/search', params);
  },
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  /**
   * Get user notifications
   */
  async getNotifications(): Promise<ApiResponse<NotificationData[]>> {
    return apiClient.get('/api/notifications');
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse> {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Create notification
   */
  async createNotification(data: any): Promise<ApiResponse> {
    return apiClient.post('/notifications', data);
  },
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  /**
   * Get dashboard widgets
   */
  async getWidgets(): Promise<ApiResponse<{ widgets: DashboardWidget[] }>> {
    return apiClient.get('/api/dashboard/widgets');
  },

  /**
   * Update widget configuration
   */
  async updateWidget(widgetId: string, config: any): Promise<ApiResponse> {
    return apiClient.put(`/dashboard/widgets/${widgetId}`, config);
  },
};

/**
 * Employee API
 */
export const employeeAPI = {
  /**
   * Get all employees
   */
  async getEmployees(filters?: any): Promise<ApiResponse> {
    return apiClient.get('/employees', filters);
  },

  /**
   * Get employee by ID
   */
  async getEmployee(id: string): Promise<ApiResponse> {
    return apiClient.get(`/employees/${id}`);
  },

  /**
   * Create new employee
   */
  async createEmployee(data: any): Promise<ApiResponse> {
    return apiClient.post('/employees', data);
  },

  /**
   * Update employee
   */
  async updateEmployee(id: string, data: any): Promise<ApiResponse> {
    return apiClient.put(`/employees/${id}`, data);
  },

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/employees/${id}`);
  },
};

/**
 * Attendance API
 */
export const attendanceAPI = {
  /**
   * Clock in/out
   */
  async clockInOut(action: 'in' | 'out', location?: string): Promise<ApiResponse> {
    return apiClient.post('/attendance/clock', { action, location });
  },

  /**
   * Get attendance logs
   */
  async getLogs(startDate?: string, endDate?: string): Promise<ApiResponse> {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return apiClient.get('/attendance/logs', params);
  },

  /**
   * Get attendance summary
   */
  async getSummary(period: string): Promise<ApiResponse> {
    return apiClient.get('/attendance/summary', { period });
  },
};

/**
 * Leave Management API
 */
export const leaveAPI = {
  /**
   * Submit leave request
   */
  async submitRequest(data: any): Promise<ApiResponse> {
    return apiClient.post('/leave/request', data);
  },

  /**
   * Get leave requests
   */
  async getRequests(status?: string): Promise<ApiResponse> {
    const params = status ? { status } : {};
    return apiClient.get('/leave/requests', params);
  },

  /**
   * Approve/reject leave request
   */
  async updateRequestStatus(id: string, status: string, comments?: string): Promise<ApiResponse> {
    return apiClient.put(`/leave/requests/${id}`, { status, comments });
  },

  /**
   * Get leave balance
   */
  async getBalance(): Promise<ApiResponse> {
    return apiClient.get('/leave/balance');
  },
};

/**
 * Performance API
 */
export const performanceAPI = {
  /**
   * Get goals
   */
  async getGoals(): Promise<ApiResponse> {
    return apiClient.get('/performance/goals');
  },

  /**
   * Create goal
   */
  async createGoal(data: any): Promise<ApiResponse> {
    return apiClient.post('/performance/goals', data);
  },

  /**
   * Update goal progress
   */
  async updateGoal(id: string, data: any): Promise<ApiResponse> {
    return apiClient.put(`/performance/goals/${id}`, data);
  },

  /**
   * Get performance reviews
   */
  async getReviews(): Promise<ApiResponse> {
    return apiClient.get('/performance/reviews');
  },
};

/**
 * Reports API
 */
export const reportsAPI = {
  /**
   * Generate report
   */
  async generateReport(type: string, filters: any): Promise<ApiResponse> {
    return apiClient.post('/reports/generate', { type, filters });
  },

  /**
   * Export report
   */
  async exportReport(reportId: string, format: string): Promise<ApiResponse> {
    return apiClient.get(`/reports/${reportId}/export`, { format });
  },

  /**
   * Get analytics data
   */
  async getAnalytics(module: string, dateRange: any): Promise<ApiResponse> {
    return apiClient.post('/advanced-reports/analytics', { module, dateRange });
  },
};

/**
 * Onboarding API
 */
export const onboardingAPI = {
  /**
   * Get onboarding process
   */
  async getProcess(employeeId: string): Promise<ApiResponse> {
    return apiClient.get(`/onboarding/process/${employeeId}`);
  },

  /**
   * Update task status
   */
  async updateTask(processId: string, taskId: string, status: string): Promise<ApiResponse> {
    return apiClient.put(`/onboarding/process/${processId}/task/${taskId}`, { status });
  },

  /**
   * Upload document
   */
  async uploadDocument(file: File, documentType: string): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    try {
      const response = await fetch(`${API_BASE_URL}/onboarding/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': apiClient.authToken ? `Bearer ${apiClient.authToken}` : '',
        },
      });

      const data = await response.json().catch(() => null);
      return { data, status: response.status };
    } catch (error) {
      console.error('Document upload failed:', error);
      return { error: 'Upload failed', status: 0 };
    }
  },
};

/**
 * Security API
 */
export const securityAPI = {
  /**
   * Enable MFA
   */
  async enableMFA(method: string): Promise<ApiResponse> {
    return apiClient.post('/security/mfa/enable', { method });
  },

  /**
   * Verify MFA code
   */
  async verifyMFA(code: string): Promise<ApiResponse> {
    return apiClient.post('/security/mfa/verify', { code });
  },

  /**
   * Get security logs
   */
  async getSecurityLogs(): Promise<ApiResponse> {
    return apiClient.get('/security/logs');
  },

  /**
   * Update security settings
   */
  async updateSettings(settings: any): Promise<ApiResponse> {
    return apiClient.put('/security/settings', settings);
  },
};

// Export the API client for direct use if needed
export { apiClient };

// Default export with all API modules
export default {
  auth: authAPI,
  search: searchAPI,
  notifications: notificationsAPI,
  dashboard: dashboardAPI,
  employee: employeeAPI,
  attendance: attendanceAPI,
  leave: leaveAPI,
  performance: performanceAPI,
  reports: reportsAPI,
  onboarding: onboardingAPI,
  security: securityAPI,
};
