/**
 * Onboarding System Component - 17-task onboarding workflow with automation
 * Handles comprehensive employee onboarding with document processing
 */

import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle, FileText, Camera, User, Shield, Heart, DollarSign, Settings, Users, Laptop, MapPin, Target, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'verification' | 'compliance' | 'setup' | 'orientation';
  status: 'pending' | 'in-progress' | 'completed' | 'requires-attention';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  dependencies?: string[];
}

interface OnboardingProcess {
  employeeId: string;
  employeeName: string;
  department: string;
  startDate: string;
  expectedCompletion: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
}

export default function OnboardingSystem() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'documents' | 'processes'>('dashboard');
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null);

  /**
   * 17 mandatory onboarding tasks configuration
   */
  const onboardingTasks: OnboardingTask[] = [
    {
      id: 'identity-verification',
      title: 'Identity Verification',
      description: 'Government ID verification with OCR processing',
      icon: User,
      category: 'verification',
      status: 'completed',
      priority: 'high',
      estimatedTime: '10 minutes'
    },
    {
      id: 'background-check',
      title: 'Background Check',
      description: 'Criminal background verification',
      icon: Shield,
      category: 'verification',
      status: 'completed',
      priority: 'high',
      estimatedTime: '3-5 business days',
      dependencies: ['identity-verification']
    },
    {
      id: 'education-verification',
      title: 'Education Verification',
      description: 'Degree and certification validation',
      icon: BookOpen,
      category: 'verification',
      status: 'in-progress',
      priority: 'high',
      estimatedTime: '2-3 business days'
    },
    {
      id: 'employment-history',
      title: 'Employment History',
      description: 'Previous employment verification',
      icon: FileText,
      category: 'verification',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '1-2 business days'
    },
    {
      id: 'reference-checks',
      title: 'Reference Checks',
      description: 'Professional reference validation',
      icon: Users,
      category: 'verification',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '2-3 business days'
    },
    {
      id: 'medical-clearance',
      title: 'Medical Clearance',
      description: 'Health screening and medical fitness',
      icon: Heart,
      category: 'compliance',
      status: 'pending',
      priority: 'high',
      estimatedTime: '1 business day'
    },
    {
      id: 'drug-testing',
      title: 'Drug Testing',
      description: 'Substance screening compliance',
      icon: Shield,
      category: 'compliance',
      status: 'pending',
      priority: 'high',
      estimatedTime: '1 business day'
    },
    {
      id: 'legal-compliance',
      title: 'Legal Compliance',
      description: 'I-9, tax forms, and legal documentation',
      icon: FileText,
      category: 'compliance',
      status: 'pending',
      priority: 'high',
      estimatedTime: '30 minutes'
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      description: 'Contact information for emergencies',
      icon: AlertCircle,
      category: 'setup',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '10 minutes'
    },
    {
      id: 'banking-information',
      title: 'Banking Information',
      description: 'Direct deposit setup',
      icon: DollarSign,
      category: 'setup',
      status: 'pending',
      priority: 'high',
      estimatedTime: '15 minutes'
    },
    {
      id: 'benefit-enrollment',
      title: 'Benefit Enrollment',
      description: 'Health insurance and benefits selection',
      icon: Heart,
      category: 'setup',
      status: 'pending',
      priority: 'high',
      estimatedTime: '45 minutes'
    },
    {
      id: 'it-account-setup',
      title: 'IT Account Setup',
      description: 'System access and security training',
      icon: Settings,
      category: 'setup',
      status: 'pending',
      priority: 'high',
      estimatedTime: '30 minutes'
    },
    {
      id: 'equipment-assignment',
      title: 'Equipment Assignment',
      description: 'Laptop, phone, and hardware allocation',
      icon: Laptop,
      category: 'setup',
      status: 'pending',
      priority: 'high',
      estimatedTime: '20 minutes'
    },
    {
      id: 'office-tour',
      title: 'Office Tour & Orientation',
      description: 'Physical workspace familiarization',
      icon: MapPin,
      category: 'orientation',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '1 hour'
    },
    {
      id: 'manager-introduction',
      title: 'Manager Introduction',
      description: 'Direct supervisor meeting and goal setting',
      icon: Users,
      category: 'orientation',
      status: 'pending',
      priority: 'high',
      estimatedTime: '1 hour'
    },
    {
      id: 'training-schedule',
      title: 'Training Schedule',
      description: 'Job-specific training program enrollment',
      icon: BookOpen,
      category: 'orientation',
      status: 'pending',
      priority: 'medium',
      estimatedTime: '2-3 hours'
    },
    {
      id: 'final-review',
      title: 'Final Review',
      description: 'Comprehensive onboarding completion assessment',
      icon: Award,
      category: 'orientation',
      status: 'pending',
      priority: 'high',
      estimatedTime: '30 minutes',
      dependencies: ['identity-verification', 'background-check', 'education-verification', 'employment-history', 'reference-checks', 'medical-clearance', 'drug-testing', 'legal-compliance', 'emergency-contacts', 'banking-information', 'benefit-enrollment', 'it-account-setup', 'equipment-assignment', 'office-tour', 'manager-introduction', 'training-schedule']
    }
  ];

  /**
   * Mock onboarding processes
   */
  const onboardingProcesses: OnboardingProcess[] = [
    {
      employeeId: 'EMP001',
      employeeName: 'Alex Rodriguez',
      department: 'Engineering',
      startDate: '2024-01-15',
      expectedCompletion: '2024-01-29',
      progress: 85,
      status: 'in-progress'
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Maria Garcia',
      department: 'Marketing',
      startDate: '2024-01-20',
      expectedCompletion: '2024-02-03',
      progress: 45,
      status: 'in-progress'
    },
    {
      employeeId: 'EMP003',
      employeeName: 'David Kim',
      department: 'Sales',
      startDate: '2024-01-10',
      expectedCompletion: '2024-01-24',
      progress: 100,
      status: 'completed'
    },
    {
      employeeId: 'EMP004',
      employeeName: 'Sarah Thompson',
      department: 'HR',
      startDate: '2024-01-22',
      expectedCompletion: '2024-02-05',
      progress: 25,
      status: 'delayed'
    }
  ];

  /**
   * Get status color for tasks
   */
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'requires-attention': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get process status color
   */
  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get category icon and color
   */
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'verification': return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'compliance': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900' };
      case 'setup': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' };
      case 'orientation': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' };
    }
  };

  /**
   * Get task completion statistics
   */
  const getTaskStats = () => {
    const completed = onboardingTasks.filter(t => t.status === 'completed').length;
    const inProgress = onboardingTasks.filter(t => t.status === 'in-progress').length;
    const pending = onboardingTasks.filter(t => t.status === 'pending').length;
    const needsAttention = onboardingTasks.filter(t => t.status === 'requires-attention').length;
    
    return { completed, inProgress, pending, needsAttention, total: onboardingTasks.length };
  };

  const taskStats = getTaskStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Onboarding System</h1>
          <p className="text-gray-600 dark:text-gray-400">Streamlined 17-task onboarding workflow with automation</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({taskStats.total})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="processes">Processes</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Onboarding</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {onboardingProcesses.filter(p => p.status === 'in-progress').length}
                      </p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.completed}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.inProgress}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs Attention</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.needsAttention}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Onboarding Processes */}
            <Card>
              <CardHeader>
                <CardTitle>Current Onboarding Processes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onboardingProcesses.filter(p => p.status !== 'completed').map((process) => (
                    <div key={process.employeeId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{process.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{process.employeeName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{process.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getProcessStatusColor(process.status)}>
                            {process.status.replace('-', ' ')}
                          </Badge>
                          <span className="text-sm font-medium">{process.progress}%</span>
                        </div>
                        <Progress value={process.progress} className="w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onboardingTasks.map((task) => {
                const theme = getCategoryTheme(task.category);
                return (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg}`}>
                          <task.icon className={`w-5 h-5 ${theme.color}`} />
                        </div>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Category:</span>
                          <Badge variant="outline" className="capitalize">{task.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Est. Time:</span>
                          <span className="font-medium">{task.estimatedTime}</span>
                        </div>
                        <Button
                          variant={task.status === 'completed' ? 'outline' : 'default'}
                          className="w-full"
                          disabled={task.status === 'completed'}
                        >
                          {task.status === 'completed' ? 'Completed' : 'Start Task'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Document Upload & OCR Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Upload Area */}
                  <div className="md:col-span-2">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Drag & drop documents or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Supported: JPG, PNG, PDF (Max 5MB)
                      </p>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {/* Document Types */}
                  <div>
                    <h4 className="font-medium mb-4">Required Documents</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Aadhaar Card', status: 'uploaded', ocr: true },
                        { name: 'PAN Card', status: 'uploaded', ocr: true },
                        { name: 'Degree Certificate', status: 'pending', ocr: true },
                        { name: 'Previous Employment Letter', status: 'pending', ocr: false },
                        { name: 'Address Proof', status: 'pending', ocr: false }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={doc.status === 'uploaded' ? 'default' : 'outline'}>
                                {doc.status}
                              </Badge>
                              {doc.ocr && (
                                <Badge variant="secondary" className="text-xs">OCR</Badge>
                              )}
                            </div>
                          </div>
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {onboardingProcesses.map((process) => (
                <Card key={process.employeeId} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{process.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{process.employeeName}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{process.department}</p>
                        </div>
                      </div>
                      <Badge className={getProcessStatusColor(process.status)}>
                        {process.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{process.progress}%</span>
                        </div>
                        <Progress value={process.progress} />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                          <span className="font-medium">{new Date(process.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Expected:</span>
                          <span className="font-medium">{new Date(process.expectedCompletion).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
