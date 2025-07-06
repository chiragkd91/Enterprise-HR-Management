/**
 * IT Support System Component - Complete help desk and IT service management
 * Handles ticketing system, IT requests, knowledge base, issue tracking, and service catalog
 */

import React, { useState } from 'react';
import { Headphones, Ticket, BookOpen, Settings, Clock, CheckCircle, AlertTriangle, User, Search, Plus, Filter, MessageSquare, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'access' | 'email' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  requester: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolutionTime?: number; // in hours
}

interface ITService {
  id: string;
  name: string;
  category: 'hardware' | 'software' | 'network' | 'security' | 'training';
  description: string;
  sla: string; // Service Level Agreement
  cost?: number;
  requestForm: string[];
  availability: 'available' | 'limited' | 'unavailable';
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  views: number;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export default function ITSupportSystem() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tickets' | 'services' | 'knowledge'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  /**
   * Mock support tickets
   */
  const supportTickets: SupportTicket[] = [
    {
      id: 'TICK001',
      title: 'Laptop screen flickering issue',
      description: 'My laptop screen has been flickering intermittently for the past two days. It happens especially when opening heavy applications.',
      category: 'hardware',
      priority: 'medium',
      status: 'in-progress',
      requester: {
        id: 'EMP001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Engineering'
      },
      assignedTo: 'John Tech',
      createdAt: '2024-02-01T09:30:00Z',
      updatedAt: '2024-02-01T14:15:00Z'
    },
    {
      id: 'TICK002',
      title: 'Cannot access company email',
      description: 'Unable to log into Outlook. Getting authentication error message.',
      category: 'email',
      priority: 'high',
      status: 'open',
      requester: {
        id: 'EMP002',
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@company.com',
        department: 'Marketing'
      },
      createdAt: '2024-02-02T11:45:00Z',
      updatedAt: '2024-02-02T11:45:00Z'
    },
    {
      id: 'TICK003',
      title: 'Software installation request',
      description: 'Need Adobe Creative Suite installed for upcoming design projects.',
      category: 'software',
      priority: 'medium',
      status: 'waiting',
      requester: {
        id: 'EMP003',
        name: 'Emily Chen',
        email: 'emily.chen@company.com',
        department: 'Design'
      },
      assignedTo: 'Tech Support',
      createdAt: '2024-02-01T16:20:00Z',
      updatedAt: '2024-02-02T08:30:00Z'
    },
    {
      id: 'TICK004',
      title: 'Network connectivity issues',
      description: 'Internet connection is very slow in the conference room on 3rd floor.',
      category: 'network',
      priority: 'low',
      status: 'resolved',
      requester: {
        id: 'EMP004',
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        department: 'Finance'
      },
      assignedTo: 'Network Admin',
      createdAt: '2024-01-30T13:15:00Z',
      updatedAt: '2024-02-01T10:00:00Z',
      resolutionTime: 21
    }
  ];

  /**
   * IT Service Catalog
   */
  const itServices: ITService[] = [
    {
      id: 'SRV001',
      name: 'New Employee Setup',
      category: 'hardware',
      description: 'Complete IT setup for new employees including hardware, software, and account creation',
      sla: '2 business days',
      requestForm: ['Employee Details', 'Department', 'Role', 'Start Date', 'Equipment Type'],
      availability: 'available'
    },
    {
      id: 'SRV002',
      name: 'Software Installation',
      category: 'software',
      description: 'Installation and configuration of approved business software',
      sla: '1 business day',
      requestForm: ['Software Name', 'Business Justification', 'License Type'],
      availability: 'available'
    },
    {
      id: 'SRV003',
      name: 'Hardware Repair',
      category: 'hardware',
      description: 'Repair or replacement of company hardware',
      sla: '3 business days',
      requestForm: ['Device Type', 'Issue Description', 'Urgency Level'],
      availability: 'available'
    },
    {
      id: 'SRV004',
      name: 'Network Access',
      category: 'network',
      description: 'Setup network access and VPN configuration',
      sla: '4 hours',
      requestForm: ['Access Type', 'Business Need', 'Duration'],
      availability: 'available'
    },
    {
      id: 'SRV005',
      name: 'Security Training',
      category: 'training',
      description: 'Cybersecurity awareness training and certification',
      sla: '1 week',
      requestForm: ['Training Type', 'Department', 'Number of Participants'],
      availability: 'limited'
    }
  ];

