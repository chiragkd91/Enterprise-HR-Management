/**
 * Onboarding Templates Component - Pre-configured templates for different roles
 * Allows creation and management of role-based onboarding workflows
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  FileText, 
  Users, 
  Code, 
  BarChart3, 
  DollarSign, 
  Settings, 
  Plus,
  Edit,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  taskCount: number;
  estimatedDuration: string;
  lastModified: string;
  isActive: boolean;
  tasks: TemplateTask[];
}

interface TemplateTask {
  id: string;
  title: string;
  description: string;
  assignedTeam: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  isRequired: boolean;
  category: 'verification' | 'setup' | 'training' | 'compliance';
}

export default function OnboardingTemplates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<OnboardingTemplate | null>(null);

  /**
   * Pre-configured onboarding templates
   */
  const templates: OnboardingTemplate[] = [
    {
      id: 'software-developer',
      name: 'Software Developer',
      description: 'Complete setup for development team members',
      department: 'Engineering',
      role: 'Developer',
      icon: Code,
      taskCount: 12,
      estimatedDuration: '5-7 days',
      lastModified: '2024-01-15',
      isActive: true,
      tasks: [
        {
          id: 'dev-1',
          title: 'Setup Development Environment',
          description: 'Install IDE, development tools, and configure workspace',
          assignedTeam: 'IT Team',
          priority: 'high',
          estimatedTime: '2 hours',
          isRequired: true,
          category: 'setup'
        },
        {
          id: 'dev-2',
          title: 'Git & Version Control Access',
          description: 'Provide access to repositories and setup Git credentials',
          assignedTeam: 'DevOps Team',
          priority: 'high',
          estimatedTime: '30 minutes',
          isRequired: true,
          category: 'setup'
        },
        {
          id: 'dev-3',
          title: 'Code Review Training',
          description: 'Introduction to code review process and best practices',
          assignedTeam: 'Senior Developer',
          priority: 'medium',
          estimatedTime: '1 hour',
          isRequired: true,
          category: 'training'
        }
      ]
    },
    {
      id: 'sales-representative',
      name: 'Sales Representative',
      description: 'CRM access and sales tools setup',
      department: 'Sales',
      role: 'Sales Rep',
      icon: BarChart3,
      taskCount: 8,
      estimatedDuration: '3-4 days',
      lastModified: '2024-01-12',
      isActive: true,
      tasks: [
        {
          id: 'sales-1',
          title: 'CRM System Training',
          description: 'Learn to use CRM for lead management and sales tracking',
          assignedTeam: 'Sales Manager',
          priority: 'high',
          estimatedTime: '2 hours',
          isRequired: true,
          category: 'training'
        },
        {
          id: 'sales-2',
          title: 'Product Knowledge Training',
          description: 'Comprehensive product training and feature overview',
          assignedTeam: 'Product Team',
          priority: 'high',
          estimatedTime: '4 hours',
          isRequired: true,
          category: 'training'
        }
      ]
    },
    {
      id: 'hr-specialist',
      name: 'HR Specialist',
      description: 'HR systems and compliance training',
      department: 'HR',
      role: 'HR Specialist',
      icon: Users,
      taskCount: 10,
      estimatedDuration: '4-6 days',
      lastModified: '2024-01-10',
      isActive: true,
      tasks: [
        {
          id: 'hr-1',
          title: 'HRIS System Training',
          description: 'Learn to use HR Information System for employee management',
          assignedTeam: 'HR Manager',
          priority: 'high',
          estimatedTime: '3 hours',
          isRequired: true,
          category: 'training'
        },
        {
          id: 'hr-2',
          title: 'Compliance & Legal Training',
          description: 'Labor law compliance and HR legal requirements',
          assignedTeam: 'Legal Team',
          priority: 'high',
          estimatedTime: '2 hours',
          isRequired: true,
          category: 'compliance'
        }
      ]
    },
    {
      id: 'marketing-manager',
      name: 'Marketing Manager',
      description: 'Marketing tools and campaign access',
      department: 'Marketing',
      role: 'Manager',
      icon: BarChart3,
      taskCount: 9,
      estimatedDuration: '4-5 days',
      lastModified: '2024-01-08',
      isActive: true,
      tasks: [
        {
          id: 'mkt-1',
          title: 'Marketing Automation Setup',
          description: 'Configure marketing automation tools and campaigns',
          assignedTeam: 'Marketing Team',
          priority: 'high',
          estimatedTime: '2 hours',
          isRequired: true,
          category: 'setup'
        }
      ]
    },
    {
      id: 'finance-executive',
      name: 'Finance Executive',
      description: 'Financial systems and GST compliance',
      department: 'Finance',
      role: 'Executive',
      icon: DollarSign,
      taskCount: 11,
      estimatedDuration: '5-6 days',
      lastModified: '2024-01-05',
      isActive: true,
      tasks: [
        {
          id: 'fin-1',
          title: 'ERP Financial Module Training',
          description: 'Learn ERP system for financial transactions and reporting',
          assignedTeam: 'Finance Manager',
          priority: 'high',
          estimatedTime: '4 hours',
          isRequired: true,
          category: 'training'
        },
        {
          id: 'fin-2',
          title: 'GST Compliance Training',
          description: 'Understanding GST rules and compliance requirements',
          assignedTeam: 'Tax Consultant',
          priority: 'high',
          estimatedTime: '2 hours',
          isRequired: true,
          category: 'compliance'
        }
      ]
    },
    {
      id: 'operations-team',
      name: 'Operations Team',
      description: 'Operations tools and process training',
      department: 'Operations',
      role: 'Operations',
      icon: Settings,
      taskCount: 7,
      estimatedDuration: '3-4 days',
      lastModified: '2024-01-03',
      isActive: true,
      tasks: [
        {
          id: 'ops-1',
          title: 'Process Documentation Review',
          description: 'Review and understand operational processes and procedures',
          assignedTeam: 'Operations Manager',
          priority: 'high',
          estimatedTime: '2 hours',
          isRequired: true,
          category: 'training'
        }
      ]
    }
  ];

  /**
   * Filter templates based on search and department
   */
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || template.department.toLowerCase() === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Get category color
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'verification': return 'bg-blue-100 text-blue-800';
      case 'setup': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onboarding Templates</h1>
          <p className="text-gray-600">Pre-configured templates for different roles and departments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="marketing">Marketing</option>
            <option value="finance">Finance</option>
            <option value="operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          
          return (
            <Card 
              key={template.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-500">{template.department}</p>
                    </div>
                  </div>
                  <Badge variant={template.isActive ? 'default' : 'secondary'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tasks:</span>
                    <span className="font-medium">{template.taskCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{template.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Modified:</span>
                    <span className="font-medium">{new Date(template.lastModified).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Template Details Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <selectedTemplate.icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                    <p className="text-gray-600">{selectedTemplate.department} • {selectedTemplate.role}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Template Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Tasks</p>
                    <p className="text-xl font-bold">{selectedTemplate.taskCount}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Estimated Duration</p>
                    <p className="text-xl font-bold">{selectedTemplate.estimatedDuration}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-xl font-bold">{selectedTemplate.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Template Tasks</h3>
                <div className="space-y-3">
                  {selectedTemplate.tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{task.title}</h4>
                            {task.isRequired && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              <strong>Team:</strong> {task.assignedTeam}
                            </span>
                            <span className="text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {task.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getCategoryColor(task.category)}>
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6 pt-6 border-t">
                <Button className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Duplicate Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
