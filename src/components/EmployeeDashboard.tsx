/**
 * Employee Dashboard - Personal dashboard for employees
 * Shows employee-specific information, tasks, and quick actions
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Bell,
  User,
  CreditCard,
  Receipt,
  Target,
  Award,
  BookOpen,
  Coffee
} from 'lucide-react';

/**
 * Employee Dashboard Component
 */
export default function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your work today</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 mr-1" />
            On Time Today
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            3 Notifications
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">12 used this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152 hrs</div>
            <p className="text-xs text-muted-foreground">Target: 160 hrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your agenda for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Team Standup Meeting</p>
                  <p className="text-xs text-gray-500">9:30 AM - 10:00 AM</p>
                </div>
                <Badge variant="outline">In 30 mins</Badge>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Review</p>
                  <p className="text-xs text-gray-500">2:00 PM - 3:00 PM</p>
                </div>
                <Badge variant="secondary">Today</Badge>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Security Training</p>
                  <p className="text-xs text-gray-500">4:00 PM - 5:00 PM</p>
                </div>
                <Badge variant="outline">Mandatory</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest HR transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave request approved</p>
                  <p className="text-xs text-gray-500">Annual leave for Dec 25-26 • 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payslip generated</p>
                  <p className="text-xs text-gray-500">November 2024 payslip • 1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Performance review completed</p>
                  <p className="text-xs text-gray-500">Q4 2024 review submitted • 3 days ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Document update required</p>
                  <p className="text-xs text-gray-500">Emergency contact info • 1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Apply Leave</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Clock className="w-6 h-6" />
                <span className="text-sm">Mark Attendance</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Receipt className="w-6 h-6" />
                <span className="text-sm">Submit Expense</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="w-6 h-6" />
                <span className="text-sm">Download Payslip</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning & Development</CardTitle>
            <CardDescription>Your training progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Security Awareness</p>
                    <p className="text-xs text-gray-500">Due: Today</p>
                  </div>
                </div>
                <Badge variant="destructive">Overdue</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">React Advanced Concepts</p>
                    <p className="text-xs text-gray-500">Progress: 75%</p>
                  </div>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Git & Version Control</p>
                    <p className="text-xs text-gray-500">Completed: Nov 15</p>
                  </div>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Company Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">🎉 Holiday Party Announcement</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Join us for our annual holiday celebration on December 22nd! Food, games, and prizes await.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">Posted 2 days ago</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-green-900">📈 Q4 Performance Bonuses</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Performance bonuses for Q4 will be processed with December payroll. Great work everyone!
                  </p>
                  <p className="text-xs text-green-600 mt-2">Posted 1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
