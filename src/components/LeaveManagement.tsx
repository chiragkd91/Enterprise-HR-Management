/**
 * Leave Management Component - Employee leave requests and approvals
 * Comprehensive leave tracking with calendar integration and approval workflows
 */

import React, { useState } from 'react';
import { Calendar, Plus, Filter, Download, Clock, CheckCircle, XCircle, AlertCircle, User, FileText, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  department: string;
  annualLeave: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  personalLeave: { total: number; used: number; remaining: number };
  maternityLeave: { total: number; used: number; remaining: number };
}

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'balances' | 'reports'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  /**
   * Mock leave requests data
   */
  const leaveRequests: LeaveRequest[] = [
    {
      id: 'LR001',
      employeeId: 'EMP001',
      employeeName: 'Alex Rodriguez',
      department: 'Engineering',
      leaveType: 'Annual Leave',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      days: 5,
      reason: 'Family vacation',
      status: 'pending',
      appliedDate: '2024-01-15'
    },
    {
      id: 'LR002',
      employeeId: 'EMP002',
      employeeName: 'Maria Garcia',
      department: 'Marketing',
      leaveType: 'Sick Leave',
      startDate: '2024-01-22',
      endDate: '2024-01-23',
      days: 2,
      reason: 'Medical appointment',
      status: 'approved',
      appliedDate: '2024-01-20',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2024-01-21'
    },
    {
      id: 'LR003',
      employeeId: 'EMP003',
      employeeName: 'David Kim',
      department: 'Sales',
      leaveType: 'Personal Leave',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      days: 3,
      reason: 'Personal matters',
      status: 'approved',
      appliedDate: '2024-01-25',
      approvedBy: 'Mike Davis',
      approvedDate: '2024-01-26'
    },
    {
      id: 'LR004',
      employeeId: 'EMP004',
      employeeName: 'Sarah Thompson',
      department: 'HR',
      leaveType: 'Annual Leave',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      days: 11,
      reason: 'Extended vacation',
      status: 'rejected',
      appliedDate: '2024-01-28',
      approvedBy: 'Lisa Brown',
      approvedDate: '2024-01-30',
      comments: 'Peak business period, please reschedule'
    }
  ];

  /**
   * Mock leave balances data
   */
  const leaveBalances: LeaveBalance[] = [
    {
      employeeId: 'EMP001',
      employeeName: 'Alex Rodriguez',
      department: 'Engineering',
      annualLeave: { total: 25, used: 8, remaining: 17 },
      sickLeave: { total: 12, used: 2, remaining: 10 },
      personalLeave: { total: 5, used: 1, remaining: 4 },
      maternityLeave: { total: 0, used: 0, remaining: 0 }
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Maria Garcia',
      department: 'Marketing',
      annualLeave: { total: 25, used: 12, remaining: 13 },
      sickLeave: { total: 12, used: 4, remaining: 8 },
      personalLeave: { total: 5, used: 2, remaining: 3 },
      maternityLeave: { total: 90, used: 0, remaining: 90 }
    },
    {
      employeeId: 'EMP003',
      employeeName: 'David Kim',
      department: 'Sales',
      annualLeave: { total: 25, used: 5, remaining: 20 },
      sickLeave: { total: 12, used: 1, remaining: 11 },
      personalLeave: { total: 5, used: 0, remaining: 5 },
      maternityLeave: { total: 0, used: 0, remaining: 0 }
    }
  ];

  /**
   * Get status color for leave requests
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get leave type color
   */
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Annual Leave': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Sick Leave': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Personal Leave': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Maternity Leave': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get leave statistics
   */
  const getLeaveStats = () => {
    const pending = leaveRequests.filter(r => r.status === 'pending').length;
    const approved = leaveRequests.filter(r => r.status === 'approved').length;
    const rejected = leaveRequests.filter(r => r.status === 'rejected').length;
    const totalDays = leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);
    
    return { pending, approved, rejected, totalDays };
  };

  const stats = getLeaveStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leave Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage employee leave requests and balances</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Days Taken</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Leave Requests</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="balances">Leave Balances</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Leave Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Leave Requests</h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {leaveRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{request.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.employeeName}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{request.department}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getLeaveTypeColor(request.leaveType)}>
                          {request.leaveType}
                        </Badge>
                        <span className="text-sm font-medium">{request.days} days</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">From:</span>
                          <span className="font-medium">{new Date(request.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">To:</span>
                          <span className="font-medium">{new Date(request.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Applied:</span>
                          <span className="font-medium">{new Date(request.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reason:</p>
                        <p className="text-sm">{request.reason}</p>
                      </div>

                      {request.comments && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comments:</p>
                          <p className="text-sm text-red-600 dark:text-red-400">{request.comments}</p>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="flex-1">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Leave Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Calendar Integration</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Interactive calendar view showing all employee leave schedules
                  </p>
                  <Button>View Full Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Balances Tab */}
          <TabsContent value="balances" className="space-y-6">
            <div className="space-y-4">
              {leaveBalances.map((balance) => (
                <Card key={balance.employeeId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{balance.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{balance.employeeName}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{balance.department}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries({
                        'Annual Leave': balance.annualLeave,
                        'Sick Leave': balance.sickLeave,
                        'Personal Leave': balance.personalLeave,
                        'Maternity Leave': balance.maternityLeave
                      }).map(([leaveType, data]) => (
                        <div key={leaveType} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{leaveType}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {data.remaining}/{data.total}
                            </span>
                          </div>
                          <Progress 
                            value={(data.used / data.total) * 100} 
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Used: {data.used} | Remaining: {data.remaining}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Most Popular Leave Type</span>
                      <Badge className="bg-blue-100 text-blue-800">Annual Leave</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Peak Leave Month</span>
                      <span className="font-medium">December</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Leave Duration</span>
                      <span className="font-medium">3.2 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Department with Most Leaves</span>
                      <span className="font-medium">Engineering</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Monthly Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Leave Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      View Policy Updates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Employee Leave History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}