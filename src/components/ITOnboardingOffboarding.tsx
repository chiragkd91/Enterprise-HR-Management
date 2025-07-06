/**
 * User Onboarding & Offboarding Component - Complete user lifecycle management
 * Handles employee onboarding and offboarding processes with task tracking
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  UserPlus, 
  UserMinus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Laptop,
  Shield,
  Github,
  Cloud,
  Users,
  Calendar,
  Monitor,
  FileText
} from 'lucide-react';

/**
 * Task interface
 */
interface Task {
  id: string;
  title: string;
  team: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Employee onboarding data interface
 */
interface OnboardingEmployee {
  id: string;
  name: string;
  position: string;
  manager: string;
  startDate: string;
  progress: number;
  tasks: Task[];
}

/**
 * User Onboarding & Offboarding Component
 */
export default function ITOnboardingOffboarding() {
  const [activeTab, setActiveTab] = useState('onboarding');

  /**
   * Sample onboarding data
   */
  const onboardingEmployees: OnboardingEmployee[] = [
    {
      id: '1',
      name: 'Alice Cooper',
      position: 'Senior Developer',
      manager: 'John Smith',
      startDate: '2/5/2024',
      progress: 75,
      tasks: [
        {
          id: '1',
          title: 'Setup company laptop and development environment',
          team: 'IT Hardware Team',
          dueDate: '2/5/2024',
          status: 'completed',
          icon: Laptop
        },
        {
          id: '2',
          title: 'Create user account and system access',
          team: 'IT Security',
          dueDate: '2/4/2024',
          status: 'completed',
          icon: Shield
        },
        {
          id: '3',
          title: 'Provision development tools access',
          team: 'DevOps Team',
          dueDate: '2/5/2024',
          status: 'completed',
          icon: Github
        },
        {
          id: '4',
          title: 'Setup cloud platform access',
          team: 'Cloud Team',
          dueDate: '2/6/2024',
          status: 'in-progress',
          icon: Cloud
        },
        {
          id: '5',
          title: 'Complete security awareness training',
          team: 'HR Training Team',
          dueDate: '2/7/2024',
          status: 'pending',
          icon: Shield
        },
        {
          id: '6',
          title: 'HR orientation and documentation',
          team: 'HR Team',
          dueDate: '2/8/2024',
          status: 'pending',
          icon: FileText
        },
        {
          id: '7',
          title: 'Department introduction and mentoring',
          team: 'Engineering Team',
          dueDate: '2/9/2024',
          status: 'pending',
          icon: Users
        }
      ]
    }
  ];

  /**
   * Get status icon and color
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  /**
   * Get status badge variant
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Onboarding & Offboarding</h1>
          <p className="text-gray-600">Complete user lifecycle management for employees</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Start New Onboarding
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="offboarding">Offboarding</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Onboarding Tab */}
        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Employee Onboarding
              </CardTitle>
              <CardDescription>Track and manage new employee onboarding progress</CardDescription>
            </CardHeader>
            <CardContent>
              {onboardingEmployees.map((employee) => (
                <div key={employee.id} className="space-y-6">
                  {/* Employee Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{employee.name}</h3>
                        <p className="text-sm text-gray-600">
                          {employee.position} • Engineering Manager: {employee.manager}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">{employee.startDate}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">{employee.progress}%</span>
                    </div>
                    <Progress value={employee.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>In Progress</span>
                      <span>{employee.tasks.filter(t => t.status === 'completed').length} of {employee.tasks.length} tasks completed</span>
                    </div>
                  </div>

                  {/* User Onboarding Tasks */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Onboarding Tasks</h4>
                    <div className="space-y-3">
                      {employee.tasks.map((task) => {
                        const Icon = task.icon;
                        return (
                          <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Icon className="w-6 h-6 text-gray-600" />
                            <div className="flex-1">
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-gray-600">{task.team} • Due: {task.dueDate}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(task.status)}
                              {getStatusBadge(task.status)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Assigned Resources */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Assigned Resources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Laptop className="w-8 h-8 text-gray-600" />
                        <div>
                          <p className="font-medium">MacBook Pro 16"</p>
                          <p className="text-sm text-gray-600">Serial: MBP-2024-001</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Monitor className="w-8 h-8 text-gray-600" />
                        <div>
                          <p className="font-medium">Dell Monitor 27"</p>
                          <p className="text-sm text-gray-600">Serial: DEL-2024-001</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Shield className="w-8 h-8 text-gray-600" />
                        <div>
                          <p className="font-medium">Security Badge</p>
                          <p className="text-sm text-gray-600">ID: BADGE-2024-001</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <FileText className="w-8 h-8 text-gray-600" />
                        <div>
                          <p className="font-medium">Welcome Package</p>
                          <p className="text-sm text-gray-600">Handbook & Forms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offboarding Tab */}
        <TabsContent value="offboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserMinus className="w-5 h-5 mr-2" />
                Employee Offboarding
              </CardTitle>
              <CardDescription>Manage employee departures and asset recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserMinus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Offboarding</h3>
                <p className="text-gray-600 mb-4">There are currently no employees in the offboarding process.</p>
                <Button variant="outline">
                  <UserMinus className="w-4 h-4 mr-2" />
                  Start Offboarding Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Templates</CardTitle>
              <CardDescription>Pre-configured templates for different roles and departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Software Developer</h4>
                  <p className="text-sm text-gray-600 mb-3">Complete setup for development team members</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">10 tasks</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sales Representative</h4>
                  <p className="text-sm text-gray-600 mb-3">CRM access and sales tools setup</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">8 tasks</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">HR Specialist</h4>
                  <p className="text-sm text-gray-600 mb-3">HR systems and compliance training</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">9 tasks</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Marketing Manager</h4>
                  <p className="text-sm text-gray-600 mb-3">Marketing tools and campaign access</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">7 tasks</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Finance Executive</h4>
                  <p className="text-sm text-gray-600 mb-3">Financial systems and GST compliance</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">11 tasks</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Operations Team</h4>
                  <p className="text-sm text-gray-600 mb-3">Operations tools and process training</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">6 tasks</span>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
