/**
 * Recognition System Component - One-click badge awarding system
 * Enables peer-to-peer recognition with gamified badge system
 */

import React, { useState } from 'react';
import { Award, Star, Crown, Trophy, Heart, Zap, Users, Target, Sparkles, ThumbsUp, Gift, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BadgeType {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'excellence' | 'teamwork' | 'values' | 'quick-wins';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  requiresApproval: boolean;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  avatar?: string;
}

interface Award {
  id: string;
  badge: BadgeType;
  recipient: Employee;
  giver: Employee;
  message: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function RecognitionSystem() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'award' | 'badges' | 'leaderboard' | 'my-badges'>('award');

  /**
   * Badge categories and types configuration
   */
  const badges: BadgeType[] = [
    // Excellence Category (Gold theme)
    {
      id: 'top-performer',
      name: 'Top Performer',
      description: 'Exceptional monthly performance',
      points: 50,
      category: 'excellence',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      requiresApproval: true
    },
    {
      id: 'quality-champion',
      name: 'Quality Champion',
      description: 'Consistently high-quality work',
      points: 30,
      category: 'excellence',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      requiresApproval: true
    },
    {
      id: 'innovation-leader',
      name: 'Innovation Leader',
      description: 'Creative problem solving',
      points: 40,
      category: 'excellence',
      icon: Sparkles,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      requiresApproval: true
    },
    // Teamwork Category (Blue theme)
    {
      id: 'team-player',
      name: 'Team Player',
      description: 'Excellent collaboration',
      points: 20,
      category: 'teamwork',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      requiresApproval: false
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Helps others grow',
      points: 25,
      category: 'teamwork',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      requiresApproval: false
    },
    {
      id: 'problem-solver',
      name: 'Problem Solver',
      description: 'Overcomes team challenges',
      points: 30,
      category: 'teamwork',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      requiresApproval: true
    },
    // Values Category (Red theme)
    {
      id: 'customer-hero',
      name: 'Customer Hero',
      description: 'Above and beyond for customers',
      points: 35,
      category: 'values',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      requiresApproval: true
    },
    {
      id: 'reliability-star',
      name: 'Reliability Star',
      description: 'Dependable and trustworthy',
      points: 25,
      category: 'values',
      icon: Medal,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      requiresApproval: false
    },
    {
      id: 'positive-impact',
      name: 'Positive Impact',
      description: 'Makes workplace better',
      points: 20,
      category: 'values',
      icon: ThumbsUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      requiresApproval: false
    },
    // Quick Wins Category (Orange theme)
    {
      id: 'great-job',
      name: 'Great Job!',
      description: 'Quick recognition for good work',
      points: 5,
      category: 'quick-wins',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      requiresApproval: false
    },
    {
      id: 'thank-you',
      name: 'Thank You',
      description: 'Appreciation for help',
      points: 5,
      category: 'quick-wins',
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      requiresApproval: false
    },
    {
      id: 'well-done',
      name: 'Well Done',
      description: 'Task completion recognition',
      points: 5,
      category: 'quick-wins',
      icon: ThumbsUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      requiresApproval: false
    }
  ];

  /**
   * Mock employee data
   */
  const employees: Employee[] = [
    { id: '1', name: 'Sarah Johnson', department: 'Engineering' },
    { id: '2', name: 'Michael Rodriguez', department: 'Marketing' },
    { id: '3', name: 'Emily Chen', department: 'HR' },
    { id: '4', name: 'James Wilson', department: 'Finance' },
    { id: '5', name: 'Lisa Wang', department: 'Sales' },
    { id: '6', name: 'David Chen', department: 'Operations' }
  ];

  /**
   * Mock leaderboard data
   */
  const leaderboard = [
    { employee: employees[0], points: 245, badges: 12 },
    { employee: employees[1], points: 220, badges: 11 },
    { employee: employees[2], points: 190, badges: 9 },
    { employee: employees[3], points: 175, badges: 8 },
    { employee: employees[4], points: 160, badges: 7 },
    { employee: employees[5], points: 145, badges: 6 }
  ];

  /**
   * Get category color theme
   */
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'excellence': return 'border-yellow-200 dark:border-yellow-800';
      case 'teamwork': return 'border-blue-200 dark:border-blue-800';
      case 'values': return 'border-red-200 dark:border-red-800';
      case 'quick-wins': return 'border-orange-200 dark:border-orange-800';
      default: return 'border-gray-200 dark:border-gray-800';
    }
  };

  /**
   * Handle quick award (one-click recognition)
   */
  const handleQuickAward = (employeeId: string, badgeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    const badge = badges.find(b => b.id === badgeId);
    
    if (employee && badge) {
      // In production, this would make an API call
      console.log(`Awarding ${badge.name} to ${employee.name}`);
      // Show success toast/notification
    }
  };

  /**
   * Handle full award submission
   */
  const handleSubmitAward = () => {
    if (!selectedEmployee || !selectedBadge) return;
    
    const employee = employees.find(e => e.id === selectedEmployee);
    const badge = badges.find(b => b.id === selectedBadge);
    
    if (employee && badge) {
      // In production, this would make an API call
      console.log(`Awarding ${badge.name} to ${employee.name} with message: ${message}`);
      
      // Reset form
      setSelectedEmployee('');
      setSelectedBadge('');
      setMessage('');
    }
  };

  /**
   * Get initials for avatar
   */
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recognition System</h1>
          <p className="text-gray-600 dark:text-gray-400">Build culture through peer-to-peer recognition and achievements</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'award', label: 'Give Award', icon: Award },
            { key: 'badges', label: 'Browse Badges', icon: Star },
            { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { key: 'my-badges', label: 'My Badges', icon: Medal }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Give Award Tab */}
        {activeTab === 'award' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Award Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Give Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Employee Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Employee</label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an employee to recognize" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Badge Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Badge</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <div
                          key={badge.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedBadge === badge.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedBadge(badge.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${badge.bgColor}`}>
                              <badge.icon className={`w-5 h-5 ${badge.color}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{badge.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary">{badge.points} pts</Badge>
                                {badge.requiresApproval && (
                                  <Badge variant="outline" className="text-xs">Requires Approval</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <Textarea
                      placeholder="Add a personal message to make the recognition more meaningful..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitAward}
                    disabled={!selectedEmployee || !selectedBadge}
                    className="w-full"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Give Recognition
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Awards */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Fast recognition for common achievements
                  </p>
                  <div className="space-y-3">
                    {badges.filter(b => b.category === 'quick-wins').map(badge => (
                      <div key={badge.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${badge.bgColor}`}>
                            <badge.icon className={`w-4 h-4 ${badge.color}`} />
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{badge.name}</h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{badge.points} pts</p>
                          </div>
                        </div>
                        <Select onValueChange={(employeeId) => handleQuickAward(employeeId, badge.id)}>
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Give" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map(employee => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name.split(' ')[0]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Browse Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            {['excellence', 'teamwork', 'values', 'quick-wins'].map(category => (
              <div key={category}>
                <h3 className="text-xl font-semibold mb-4 capitalize">{category.replace('-', ' ')} Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.filter(b => b.category === category).map(badge => (
                    <Card key={badge.id} className={`border-2 ${getCategoryTheme(category)}`}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${badge.bgColor}`}>
                          <badge.icon className={`w-8 h-8 ${badge.color}`} />
                        </div>
                        <h4 className="font-semibold text-lg mb-2">{badge.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{badge.description}</p>
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant="secondary">{badge.points} points</Badge>
                          {badge.requiresApproval && (
                            <Badge variant="outline" className="text-xs">Approval Required</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Recognition Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div key={entry.employee.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.employee.avatar} />
                        <AvatarFallback>{getInitials(entry.employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{entry.employee.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{entry.employee.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{entry.points} points</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{entry.badges} badges</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Badges Tab */}
        {activeTab === 'my-badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.slice(0, 6).map(badge => (
              <Card key={badge.id}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${badge.bgColor}`}>
                    <badge.icon className={`w-8 h-8 ${badge.color}`} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{badge.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{badge.description}</p>
                  <Badge variant="secondary">{badge.points} points</Badge>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Earned 2 days ago</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
