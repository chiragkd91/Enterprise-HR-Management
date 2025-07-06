/**
 * Performance Management Component - Employee performance tracking and reviews
 * Comprehensive performance management with goals, reviews, and analytics
 */

import React, { useState } from 'react';
import { TrendingUp, Target, Star, Calendar, Users, Award, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  manager: string;
  overallRating: number;
  goals: number;
  completedGoals: number;
  lastReviewDate: string;
  nextReviewDate: string;
  performance: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement';
}

interface Goal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  startDate: string;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  kpis: string[];
}

interface Review {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  reviewType: 'annual' | 'quarterly' | 'monthly';
  overallRating: number;
  competencies: {
    technical: number;
    communication: number;
    leadership: number;
    teamwork: number;
    innovation: number;
  };
  status: 'pending' | 'in-progress' | 'completed';
  reviewDate: string;
  reviewer: string;
}

export default function PerformanceManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'reviews' | 'analytics'>('overview');

  /**
   * Mock employee performance data
   */
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Alice Cooper',
      department: 'Engineering',
      position: 'Senior Developer',
      manager: 'John Smith',
      overallRating: 4.5,
      goals: 5,
      completedGoals: 4,
      lastReviewDate: '2024-01-15',
      nextReviewDate: '2024-04-15',
      performance: 'excellent'
    },
    {
      id: 'EMP002',
      name: 'Bob Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      manager: 'Sarah Wilson',
      overallRating: 4.2,
      goals: 4,
      completedGoals: 3,
      lastReviewDate: '2024-01-10',
      nextReviewDate: '2024-04-10',
      performance: 'good'
    },
    {
      id: 'EMP003',
      name: 'Carol Davis',
      department: 'Sales',
      position: 'Sales Representative',
      manager: 'Mike Brown',
      overallRating: 3.8,
      goals: 6,
      completedGoals: 4,
      lastReviewDate: '2024-01-05',
      nextReviewDate: '2024-04-05',
      performance: 'satisfactory'
    },
    {
      id: 'EMP004',
      name: 'David Wilson',
      department: 'Engineering',
      position: 'Frontend Developer',
      manager: 'John Smith',
      overallRating: 3.5,
      goals: 4,
      completedGoals: 2,
      lastReviewDate: '2024-01-20',
      nextReviewDate: '2024-04-20',
      performance: 'needs-improvement'
    }
  ];

  /**
   * Mock goals data
   */
  const goals: Goal[] = [
    {
      id: 'GOAL001',
      employeeId: 'EMP001',
      employeeName: 'Alice Cooper',
      title: 'Complete React Migration Project',
      description: 'Migrate legacy components to React 18 with TypeScript',
      category: 'Technical',
      priority: 'high',
      progress: 85,
      startDate: '2024-01-01',
      dueDate: '2024-03-31',
      status: 'on-track',
      kpis: ['Code Quality', 'Timeline Adherence', 'Team Collaboration']
    },
    {
      id: 'GOAL002',
      employeeId: 'EMP002',
      employeeName: 'Bob Johnson',
      title: 'Increase Lead Generation by 30%',
      description: 'Implement new digital marketing strategies to boost qualified leads',
      category: 'Marketing',
      priority: 'high',
      progress: 65,
      startDate: '2024-01-15',
      dueDate: '2024-06-30',
      status: 'on-track',
      kpis: ['Lead Quality', 'Conversion Rate', 'ROI']
    },
    {
      id: 'GOAL003',
      employeeId: 'EMP003',
      employeeName: 'Carol Davis',
      title: 'Close 50 New Deals',
      description: 'Focus on enterprise clients and increase deal size',
      category: 'Sales',
      priority: 'high',
      progress: 40,
      startDate: '2024-01-01',
      dueDate: '2024-12-31',
      status: 'at-risk',
      kpis: ['Deal Volume', 'Deal Value', 'Customer Retention']
    },
    {
      id: 'GOAL004',
      employeeId: 'EMP004',
      employeeName: 'David Wilson',
      title: 'Improve Code Review Skills',
      description: 'Enhance technical review capabilities and mentor junior developers',
      category: 'Professional Development',
      priority: 'medium',
      progress: 25,
      startDate: '2024-02-01',
      dueDate: '2024-05-31',
      status: 'delayed',
      kpis: ['Review Quality', 'Mentoring Impact', 'Technical Growth']
    }
  ];

  /**
   * Mock reviews data
   */
  const reviews: Review[] = [
    {
      id: 'REV001',
      employeeId: 'EMP001',
      employeeName: 'Alice Cooper',
      reviewPeriod: 'Q1 2024',
      reviewType: 'quarterly',
      overallRating: 4.5,
      competencies: {
        technical: 5,
        communication: 4,
        leadership: 4,
        teamwork: 5,
        innovation: 4
      },
      status: 'completed',
      reviewDate: '2024-01-15',
      reviewer: 'John Smith'
    },
    {
      id: 'REV002',
      employeeId: 'EMP002',
      employeeName: 'Bob Johnson',
      reviewPeriod: 'Q1 2024',
      reviewType: 'quarterly',
      overallRating: 4.2,
      competencies: {
        technical: 4,
        communication: 5,
        leadership: 4,
        teamwork: 4,
        innovation: 4
      },
      status: 'in-progress',
      reviewDate: '2024-01-10',
      reviewer: 'Sarah Wilson'
    },
    {
      id: 'REV003',
      employeeId: 'EMP003',
      employeeName: 'Carol Davis',
      reviewPeriod: 'Q1 2024',
      reviewType: 'quarterly',
      overallRating: 3.8,
      competencies: {
        technical: 4,
        communication: 4,
        leadership: 3,
        teamwork: 4,
        innovation: 3
      },
      status: 'pending',
      reviewDate: '2024-01-05',
      reviewer: 'Mike Brown'
    }
  ];

  /**
   * Get performance color based on rating
   */
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'satisfactory': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'needs-improvement': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Render star rating
   */
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Track employee performance, goals, and reviews</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Award className="w-4 h-4 mr-2" />
            Start Review
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">4.0</span>
                  <div className="flex items-center">
                    {renderStars(4)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">19</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">15 on track</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due this quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Goal Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <Progress value={68} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Employee Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position} • {employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="flex items-center">
                          {renderStars(employee.overallRating)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.overallRating}/5</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{employee.completedGoals}/{employee.goals}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
                      </div>
                      <Badge className={getPerformanceColor(employee.performance)}>
                        {employee.performance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{goal.employeeName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{goal.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Start Date</p>
                        <p className="font-medium">{new Date(goal.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Due Date</p>
                        <p className="font-medium">{new Date(goal.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Key Performance Indicators</p>
                      <div className="flex flex-wrap gap-2">
                        {goal.kpis.map((kpi, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {kpi}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{review.employeeName}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.reviewPeriod} • {review.reviewType} review
                      </p>
                    </div>
                    <Badge className={
                      review.status === 'completed' ? 'bg-green-100 text-green-800' :
                      review.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {review.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Rating</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(review.overallRating)}
                        </div>
                        <span className="font-medium">{review.overallRating}/5</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {Object.entries(review.competencies).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-sm font-medium capitalize">{key}</p>
                          <div className="flex items-center justify-center mt-1">
                            {renderStars(value)}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{value}/5</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Reviewer</p>
                        <p className="font-medium">{review.reviewer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Review Date</p>
                        <p className="font-medium">{new Date(review.reviewDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Excellent (4.5+)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Good (4.0-4.4)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Satisfactory (3.5-3.9)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Needs Improvement (&lt;3.5)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>On Track</span>
                    </div>
                    <span className="font-medium">15 goals</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>At Risk</span>
                    </div>
                    <span className="font-medium">3 goals</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Delayed</span>
                    </div>
                    <span className="font-medium">1 goal</span>
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