  /**
   * Knowledge Base Articles
   */
  const knowledgeArticles: KnowledgeArticle[] = [
    {
      id: 'KB001',
      title: 'How to Reset Your Password',
      category: 'Account Management',
      content: 'Step-by-step guide to reset your company account password...',
      tags: ['password', 'reset', 'security', 'account'],
      views: 1245,
      helpful: 189,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      author: 'IT Support Team'
    },
    {
      id: 'KB002',
      title: 'VPN Setup and Configuration',
      category: 'Network',
      content: 'Complete guide to setting up VPN access for remote work...',
      tags: ['vpn', 'remote', 'network', 'security'],
      views: 892,
      helpful: 156,
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-25T11:45:00Z',
      author: 'Network Team'
    },
    {
      id: 'KB003',
      title: 'Email Configuration on Mobile Devices',
      category: 'Email',
      content: 'Instructions for setting up company email on iOS and Android devices...',
      tags: ['email', 'mobile', 'ios', 'android', 'outlook'],
      views: 756,
      helpful: 142,
      createdAt: '2024-01-12T15:20:00Z',
      updatedAt: '2024-01-22T09:10:00Z',
      author: 'Mobile Support'
    },
    {
      id: 'KB004',
      title: 'Software Installation Guidelines',
      category: 'Software',
      content: 'Approved software list and installation procedures...',
      tags: ['software', 'installation', 'approved', 'guidelines'],
      views: 623,
      helpful: 98,
      createdAt: '2024-01-08T13:30:00Z',
      updatedAt: '2024-01-28T16:20:00Z',
      author: 'Software Team'
    }
  ];

  /**
   * Get priority color and icon
   */
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical': return { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertTriangle };
      case 'high': return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertTriangle };
      case 'medium': return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock };
      case 'low': return { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle };
      default: return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: Clock };
    }
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'waiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get category theme
   */
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'hardware': return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'software': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' };
      case 'network': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' };
      case 'security': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900' };
      case 'email': return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' };
      case 'training': return { color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' };
    }
  };

  /**
   * Calculate support statistics
   */
  const supportStats = {
    totalTickets: supportTickets.length,
    openTickets: supportTickets.filter(t => t.status === 'open').length,
    inProgressTickets: supportTickets.filter(t => t.status === 'in-progress').length,
    resolvedTickets: supportTickets.filter(t => t.status === 'resolved').length,
    avgResolutionTime: supportTickets.filter(t => t.resolutionTime).reduce((sum, t) => sum + (t.resolutionTime || 0), 0) / supportTickets.filter(t => t.resolutionTime).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IT Support System</h1>
          <p className="text-gray-600 dark:text-gray-400">Help desk, IT services, and knowledge management</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="services">Service Catalog</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{supportStats.totalTickets}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{supportStats.openTickets}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{supportStats.inProgressTickets}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Resolution</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{supportStats.avgResolutionTime.toFixed(1)}h</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                    <span>Create Ticket</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-2">
                    <Headphones className="w-6 h-6" />
                    <span>Live Chat</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-2">
                    <BookOpen className="w-6 h-6" />
                    <span>Browse KB</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col space-y-2">
                    <Wrench className="w-6 h-6" />
                    <span>Request Service</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Support Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.requester.name} • {ticket.category} • {ticket.status}
                        </p>
                      </div>
                      <Badge className={getPriorityConfig(ticket.priority).color}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Support Tickets</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => {
                const priorityConfig = getPriorityConfig(ticket.priority);
                const categoryTheme = getCategoryTheme(ticket.category);
                
                return (
                  <Card key={ticket.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {ticket.requester.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-lg">{ticket.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {ticket.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-3">
                              <span className="text-sm">
                                <strong>Requester:</strong> {ticket.requester.name}
                              </span>
                              <span className="text-sm">
                                <strong>Department:</strong> {ticket.requester.department}
                              </span>
                              {ticket.assignedTo && (
                                <span className="text-sm">
                                  <strong>Assigned to:</strong> {ticket.assignedTo}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${categoryTheme.bg} ${categoryTheme.color}`}>
                            {ticket.category}
                          </div>
                          <Badge className={priorityConfig.color}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Service Catalog Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">IT Service Catalog</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itServices.map((service) => {
                const categoryTheme = getCategoryTheme(service.category);
                return (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryTheme.bg}`}>
                          <Settings className={`w-5 h-5 ${categoryTheme.color}`} />
                        </div>
                        <Badge 
                          className={service.availability === 'available' ? 'bg-green-100 text-green-800' : 
                                   service.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                                   'bg-red-100 text-red-800'}
                        >
                          {service.availability}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>SLA:</span>
                          <span className="font-medium">{service.sla}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Category:</span>
                          <span className="font-medium capitalize">{service.category}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Required Information:</p>
                          {service.requestForm.slice(0, 3).map((field, idx) => (
                            <p key={idx} className="text-xs text-gray-500 dark:text-gray-400">• {field}</p>
                          ))}
                        </div>
                        <Button className="w-full" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Request Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Knowledge Base</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {knowledgeArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <Badge variant="outline" className="mt-2">{article.category}</Badge>
                      </div>
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {article.content}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{article.views} views</span>
                        <span>{article.helpful} helpful</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>By {article.author}</span>
                        <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Read Article
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
