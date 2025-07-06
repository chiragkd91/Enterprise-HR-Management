/**
 * System Access Management Component - Complete user access and provisioning system
 * Handles user accounts, access rights, software access requests, deprovisioning, and compliance
 */

import React, { useState } from 'react';
import { Key, Shield, Users, Settings, Clock, CheckCircle, XCircle, AlertTriangle, Plus, Search, Filter, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: string;
  accountCreated: string;
  accessGroups: string[];
  systemAccess: {
    system: string;
    access: 'full' | 'read' | 'write' | 'none';
    granted: string;
  }[];
}

interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requestType: 'new_access' | 'modify_access' | 'remove_access' | 'software_access';
  targetSystem: string;
  accessLevel: string;
  businessJustification: string;
  approver?: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  requestDate: string;
  approvalDate?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceAudit {
  id: string;
  auditType: 'access_review' | 'privilege_escalation' | 'inactive_accounts' | 'failed_logins';
  finding: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  status: 'open' | 'in_progress' | 'resolved';
  discoveredDate: string;
  dueDate: string;
  assignedTo: string;
}

interface AccessGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  lastModified: string;
  owner: string;
}

export default function SystemAccessManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'requests' | 'compliance'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  /**
   * Mock user accounts
   */
  const userAccounts: UserAccount[] = [
    {
      id: 'USR001',
      username: 'sarah.johnson',
      email: 'sarah.johnson@company.com',
      fullName: 'Sarah Johnson',
      department: 'Engineering',
      role: 'Senior Developer',
      status: 'active',
      lastLogin: '2024-02-02T14:30:00Z',
      accountCreated: '2023-06-15T09:00:00Z',
      accessGroups: ['Engineering Team', 'AWS Developers', 'VPN Users'],
      systemAccess: [
        { system: 'GitHub', access: 'full', granted: '2023-06-15' },
        { system: 'AWS Console', access: 'write', granted: '2023-06-20' },
        { system: 'Jira', access: 'write', granted: '2023-06-15' },
        { system: 'Confluence', access: 'write', granted: '2023-06-15' }
      ]
    },
    {
      id: 'USR002',
      username: 'michael.rodriguez',
      email: 'michael.rodriguez@company.com',
      fullName: 'Michael Rodriguez',
      department: 'Marketing',
      role: 'Marketing Manager',
      status: 'active',
      lastLogin: '2024-02-02T10:15:00Z',
      accountCreated: '2023-03-10T09:00:00Z',
      accessGroups: ['Marketing Team', 'CRM Users', 'Social Media'],
      systemAccess: [
        { system: 'Salesforce', access: 'full', granted: '2023-03-10' },
        { system: 'HubSpot', access: 'write', granted: '2023-03-15' },
        { system: 'Adobe Creative', access: 'full', granted: '2023-03-20' }
      ]
    },
    {
      id: 'USR003',
      username: 'emily.chen',
      email: 'emily.chen@company.com',
      fullName: 'Emily Chen',
      department: 'HR',
      role: 'HR Specialist',
      status: 'active',
      lastLogin: '2024-02-01T16:45:00Z',
      accountCreated: '2023-01-20T09:00:00Z',
      accessGroups: ['HR Team', 'HRIS Admins', 'Payroll'],
      systemAccess: [
        { system: 'BambooHR', access: 'full', granted: '2023-01-20' },
        { system: 'ADP Payroll', access: 'write', granted: '2023-01-25' },
        { system: 'Microsoft 365', access: 'write', granted: '2023-01-20' }
      ]
    },
    {
      id: 'USR004',
      username: 'john.inactive',
      email: 'john.inactive@company.com',
      fullName: 'John Inactive',
      department: 'Finance',
      role: 'Former Analyst',
      status: 'inactive',
      lastLogin: '2023-12-15T11:30:00Z',
      accountCreated: '2022-08-01T09:00:00Z',
      accessGroups: [],
      systemAccess: []
    }
  ];

  /**
   * Mock access requests
   */
  const accessRequests: AccessRequest[] = [
    {
      id: 'REQ001',
      requesterId: 'USR005',
      requesterName: 'David Kim',
      requestType: 'software_access',
      targetSystem: 'Adobe Creative Suite',
      accessLevel: 'Full Access',
      businessJustification: 'Need to create marketing materials for upcoming product launch',
      status: 'pending',
      requestDate: '2024-02-01T09:30:00Z',
      urgency: 'medium'
    },
    {
      id: 'REQ002',
      requesterId: 'USR006',
      requesterName: 'Lisa Wang',
      requestType: 'new_access',
      targetSystem: 'AWS Console',
      accessLevel: 'Read Only',
      businessJustification: 'New team member needs monitoring access for infrastructure',
      approver: 'IT Manager',
      status: 'approved',
      requestDate: '2024-01-28T14:15:00Z',
      approvalDate: '2024-01-29T10:30:00Z',
      urgency: 'high'
    },
    {
      id: 'REQ003',
      requesterId: 'USR007',
      requesterName: 'Mark Thompson',
      requestType: 'modify_access',
      targetSystem: 'Salesforce',
      accessLevel: 'Admin Rights',
      businessJustification: 'Promotion to Sales Manager requires admin access',
      status: 'implemented',
      requestDate: '2024-01-25T11:00:00Z',
      approvalDate: '2024-01-26T09:15:00Z',
      urgency: 'medium'
    }
  ];

  /**
   * Mock compliance audits
   */
  const complianceAudits: ComplianceAudit[] = [
    {
      id: 'AUD001',
      auditType: 'inactive_accounts',
      finding: '5 user accounts have been inactive for over 90 days',
      severity: 'medium',
      affectedUsers: 5,
      status: 'open',
      discoveredDate: '2024-02-01T00:00:00Z',
      dueDate: '2024-02-15T00:00:00Z',
      assignedTo: 'Security Team'
    },
    {
      id: 'AUD002',
      auditType: 'privilege_escalation',
      finding: 'Unauthorized admin access detected for 2 users',
      severity: 'high',
      affectedUsers: 2,
      status: 'in_progress',
      discoveredDate: '2024-01-30T00:00:00Z',
      dueDate: '2024-02-05T00:00:00Z',
      assignedTo: 'IT Security'
    },
    {
      id: 'AUD003',
      auditType: 'access_review',
      finding: 'Quarterly access review completed - 12 access modifications needed',
      severity: 'low',
      affectedUsers: 12,
      status: 'resolved',
      discoveredDate: '2024-01-15T00:00:00Z',
      dueDate: '2024-01-31T00:00:00Z',
      assignedTo: 'Access Management Team'
    }
  ];

  /**
   * Mock access groups
   */
  const accessGroups: AccessGroup[] = [
    {
      id: 'GRP001',
      name: 'Engineering Team',
      description: 'Full access to development tools and environments',
      permissions: ['GitHub Full', 'AWS Development', 'Jira Admin', 'Jenkins', 'Docker Registry'],
      memberCount: 25,
      lastModified: '2024-01-15T10:30:00Z',
      owner: 'Engineering Manager'
    },
    {
      id: 'GRP002',
      name: 'HR Team',
      description: 'Human resources systems and employee data access',
      permissions: ['BambooHR Admin', 'ADP Payroll', 'Background Check Systems', 'Employee Files'],
      memberCount: 8,
      lastModified: '2024-01-20T14:15:00Z',
      owner: 'HR Director'
    },
    {
      id: 'GRP003',
      name: 'Finance Team',
      description: 'Financial systems and reporting access',
      permissions: ['QuickBooks Admin', 'Banking Systems', 'Expense Reports', 'Financial Dashboards'],
      memberCount: 12,
      lastModified: '2024-01-10T09:45:00Z',
      owner: 'Finance Manager'
    }
  ];

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'implemented': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'open': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get severity color
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Calculate access statistics
   */
  const accessStats = {
    totalUsers: userAccounts.length,
    activeUsers: userAccounts.filter(u => u.status === 'active').length,
    pendingRequests: accessRequests.filter(r => r.status === 'pending').length,
    openAudits: complianceAudits.filter(a => a.status === 'open').length,
    complianceScore: Math.round((complianceAudits.filter(a => a.status === 'resolved').length / complianceAudits.length) * 100)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Access Management</h1>
          <p className="text-gray-600 dark:text-gray-400">User provisioning, access control, and compliance monitoring</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="accounts">User Accounts</TabsTrigger>
            <TabsTrigger value="requests">Access Requests</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & Audit</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{accessStats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{accessStats.activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{accessStats.pendingRequests}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Audits</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{accessStats.openAudits}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{accessStats.complianceScore}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Access Groups Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Access Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {accessGroups.map((group) => (
                    <div key={group.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{group.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm">{group.memberCount} members</span>
                        <Badge variant="outline">{group.permissions.length} permissions</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Access Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'New access request for Adobe Creative Suite', user: 'David Kim', time: '2 hours ago' },
                    { action: 'AWS Console access approved for Lisa Wang', user: 'IT Manager', time: '1 day ago' },
                    { action: 'Salesforce admin rights granted to Mark Thompson', user: 'Security Team', time: '2 days ago' },
                    { action: 'Quarterly access review completed', user: 'Access Management', time: '1 week ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Accounts</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New User
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {userAccounts.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.fullName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.username} • {user.email}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.role} • {user.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Last Login</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Access Groups</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.accessGroups.length} groups
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">System Access</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.systemAccess.length} systems
                          </p>
                        </div>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Access Requests</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>

            <div className="space-y-4">
              {accessRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{request.targetSystem} - {request.accessLevel}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Requested by: <strong>{request.requesterName}</strong>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <strong>Justification:</strong> {request.businessJustification}
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge variant="outline" className="capitalize">
                            {request.requestType.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Requested: {new Date(request.requestDate).toLocaleDateString()}
                          </span>
                          {request.approvalDate && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Approved: {new Date(request.approvalDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance & Audit Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <h2 className="text-xl font-semibold">Compliance & Audit Findings</h2>

            <div className="space-y-4">
              {complianceAudits.map((audit) => (
                <Card key={audit.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg capitalize">{audit.auditType.replace('_', ' ')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{audit.finding}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <span className="text-sm">
                            <strong>Affected Users:</strong> {audit.affectedUsers}
                          </span>
                          <span className="text-sm">
                            <strong>Assigned to:</strong> {audit.assignedTo}
                          </span>
                          <span className="text-sm">
                            <strong>Due:</strong> {new Date(audit.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(audit.severity)}>
                          {audit.severity}
                        </Badge>
                        <Badge className={getStatusColor(audit.status)}>
                          {audit.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{accessStats.complianceScore}%</p>
                    <p className="text-sm text-green-600">Overall Compliance</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{complianceAudits.filter(a => a.status === 'resolved').length}</p>
                    <p className="text-sm text-blue-600">Resolved Findings</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{accessStats.openAudits}</p>
                    <p className="text-sm text-orange-600">Open Findings</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">7</p>
                    <p className="text-sm text-purple-600">Days Avg Resolution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
