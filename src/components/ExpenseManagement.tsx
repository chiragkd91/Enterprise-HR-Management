/**
 * Expense Management Component - Complete expense tracking and reimbursement system
 * Handles expense submissions, approvals, reimbursements, and budget tracking
 */

import React, { useState } from 'react';
import { Receipt, DollarSign, Upload, CheckCircle, Clock, XCircle, TrendingUp, Calendar, Plus, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExpenseReport {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  category: 'travel' | 'meals' | 'equipment' | 'training' | 'supplies' | 'other';
  amount: number;
  currency: string;
  description: string;
  submissionDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  approver?: string;
  receipts: string[];
  businessJustification: string;
}

interface BudgetAllocation {
  department: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  period: string;
}

export default function ExpenseManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'approvals' | 'budgets'>('dashboard');
  const [filterStatus, setFilterStatus] = useState('all');

  /**
   * Mock expense reports
   */
  const expenseReports: ExpenseReport[] = [
    {
      id: 'EXP001',
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      title: 'Client Meeting Travel',
      category: 'travel',
      amount: 850.50,
      currency: 'USD',
      description: 'Flight and hotel for client meeting in Chicago',
      submissionDate: '2024-01-25',
      status: 'approved',
      approver: 'David Chen',
      receipts: ['receipt1.pdf', 'receipt2.pdf'],
      businessJustification: 'Essential client meeting for new project requirements'
    },
    {
      id: 'EXP002',
      employeeId: 'EMP002',
      employeeName: 'Michael Rodriguez',
      department: 'Marketing',
      title: 'Conference Registration',
      category: 'training',
      amount: 1200.00,
      currency: 'USD',
      description: 'Registration for Digital Marketing Summit 2024',
      submissionDate: '2024-01-28',
      status: 'submitted',
      receipts: ['invoice.pdf'],
      businessJustification: 'Professional development for marketing strategies'
    },
    {
      id: 'EXP003',
      employeeId: 'EMP003',
      employeeName: 'Emily Chen',
      department: 'HR',
      title: 'Team Lunch',
      category: 'meals',
      amount: 125.75,
      currency: 'USD',
      description: 'Team building lunch for onboarding training',
      submissionDate: '2024-01-30',
      status: 'reimbursed',
      approver: 'Robert Kim',
      receipts: ['restaurant_receipt.jpg'],
      businessJustification: 'Team building activity for new employee integration'
    },
    {
      id: 'EXP004',
      employeeId: 'EMP004',
      employeeName: 'James Wilson',
      department: 'Finance',
      title: 'Office Supplies',
      category: 'supplies',
      amount: 89.99,
      currency: 'USD',
      description: 'Notebooks, pens, and desk organizers',
      submissionDate: '2024-02-01',
      status: 'draft',
      receipts: ['staples_receipt.pdf'],
      businessJustification: 'Essential office supplies for daily operations'
    }
  ];

  /**
   * Budget allocations by department and category
   */
  const budgetAllocations: BudgetAllocation[] = [
    {
      department: 'Engineering',
      category: 'travel',
      allocated: 15000,
      spent: 8500,
      remaining: 6500,
      period: '2024 Q1'
    },
    {
      department: 'Marketing',
      category: 'training',
      allocated: 12000,
      spent: 4800,
      remaining: 7200,
      period: '2024 Q1'
    },
    {
      department: 'HR',
      category: 'meals',
      allocated: 3000,
      spent: 1250,
      remaining: 1750,
      period: '2024 Q1'
    },
    {
      department: 'Finance',
      category: 'supplies',
      allocated: 2000,
      spent: 450,
      remaining: 1550,
      period: '2024 Q1'
    }
  ];

  /**
   * Get status color and icon
   */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved': 
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: CheckCircle
        };
      case 'submitted': 
        return { 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: Clock
        };
      case 'reimbursed': 
        return { 
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: DollarSign
        };
      case 'rejected': 
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: XCircle
        };
      case 'draft': 
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: Receipt
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: Receipt
        };
    }
  };

  /**
   * Get category theme
   */
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'travel': return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'meals': return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' };
      case 'equipment': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' };
      case 'training': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' };
      case 'supplies': return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' };
    }
  };

  /**
   * Calculate expense statistics
   */
  const expenseStats = {
    totalReports: expenseReports.length,
    totalAmount: expenseReports.reduce((sum, report) => sum + report.amount, 0),
    pendingApproval: expenseReports.filter(r => r.status === 'submitted').length,
    reimbursedAmount: expenseReports.filter(r => r.status === 'reimbursed').reduce((sum, r) => sum + r.amount, 0),
    averageAmount: expenseReports.reduce((sum, report) => sum + report.amount, 0) / expenseReports.length
  };

  /**
   * Filter reports based on status
   */
  const filteredReports = filterStatus === 'all' 
    ? expenseReports 
    : expenseReports.filter(report => report.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Expense Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track expenses, manage approvals, and monitor budgets</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Expense Reports</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="budgets">Budget Tracking</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{expenseStats.totalReports}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${expenseStats.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{expenseStats.pendingApproval}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reimbursed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${expenseStats.reimbursedAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-16 flex flex-col space-y-2">
                    <Plus className="w-6 h-6" />
                    <span>New Expense</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-2">
                    <Upload className="w-6 h-6" />
                    <span>Upload Receipts</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Approve Expenses</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-2">
                    <Download className="w-6 h-6" />
                    <span>Export Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Expense Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Sarah Johnson submitted travel expense for $850.50', time: '2 hours ago' },
                    { action: 'Conference registration approved for Michael Rodriguez', time: '1 day ago' },
                    { action: 'Team lunch expense reimbursed to Emily Chen', time: '2 days ago' },
                    { action: 'Monthly expense report generated', time: '1 week ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Expense Reports</h2>
              <div className="flex items-center space-x-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="reimbursed">Reimbursed</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReports.map((report) => {
                const statusConfig = getStatusConfig(report.status);
                const categoryTheme = getCategoryTheme(report.category);
                
                return (
                  <Card key={report.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {report.employeeName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {report.employeeName} • {report.department}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {report.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${categoryTheme.bg} ${categoryTheme.color}`}>
                              {report.category}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {new Date(report.submissionDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${report.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{report.currency}</p>
                          </div>
                          <Badge className={statusConfig.color}>
                            {report.status}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>

            <div className="space-y-4">
              {expenseReports.filter(r => r.status === 'submitted').map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {report.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {report.employeeName} • {report.department}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <strong>Justification:</strong> {report.businessJustification}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">${report.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {report.receipts.length} receipt(s)
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Budget Tracking Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <h2 className="text-xl font-semibold">Budget Tracking</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgetAllocations.map((budget, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{budget.department} - {budget.category}</span>
                      <Badge variant="outline">{budget.period}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Budget Utilization</span>
                        <span className="font-medium">
                          {Math.round((budget.spent / budget.allocated) * 100)}%
                        </span>
                      </div>
                      <Progress value={(budget.spent / budget.allocated) * 100} />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Allocated:</span>
                          <span className="font-medium">${budget.allocated.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spent:</span>
                          <span className="font-medium">${budget.spent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className="font-medium text-green-600">${budget.remaining.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Budget Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">${budgetAllocations.reduce((sum, b) => sum + b.allocated, 0).toLocaleString()}</p>
                    <p className="text-sm text-blue-600">Total Allocated</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">${budgetAllocations.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}</p>
                    <p className="text-sm text-red-600">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">${budgetAllocations.reduce((sum, b) => sum + b.remaining, 0).toLocaleString()}</p>
                    <p className="text-sm text-green-600">Total Remaining</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round((budgetAllocations.reduce((sum, b) => sum + b.spent, 0) / budgetAllocations.reduce((sum, b) => sum + b.allocated, 0)) * 100)}%
                    </p>
                    <p className="text-sm text-purple-600">Utilization Rate</p>
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
