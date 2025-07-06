/**
 * Financial Reporting Component - Comprehensive financial analytics and reporting
 * Handles cost analysis, budget reports, forecasting, and compensation analysis
 */

import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface FinancialMetric {
  category: string;
  currentPeriod: number;
  previousPeriod: number;
  budget: number;
  variance: number;
  percentChange: number;
}

interface DepartmentCost {
  department: string;
  salaries: number;
  benefits: number;
  expenses: number;
  total: number;
  budgetVariance: number;
  headcount: number;
}

export default function FinancialReporting() {
  const [activeTab, setActiveTab] = useState<'overview' | 'costs' | 'forecasting' | 'compensation'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-q1');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  /**
   * Financial metrics data
   */
  const financialMetrics: FinancialMetric[] = [
    {
      category: 'Total Payroll',
      currentPeriod: 2450000,
      previousPeriod: 2280000,
      budget: 2500000,
      variance: -50000,
      percentChange: 7.5
    },
    {
      category: 'Benefits Cost',
      currentPeriod: 612500,
      previousPeriod: 570000,
      budget: 625000,
      variance: -12500,
      percentChange: 7.5
    },
    {
      category: 'Operating Expenses',
      currentPeriod: 185000,
      previousPeriod: 165000,
      budget: 200000,
      variance: -15000,
      percentChange: 12.1
    },
    {
      category: 'Training & Development',
      currentPeriod: 75000,
      previousPeriod: 65000,
      budget: 80000,
      variance: -5000,
      percentChange: 15.4
    }
  ];

  /**
   * Department cost breakdown
   */
  const departmentCosts: DepartmentCost[] = [
    {
      department: 'Engineering',
      salaries: 1200000,
      benefits: 300000,
      expenses: 85000,
      total: 1585000,
      budgetVariance: -25000,
      headcount: 95
    },
    {
      department: 'Sales',
      salaries: 850000,
      benefits: 212500,
      expenses: 45000,
      total: 1107500,
      budgetVariance: +15000,
      headcount: 68
    },
    {
      department: 'Marketing',
      salaries: 550000,
      benefits: 137500,
      expenses: 35000,
      total: 722500,
      budgetVariance: -8000,
      headcount: 42
    },
    {
      department: 'Operations',
      salaries: 420000,
      benefits: 105000,
      expenses: 28000,
      total: 553000,
      budgetVariance: +12000,
      headcount: 35
    },
    {
      department: 'Finance',
      salaries: 380000,
      benefits: 95000,
      expenses: 22000,
      total: 497000,
      budgetVariance: +5000,
      headcount: 28
    },
    {
      department: 'HR',
      salaries: 320000,
      benefits: 80000,
      expenses: 18000,
      total: 418000,
      budgetVariance: -3000,
      headcount: 22
    }
  ];

  /**
   * Calculate cost per employee
   */
  const calculateCostPerEmployee = (dept: DepartmentCost) => {
    return dept.total / dept.headcount;
  };

  /**
   * Generate financial report
   */
  const generateReport = (format: 'pdf' | 'excel') => {
    const reportData = {
      period: selectedPeriod,
      department: selectedDepartment,
      metrics: financialMetrics,
      departmentCosts,
      generatedAt: new Date().toISOString()
    };

    if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Financial Report - ${selectedPeriod}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .section { margin: 20px 0; }
                .metric { margin: 10px 0; padding: 10px; border: 1px solid #ccc; display: flex; justify-content: space-between; }
                .department { margin: 10px 0; padding: 15px; border: 1px solid #ccc; }
                .total { font-weight: bold; background-color: #f5f5f5; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Global Cyber IT - Financial Report</h1>
                <p>Period: ${selectedPeriod} | Generated: ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="section">
                <h2>Financial Metrics</h2>
                ${financialMetrics.map(metric => `
                  <div class="metric">
                    <span>${metric.category}</span>
                    <span>$${metric.currentPeriod.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
              <div class="section">
                <h2>Department Costs</h2>
                ${departmentCosts.map(dept => `
                  <div class="department">
                    <h3>${dept.department}</h3>
                    <p>Total Cost: $${dept.total.toLocaleString()}</p>
                    <p>Headcount: ${dept.headcount}</p>
                    <p>Cost per Employee: $${calculateCostPerEmployee(dept).toLocaleString()}</p>
                  </div>
                `).join('')}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
      }
    } else {
      // Excel export simulation
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Department,Salaries,Benefits,Expenses,Total,Headcount,Cost per Employee\\n" +
        departmentCosts.map(dept => 
          `${dept.department},${dept.salaries},${dept.benefits},${dept.expenses},${dept.total},${dept.headcount},${calculateCostPerEmployee(dept).toFixed(2)}`
        ).join("\\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `financial_report_${selectedPeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * Get variance color
   */
  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  /**
   * Calculate total metrics
   */
  const totalMetrics = {
    totalCost: departmentCosts.reduce((sum, dept) => sum + dept.total, 0),
    totalHeadcount: departmentCosts.reduce((sum, dept) => sum + dept.headcount, 0),
    averageCostPerEmployee: departmentCosts.reduce((sum, dept) => sum + dept.total, 0) / departmentCosts.reduce((sum, dept) => sum + dept.headcount, 0),
    totalBudgetVariance: departmentCosts.reduce((sum, dept) => sum + dept.budgetVariance, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Reporting</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive financial analytics and reporting</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => generateReport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={() => generateReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-q1">Q1 2024</SelectItem>
                  <SelectItem value="2023-q4">Q4 2023</SelectItem>
                  <SelectItem value="2023-q3">Q3 2023</SelectItem>
                  <SelectItem value="2023-q2">Q2 2023</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalMetrics.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Headcount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMetrics.totalHeadcount}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost per Employee</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalMetrics.averageCostPerEmployee.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Variance</p>
                      <p className={`text-2xl font-bold ${getVarianceColor(totalMetrics.totalBudgetVariance)}`}>
                        {totalMetrics.totalBudgetVariance > 0 ? '+' : ''}${totalMetrics.totalBudgetVariance.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">{metric.category}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Budget: ${metric.budget.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${metric.currentPeriod.toLocaleString()}</p>
                        <p className={`text-sm ${metric.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.percentChange >= 0 ? '+' : ''}{metric.percentChange}% vs last period
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${getVarianceColor(metric.variance)}`}>
                          {metric.variance > 0 ? '+' : ''}${metric.variance.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">vs budget</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Analysis Tab */}
          <TabsContent value="costs" className="space-y-6">
            <h2 className="text-xl font-semibold">Department Cost Analysis</h2>

            <div className="space-y-4">
              {departmentCosts.map((dept, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{dept.department}</CardTitle>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{dept.headcount} employees</Badge>
                        <Badge className={dept.budgetVariance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {dept.budgetVariance >= 0 ? '+' : ''}${dept.budgetVariance.toLocaleString()} vs budget
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">${dept.salaries.toLocaleString()}</p>
                        <p className="text-sm text-blue-600">Salaries</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">${dept.benefits.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Benefits</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">${dept.expenses.toLocaleString()}</p>
                        <p className="text-sm text-orange-600">Expenses</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">${calculateCostPerEmployee(dept).toLocaleString()}</p>
                        <p className="text-sm text-purple-600">Cost per Employee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cost Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Salaries ({((departmentCosts.reduce((sum, d) => sum + d.salaries, 0) / totalMetrics.totalCost) * 100).toFixed(1)}%)</span>
                    <span className="font-medium">${departmentCosts.reduce((sum, d) => sum + d.salaries, 0).toLocaleString()}</span>
                  </div>
                  <Progress value={(departmentCosts.reduce((sum, d) => sum + d.salaries, 0) / totalMetrics.totalCost) * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span>Benefits ({((departmentCosts.reduce((sum, d) => sum + d.benefits, 0) / totalMetrics.totalCost) * 100).toFixed(1)}%)</span>
                    <span className="font-medium">${departmentCosts.reduce((sum, d) => sum + d.benefits, 0).toLocaleString()}</span>
                  </div>
                  <Progress value={(departmentCosts.reduce((sum, d) => sum + d.benefits, 0) / totalMetrics.totalCost) * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span>Expenses ({((departmentCosts.reduce((sum, d) => sum + d.expenses, 0) / totalMetrics.totalCost) * 100).toFixed(1)}%)</span>
                    <span className="font-medium">${departmentCosts.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}</span>
                  </div>
                  <Progress value={(departmentCosts.reduce((sum, d) => sum + d.expenses, 0) / totalMetrics.totalCost) * 100} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <h2 className="text-xl font-semibold">Financial Forecasting</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Next Quarter Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Projected Total Cost</span>
                      <span className="font-bold">${(totalMetrics.totalCost * 1.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Expected Growth</span>
                      <span className="font-medium text-green-600">+5.0%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Headcount Growth</span>
                      <span className="font-medium">+12 employees</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Budget Variance</span>
                      <span className="font-medium text-green-600">Within 3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Annual Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Projected Annual Cost</span>
                      <span className="font-bold">${(totalMetrics.totalCost * 4.2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cost Inflation</span>
                      <span className="font-medium text-orange-600">+3.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Headcount Target</span>
                      <span className="font-medium">{totalMetrics.totalHeadcount + 48} employees</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cost per Employee</span>
                      <span className="font-medium">${(totalMetrics.averageCostPerEmployee * 1.035).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: 'Q1 2024', cost: totalMetrics.totalCost, change: 7.5 },
                    { period: 'Q4 2023', cost: totalMetrics.totalCost * 0.93, change: 5.2 },
                    { period: 'Q3 2023', cost: totalMetrics.totalCost * 0.88, change: 4.1 },
                    { period: 'Q2 2023', cost: totalMetrics.totalCost * 0.85, change: 3.8 }
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{trend.period}</span>
                      <span>${trend.cost.toLocaleString()}</span>
                      <span className={`font-medium ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.change >= 0 ? '+' : ''}{trend.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compensation Tab */}
          <TabsContent value="compensation" className="space-y-6">
            <h2 className="text-xl font-semibold">Compensation Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentCosts.map((dept, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dept.department}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Avg. Salary:</span>
                        <span className="font-medium">${(dept.salaries / dept.headcount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Benefits:</span>
                        <span className="font-medium">${(dept.benefits / dept.headcount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Compensation:</span>
                        <span className="font-medium">${((dept.salaries + dept.benefits) / dept.headcount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Position:</span>
                        <span className="font-medium text-green-600">75th percentile</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compensation Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Compensation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      ${(departmentCosts.reduce((sum, d) => sum + d.salaries, 0) / totalMetrics.totalHeadcount).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">Average Salary</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      ${(departmentCosts.reduce((sum, d) => sum + d.benefits, 0) / totalMetrics.totalHeadcount).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">Average Benefits</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      ${(departmentCosts.reduce((sum, d) => sum + d.salaries + d.benefits, 0) / totalMetrics.totalHeadcount).toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-600">Total Compensation</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">7.5%</p>
                    <p className="text-sm text-orange-600">Annual Growth</p>
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
