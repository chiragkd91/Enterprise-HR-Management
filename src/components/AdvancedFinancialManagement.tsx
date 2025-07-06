/**
 * Advanced Financial Management Component - Comprehensive financial planning and control system
 * Handles budget planning, cost center management, financial controls, audit trails, and strategic planning
 */

import React, { useState } from 'react';
import { Calculator, TrendingUp, PieChart, Shield, FileText, AlertTriangle, CheckCircle, Target, Settings, Download, Plus, Edit, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Budget {
  id: string;
  department: string;
  category: string;
  period: string;
  plannedAmount: number;
  actualSpent: number;
  committed: number;
  remaining: number;
  variance: number;
  variancePercent: number;
  status: 'on_track' | 'over_budget' | 'under_budget' | 'at_risk';
}

interface CostCenter {
  id: string;
  name: string;
  manager: string;
  department: string;
  type: 'operational' | 'project' | 'administrative';
  budgetAllocated: number;
  actualCosts: number;
  forecastedCosts: number;
  costCategories: {
    category: string;
    allocated: number;
    spent: number;
  }[];
}

interface FinancialControl {
  id: string;
  name: string;
  type: 'approval_limit' | 'budget_threshold' | 'expense_policy' | 'procurement_rule';
  description: string;
  threshold: number;
  status: 'active' | 'inactive' | 'pending_review';
  lastModified: string;
  violations: number;
}

interface AuditTrail {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: string;
  timestamp: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  impact: 'low' | 'medium' | 'high';
}

interface StrategicPlan {
  id: string;
  name: string;
  period: string;
  objectives: {
    objective: string;
    targetValue: number;
    currentValue: number;
    progress: number;
    status: 'on_track' | 'behind' | 'ahead' | 'at_risk';
  }[];
  totalBudget: number;
  allocatedBudget: number;
  keyMetrics: {
    metric: string;
    target: number;
    current: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export default function AdvancedFinancialManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budgets' | 'cost_centers' | 'controls' | 'audit' | 'strategic'>('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  /**
   * Mock budget data
   */
  const budgets: Budget[] = [
    {
      id: 'BUD001',
      department: 'Engineering',
      category: 'Personnel',
      period: '2024',
      plannedAmount: 2400000,
      actualSpent: 1800000,
      committed: 200000,
      remaining: 400000,
      variance: -400000,
      variancePercent: -16.7,
      status: 'on_track'
    },
    {
      id: 'BUD002',
      department: 'Engineering',
      category: 'Infrastructure',
      period: '2024',
      plannedAmount: 480000,
      actualSpent: 420000,
      committed: 80000,
      remaining: -20000,
      variance: 20000,
      variancePercent: 4.2,
      status: 'over_budget'
    },
    {
      id: 'BUD003',
      department: 'Marketing',
      category: 'Advertising',
      period: '2024',
      plannedAmount: 600000,
      actualSpent: 380000,
      committed: 120000,
      remaining: 100000,
      variance: -100000,
      variancePercent: -16.7,
      status: 'under_budget'
    },
    {
      id: 'BUD004',
      department: 'Sales',
      category: 'Travel',
      period: '2024',
      plannedAmount: 240000,
      actualSpent: 220000,
      committed: 30000,
      remaining: -10000,
      variance: 10000,
      variancePercent: 4.2,
      status: 'at_risk'
    }
  ];

  /**
   * Mock cost centers
   */
  const costCenters: CostCenter[] = [
    {
      id: 'CC001',
      name: 'Product Development',
      manager: 'Sarah Johnson',
      department: 'Engineering',
      type: 'operational',
      budgetAllocated: 1800000,
      actualCosts: 1350000,
      forecastedCosts: 1750000,
      costCategories: [
        { category: 'Salaries', allocated: 1200000, spent: 900000 },
        { category: 'Tools & Software', allocated: 300000, spent: 250000 },
        { category: 'Training', allocated: 150000, spent: 100000 },
        { category: 'Equipment', allocated: 150000, spent: 100000 }
      ]
    },
    {
      id: 'CC002',
      name: 'Digital Marketing',
      manager: 'Michael Rodriguez',
      department: 'Marketing',
      type: 'operational',
      budgetAllocated: 720000,
      actualCosts: 480000,
      forecastedCosts: 650000,
      costCategories: [
        { category: 'Ad Spend', allocated: 400000, spent: 280000 },
        { category: 'Personnel', allocated: 240000, spent: 160000 },
        { category: 'Creative Services', allocated: 80000, spent: 40000 }
      ]
    },
    {
      id: 'CC003',
      name: 'Customer Success',
      manager: 'Emily Chen',
      department: 'Operations',
      type: 'operational',
      budgetAllocated: 480000,
      actualCosts: 360000,
      forecastedCosts: 470000,
      costCategories: [
        { category: 'Personnel', allocated: 320000, spent: 240000 },
        { category: 'Support Tools', allocated: 100000, spent: 80000 },
        { category: 'Training', allocated: 60000, spent: 40000 }
      ]
    }
  ];

  /**
   * Mock financial controls
   */
  const financialControls: FinancialControl[] = [
    {
      id: 'FC001',
      name: 'Manager Approval Limit',
      type: 'approval_limit',
      description: 'Expenses above $5,000 require manager approval',
      threshold: 5000,
      status: 'active',
      lastModified: '2024-01-15T10:30:00Z',
      violations: 3
    },
    {
      id: 'FC002',
      name: 'Budget Variance Alert',
      type: 'budget_threshold',
      description: 'Alert when department budget variance exceeds 10%',
      threshold: 10,
      status: 'active',
      lastModified: '2024-01-20T14:15:00Z',
      violations: 2
    },
    {
      id: 'FC003',
      name: 'Travel Expense Policy',
      type: 'expense_policy',
      description: 'Travel expenses must include business justification',
      threshold: 0,
      status: 'active',
      lastModified: '2024-01-10T09:45:00Z',
      violations: 1
    },
    {
      id: 'FC004',
      name: 'Procurement Approval',
      type: 'procurement_rule',
      description: 'Purchases above $10,000 require procurement approval',
      threshold: 10000,
      status: 'active',
      lastModified: '2024-01-25T16:20:00Z',
      violations: 0
    }
  ];

  /**
   * Mock audit trail
   */
  const auditTrail: AuditTrail[] = [
    {
      id: 'AUD001',
      action: 'Budget Modification',
      entity: 'Budget',
      entityId: 'BUD002',
      user: 'Finance Manager',
      timestamp: '2024-02-01T14:30:00Z',
      changes: [
        { field: 'plannedAmount', oldValue: '450000', newValue: '480000' }
      ],
      impact: 'medium'
    },
    {
      id: 'AUD002',
      action: 'Cost Center Creation',
      entity: 'Cost Center',
      entityId: 'CC003',
      user: 'Operations Director',
      timestamp: '2024-01-28T11:15:00Z',
      changes: [
        { field: 'budgetAllocated', oldValue: '0', newValue: '480000' }
      ],
      impact: 'high'
    },
    {
      id: 'AUD003',
      action: 'Control Policy Update',
      entity: 'Financial Control',
      entityId: 'FC001',
      user: 'CFO',
      timestamp: '2024-01-25T09:45:00Z',
      changes: [
        { field: 'threshold', oldValue: '3000', newValue: '5000' }
      ],
      impact: 'medium'
    }
  ];

  /**
   * Mock strategic plans
   */
  const strategicPlans: StrategicPlan[] = [
    {
      id: 'SP001',
      name: '2024 Growth Strategy',
      period: '2024',
      objectives: [
        {
          objective: 'Increase Revenue by 25%',
          targetValue: 25,
          currentValue: 18,
          progress: 72,
          status: 'on_track'
        },
        {
          objective: 'Reduce Operating Costs by 8%',
          targetValue: 8,
          currentValue: 5,
          progress: 62,
          status: 'behind'
        },
        {
          objective: 'Improve Profit Margin to 15%',
          targetValue: 15,
          currentValue: 12,
          progress: 80,
          status: 'on_track'
        }
      ],
      totalBudget: 5000000,
      allocatedBudget: 3750000,
      keyMetrics: [
        { metric: 'Cost per Employee', target: 85000, current: 88000, trend: 'down' },
        { metric: 'Revenue per Employee', target: 180000, current: 165000, trend: 'up' },
        { metric: 'Operating Efficiency', target: 92, current: 89, trend: 'up' }
      ]
    }
  ];

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'over_budget': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'under_budget': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'behind': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'ahead': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get impact color
   */
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Calculate summary statistics
   */
  const summaryStats = {
    totalBudget: budgets.reduce((sum, b) => sum + b.plannedAmount, 0),
    totalSpent: budgets.reduce((sum, b) => sum + b.actualSpent, 0),
    totalVariance: budgets.reduce((sum, b) => sum + b.variance, 0),
    budgetsOverThreshold: budgets.filter(b => Math.abs(b.variancePercent) > 10).length,
    activeCostCenters: costCenters.length,
    activeControls: financialControls.filter(c => c.status === 'active').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced Financial Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Strategic financial planning, budget control, and governance</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="budgets">Budget Planning</TabsTrigger>
            <TabsTrigger value="cost_centers">Cost Centers</TabsTrigger>
            <TabsTrigger value="controls">Financial Controls</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="strategic">Strategic Planning</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${(summaryStats.totalBudget / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${(summaryStats.totalSpent / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Variance</p>
                      <p className={`text-2xl font-bold ${summaryStats.totalVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {summaryStats.totalVariance < 0 ? '-' : '+'}${Math.abs(summaryStats.totalVariance / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Controls</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{summaryStats.activeControls}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.slice(0, 4).map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">{budget.department} - {budget.category}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${budget.actualSpent.toLocaleString()} / ${budget.plannedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress value={(budget.actualSpent / budget.plannedAmount) * 100} />
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${budget.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {budget.variance < 0 ? '' : '+'}${budget.variance.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {budget.variancePercent.toFixed(1)}%
                          </p>
                        </div>
                        <Badge className={getStatusColor(budget.status)}>
                          {budget.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Objectives Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategicPlans[0]?.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{objective.objective}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={objective.progress} className="w-32" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {objective.currentValue}% / {objective.targetValue}%
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(objective.status)}>
                        {objective.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Planning Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Budget Planning & Management</h2>
              <div className="flex items-center space-x-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Budget
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {budgets.map((budget) => (
                <Card key={budget.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{budget.department} - {budget.category}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Period: {budget.period}</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Planned</p>
                          <p className="font-bold">${budget.plannedAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Actual</p>
                          <p className="font-bold">${budget.actualSpent.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Committed</p>
                          <p className="font-bold">${budget.committed.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                          <p className={`font-bold ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${budget.remaining.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Variance</p>
                          <p className={`font-bold ${budget.variancePercent < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {budget.variancePercent.toFixed(1)}%
                          </p>
                        </div>
                        <Badge className={getStatusColor(budget.status)}>
                          {budget.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cost Centers Tab */}
          <TabsContent value="cost_centers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cost Center Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Cost Center
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {costCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {center.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manager: {center.manager} • {center.department}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span>{Math.round((center.actualCosts / center.budgetAllocated) * 100)}%</span>
                        </div>
                        <Progress value={(center.actualCosts / center.budgetAllocated) * 100} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Allocated</p>
                          <p className="font-medium">${center.budgetAllocated.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Actual</p>
                          <p className="font-medium">${center.actualCosts.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Forecasted</p>
                          <p className="font-medium">${center.forecastedCosts.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Variance</p>
                          <p className={`font-medium ${center.forecastedCosts > center.budgetAllocated ? 'text-red-600' : 'text-green-600'}`}>
                            {center.forecastedCosts > center.budgetAllocated ? '+' : ''}
                            ${(center.forecastedCosts - center.budgetAllocated).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Cost Categories</p>
                        <div className="space-y-1">
                          {center.costCategories.slice(0, 3).map((category, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>{category.category}</span>
                              <span>${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Financial Controls & Policies</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Control
              </Button>
            </div>

            <div className="space-y-4">
              {financialControls.map((control) => (
                <Card key={control.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{control.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{control.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm">
                            <strong>Type:</strong> {control.type.replace('_', ' ')}
                          </span>
                          {control.threshold > 0 && (
                            <span className="text-sm">
                              <strong>Threshold:</strong> ${control.threshold.toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm">
                            <strong>Last Modified:</strong> {new Date(control.lastModified).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Violations</p>
                          <p className={`font-bold ${control.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {control.violations}
                          </p>
                        </div>
                        <Badge className={getStatusColor(control.status)}>
                          {control.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Control Violations Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Control Violations Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{financialControls.reduce((sum, c) => sum + c.violations, 0)}</p>
                    <p className="text-sm text-red-600">Total Violations</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{financialControls.filter(c => c.status === 'active').length}</p>
                    <p className="text-sm text-green-600">Active Controls</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{Math.round((financialControls.filter(c => c.violations === 0).length / financialControls.length) * 100)}%</p>
                    <p className="text-sm text-blue-600">Compliance Rate</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{financialControls.filter(c => c.status === 'pending_review').length}</p>
                    <p className="text-sm text-yellow-600">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Financial Audit Trail</h2>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Audit Log
              </Button>
            </div>

            <div className="space-y-4">
              {auditTrail.map((audit) => (
                <Card key={audit.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{audit.action}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {audit.entity} ID: {audit.entityId} • User: {audit.user}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(audit.timestamp).toLocaleString()}
                        </p>
                        <div className="mt-3">
                          <p className="text-sm font-medium">Changes:</p>
                          {audit.changes.map((change, index) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              • <strong>{change.field}:</strong> {change.oldValue} → {change.newValue}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getImpactColor(audit.impact)}>
                          {audit.impact} impact
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Strategic Planning Tab */}
          <TabsContent value="strategic" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Strategic Financial Planning</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>

            {strategicPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <Badge variant="outline">{plan.period}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Total Budget: ${plan.totalBudget.toLocaleString()}</span>
                    <span>Allocated: ${plan.allocatedBudget.toLocaleString()}</span>
                    <span>Utilization: {Math.round((plan.allocatedBudget / plan.totalBudget) * 100)}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Objectives */}
                    <div>
                      <h4 className="font-medium mb-4">Strategic Objectives</h4>
                      <div className="space-y-4">
                        {plan.objectives.map((objective, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{objective.objective}</p>
                              <Badge className={getStatusColor(objective.status)}>
                                {objective.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={objective.progress} className="flex-1" />
                              <span className="text-sm font-medium">{objective.progress}%</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Current: {objective.currentValue}% / Target: {objective.targetValue}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div>
                      <h4 className="font-medium mb-4">Key Performance Metrics</h4>
                      <div className="space-y-4">
                        {plan.keyMetrics.map((metric, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{metric.metric}</p>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className={`w-4 h-4 ${
                                  metric.trend === 'up' ? 'text-green-600' : 
                                  metric.trend === 'down' ? 'text-red-600' : 
                                  'text-gray-600'
                                }`} />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{metric.trend}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm">Current: ${metric.current.toLocaleString()}</span>
                              <span className="text-sm">Target: ${metric.target.toLocaleString()}</span>
                            </div>
                            <Progress value={(metric.current / metric.target) * 100} className="mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
