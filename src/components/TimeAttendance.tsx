/**
 * Time & Attendance Component - Employee time tracking and attendance management
 * Comprehensive attendance tracking with clock in/out, overtime, and reporting
 */

import React, { useState } from 'react';
import { Clock, Calendar, Users, TrendingUp, CheckCircle, AlertCircle, MapPin, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  overtimeHours: number;
  status: 'present' | 'late' | 'absent' | 'half-day' | 'work-from-home';
  location: string;
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  isOnline: boolean;
  lastSeen: string;
  clockedIn: boolean;
  clockInTime?: string;
  expectedHours: number;
  currentMonthHours: number;
  overtimeHours: number;
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'vacation' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export default function TimeAttendance() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'timeoff' | 'reports'>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  /**
   * Mock employees data
   */
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Alice Cooper',
      department: 'Engineering',
      position: 'Senior Developer',
      isOnline: true,
      lastSeen: '2024-01-15T09:00:00Z',
      clockedIn: true,
      clockInTime: '09:00 AM',
      expectedHours: 160,
      currentMonthHours: 120,
      overtimeHours: 8
    },
    {
      id: 'EMP002',
      name: 'Bob Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      isOnline: false,
      lastSeen: '2024-01-15T18:30:00Z',
      clockedIn: false,
      expectedHours: 160,
      currentMonthHours: 158,
      overtimeHours: 12
    },
    {
      id: 'EMP003',
      name: 'Carol Davis',
      department: 'Sales',
      position: 'Sales Representative',
      isOnline: true,
      lastSeen: '2024-01-15T10:15:00Z',
      clockedIn: true,
      clockInTime: '10:15 AM',
      expectedHours: 160,
      currentMonthHours: 145,
      overtimeHours: 5
    },
    {
      id: 'EMP004',
      name: 'David Wilson',
      department: 'Engineering',
      position: 'Frontend Developer',
      isOnline: true,
      lastSeen: '2024-01-15T08:45:00Z',
      clockedIn: true,
      clockInTime: '08:45 AM',
      expectedHours: 160,
      currentMonthHours: 162,
      overtimeHours: 15
    }
  ];

  /**
   * Mock attendance records
   */
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 'ATT001',
      employeeId: 'EMP001',
      employeeName: 'Alice Cooper',
      department: 'Engineering',
      date: '2024-01-15',
      clockIn: '09:00 AM',
      clockOut: '06:00 PM',
      totalHours: 8,
      overtimeHours: 0,
      status: 'present',
      location: 'Bangalore Office'
    },
    {
      id: 'ATT002',
      employeeId: 'EMP002',
      employeeName: 'Bob Johnson',
      department: 'Marketing',
      date: '2024-01-15',
      clockIn: '09:30 AM',
      clockOut: '07:00 PM',
      totalHours: 8.5,
      overtimeHours: 0.5,
      status: 'late',
      location: 'Mumbai Office'
    },
    {
      id: 'ATT003',
      employeeId: 'EMP003',
      employeeName: 'Carol Davis',
      department: 'Sales',
      date: '2024-01-15',
      clockIn: '10:00 AM',
      clockOut: '02:00 PM',
      totalHours: 4,
      overtimeHours: 0,
      status: 'half-day',
      location: 'Remote',
      notes: 'Medical appointment'
    },
    {
      id: 'ATT004',
      employeeId: 'EMP004',
      employeeName: 'David Wilson',
      department: 'Engineering',
      date: '2024-01-15',
      clockIn: '08:45 AM',
      clockOut: '07:30 PM',
      totalHours: 9.75,
      overtimeHours: 1.75,
      status: 'present',
      location: 'Bangalore Office'
    }
  ];

  /**
   * Mock time off requests
   */
  const timeOffRequests: TimeOffRequest[] = [
    {
      id: 'REQ001',
      employeeId: 'EMP001',
      employeeName: 'Alice Cooper',
      type: 'vacation',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      reason: 'Family vacation',
      status: 'approved',
      submittedDate: '2024-01-10'
    },
    {
      id: 'REQ002',
      employeeId: 'EMP002',
      employeeName: 'Bob Johnson',
      type: 'sick',
      startDate: '2024-01-18',
      endDate: '2024-01-18',
      reason: 'Flu symptoms',
      status: 'pending',
      submittedDate: '2024-01-17'
    },
    {
      id: 'REQ003',
      employeeId: 'EMP003',
      employeeName: 'Carol Davis',
      type: 'personal',
      startDate: '2024-01-22',
      endDate: '2024-01-22',
      reason: 'Personal appointment',
      status: 'approved',
      submittedDate: '2024-01-15'
    }
  ];

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'half-day': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'work-from-home': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get request status color
   */
  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Format time for display
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Time & Attendance</h2>
          <p className="text-gray-600 dark:text-gray-400">Track employee attendance and working hours</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Time</p>
            <p className="text-lg font-semibold">{formatTime(currentTime)}</p>
          </div>
          <Button>
            <Clock className="w-4 h-4 mr-2" />
            Clock In/Out
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">24</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">out of 30 employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">2</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Overtime Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">45</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Employee Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Live Employee Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          employee.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position} • {employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{employee.clockedIn ? 'Clocked In' : 'Clocked Out'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {employee.clockedIn ? employee.clockInTime : 'Not clocked in'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{employee.currentMonthHours}h</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{employee.overtimeHours}h</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overtime</p>
                      </div>
                      <Badge className={employee.clockedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {employee.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Daily Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{record.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Clock In</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.clockIn}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Clock Out</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.clockOut}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Total Hours</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.totalHours}h</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Overtime</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.overtimeHours}h</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{record.location}</span>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Off Tab */}
        <TabsContent value="timeoff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Time Off Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeOffRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{request.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{request.type}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Start Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">End Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Submitted</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getRequestStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Working Days</span>
                    <span className="font-medium">22</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Attendance</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Late Arrivals</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Early Departures</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Overtime Hours</span>
                    <span className="font-medium">120</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Engineering</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={96} className="w-20" />
                      <span className="text-sm">96%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Marketing</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sales</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={88} className="w-20" />
                      <span className="text-sm">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HR</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={100} className="w-20" />
                      <span className="text-sm">100%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Finance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={94} className="w-20" />
                      <span className="text-sm">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}