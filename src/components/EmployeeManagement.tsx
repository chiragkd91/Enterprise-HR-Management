/**
 * Employee Management Component - Comprehensive employee lifecycle management
 * Handles employee records, profiles, and organizational hierarchy
 */

import React, { useState } from 'react';
import { Users, UserPlus, Search, Filter, Mail, Phone, MapPin, Calendar, Building, Edit3, Eye, Trash2, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager: string;
  location: string;
  startDate: string;
  employeeType: 'full-time' | 'part-time' | 'contractor' | 'intern';
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  salary: number;
  avatar?: string;
}

export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'reports'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  /**
   * Mock employee data
   */
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Alice Cooper',
      email: 'alice.cooper@globalcyberit.com',
      phone: '+91 98765 43210',
      department: 'Engineering',
      position: 'Senior Developer',
      manager: 'John Smith',
      location: 'Bangalore',
      startDate: '2023-01-15',
      employeeType: 'full-time',
      status: 'active',
      salary: 1200000
    },
    {
      id: 'EMP002',
      name: 'Raj Patel',
      email: 'raj.patel@globalcyberit.com',
      phone: '+91 98765 43211',
      department: 'Marketing',
      position: 'Marketing Manager',
      manager: 'Sarah Johnson',
      location: 'Mumbai',
      startDate: '2023-03-20',
      employeeType: 'full-time',
      status: 'active',
      salary: 900000
    },
    {
      id: 'EMP003',
      name: 'Priya Sharma',
      email: 'priya.sharma@globalcyberit.com',
      phone: '+91 98765 43212',
      department: 'HR',
      position: 'HR Business Partner',
      manager: 'Lisa Brown',
      location: 'Delhi',
      startDate: '2023-06-10',
      employeeType: 'full-time',
      status: 'active',
      salary: 800000
    },
    {
      id: 'EMP004',
      name: 'Arjun Kumar',
      email: 'arjun.kumar@globalcyberit.com',
      phone: '+91 98765 43213',
      department: 'Sales',
      position: 'Sales Executive',
      manager: 'Mike Davis',
      location: 'Chennai',
      startDate: '2023-09-01',
      employeeType: 'full-time',
      status: 'active',
      salary: 600000
    },
    {
      id: 'EMP005',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@globalcyberit.com',
      phone: '+91 98765 43214',
      department: 'Finance',
      position: 'Financial Analyst',
      manager: 'Robert Wilson',
      location: 'Hyderabad',
      startDate: '2023-11-15',
      employeeType: 'full-time',
      status: 'active',
      salary: 700000
    },
    {
      id: 'EMP006',
      name: 'Vikram Singh',
      email: 'vikram.singh@globalcyberit.com',
      phone: '+91 98765 43215',
      department: 'Engineering',
      position: 'DevOps Engineer',
      manager: 'John Smith',
      location: 'Pune',
      startDate: '2023-08-20',
      employeeType: 'full-time',
      status: 'on-leave',
      salary: 1100000
    }
  ];

  const departments = [
    { name: 'Engineering', count: 25, head: 'John Smith' },
    { name: 'Marketing', count: 12, head: 'Sarah Johnson' },
    { name: 'Sales', count: 18, head: 'Mike Davis' },
    { name: 'HR', count: 8, head: 'Lisa Brown' },
    { name: 'Finance', count: 10, head: 'Robert Wilson' }
  ];

  /**
   * Filter employees based on search and department
   */
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'terminated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get employee type color
   */
  const getEmployeeTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'part-time': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'contractor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'intern': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employee Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your workforce and organizational structure</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employees">Employees ({employees.length})</TabsTrigger>
            <TabsTrigger value="departments">Departments ({departments.length})</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.name} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{employee.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{employee.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{employee.department}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{employee.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Started {new Date(employee.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge className={getEmployeeTypeColor(employee.employeeType)}>
                          {employee.employeeType.replace('-', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <Card key={dept.name} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{dept.name}</span>
                      <Badge variant="secondary">{dept.count} employees</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Department Head: {dept.head}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {dept.count} total employees
                        </span>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Department
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Employees</span>
                      <span className="font-semibold">{employees.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Employees</span>
                      <span className="font-semibold text-green-600">
                        {employees.filter(e => e.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>On Leave</span>
                      <span className="font-semibold text-yellow-600">
                        {employees.filter(e => e.status === 'on-leave').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Terminated</span>
                      <span className="font-semibold text-red-600">
                        {employees.filter(e => e.status === 'terminated').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.name} className="flex justify-between items-center">
                        <span>{dept.name}</span>
                        <span className="font-semibold">{dept.count}</span>
                      </div>
                    ))}
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
