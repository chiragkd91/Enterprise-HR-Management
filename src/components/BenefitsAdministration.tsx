/**
 * Benefits Administration Component - Employee benefits management
 * Comprehensive benefits administration with health insurance, provident fund, and employee perks
 */

import React, { useState } from 'react';
import { Shield, Heart, DollarSign, Gift, Users, FileText, TrendingUp, Calendar } from 'lucide-react';
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
  joinDate: string;
  healthInsurance: {
    plan: string;
    premium: number;
    coverage: number;
    dependents: number;
  };
  providentFund: {
    employeeContribution: number;
    employerContribution: number;
    totalBalance: number;
  };
  benefits: string[];
  totalBenefitsValue: number;
}

interface BenefitsPlan {
  id: string;
  name: string;
  type: 'health' | 'retirement' | 'wellness' | 'lifestyle';
  description: string;
  monthlyPremium: number;
  coverage: number;
  eligibleEmployees: number;
  enrolledEmployees: number;
  features: string[];
  isActive: boolean;
}

interface Claim {
  id: string;
  employeeId: string;
  employeeName: string;
  benefitType: string;
  claimAmount: number;
  claimDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  description: string;
  attachments: number;
}

export default function BenefitsAdministration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'claims' | 'enrollment'>('overview');

  /**
   * Mock employees data
   */
  const employees: Employee[] = [
    {
      id: 'EMP001',
      name: 'Alice Cooper',
      department: 'Engineering',
      position: 'Senior Developer',
      joinDate: '2022-01-15',
      healthInsurance: {
        plan: 'Premium Health Care',
        premium: 3500,
        coverage: 500000,
        dependents: 2
      },
      providentFund: {
        employeeContribution: 2160,
        employerContribution: 2160,
        totalBalance: 89000
      },
      benefits: ['Health Insurance', 'PF', 'Meal Vouchers', 'Transport Allowance', 'Wellness Program'],
      totalBenefitsValue: 8500
    },
    {
      id: 'EMP002',
      name: 'Bob Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      joinDate: '2021-03-10',
      healthInsurance: {
        plan: 'Family Health Plus',
        premium: 4200,
        coverage: 750000,
        dependents: 3
      },
      providentFund: {
        employeeContribution: 2400,
        employerContribution: 2400,
        totalBalance: 125000
      },
      benefits: ['Health Insurance', 'PF', 'Meal Vouchers', 'Transport Allowance', 'Gym Membership'],
      totalBenefitsValue: 9200
    },
    {
      id: 'EMP003',
      name: 'Carol Davis',
      department: 'Sales',
      position: 'Sales Representative',
      joinDate: '2023-06-20',
      healthInsurance: {
        plan: 'Basic Health Care',
        premium: 2800,
        coverage: 300000,
        dependents: 1
      },
      providentFund: {
        employeeContribution: 1800,
        employerContribution: 1800,
        totalBalance: 35000
      },
      benefits: ['Health Insurance', 'PF', 'Meal Vouchers', 'Performance Bonus'],
      totalBenefitsValue: 6800
    }
  ];

  /**
   * Mock benefits plans
   */
  const benefitsPlans: BenefitsPlan[] = [
    {
      id: 'PLAN001',
      name: 'Premium Health Care',
      type: 'health',
      description: 'Comprehensive health insurance with extensive coverage',
      monthlyPremium: 3500,
      coverage: 500000,
      eligibleEmployees: 50,
      enrolledEmployees: 15,
      features: ['In-patient coverage', 'Out-patient coverage', 'Dental care', 'Vision care', 'Maternity benefits'],
      isActive: true
    },
    {
      id: 'PLAN002',
      name: 'Family Health Plus',
      type: 'health',
      description: 'Family health insurance with dependent coverage',
      monthlyPremium: 4200,
      coverage: 750000,
      eligibleEmployees: 30,
      enrolledEmployees: 12,
      features: ['Family coverage', 'Preventive care', 'Emergency care', 'Prescription drugs', 'Mental health'],
      isActive: true
    },
    {
      id: 'PLAN003',
      name: 'Provident Fund',
      type: 'retirement',
      description: 'Employee Provident Fund with 12% contribution',
      monthlyPremium: 0,
      coverage: 0,
      eligibleEmployees: 100,
      enrolledEmployees: 85,
      features: ['12% employee contribution', '12% employer contribution', 'Tax benefits', 'Withdrawal facility'],
      isActive: true
    },
    {
      id: 'PLAN004',
      name: 'Wellness Program',
      type: 'wellness',
      description: 'Comprehensive wellness and fitness program',
      monthlyPremium: 500,
      coverage: 0,
      eligibleEmployees: 100,
      enrolledEmployees: 45,
      features: ['Gym membership', 'Health checkups', 'Nutrition counseling', 'Stress management', 'Fitness tracking'],
      isActive: true
    },
    {
      id: 'PLAN005',
      name: 'Lifestyle Benefits',
      type: 'lifestyle',
      description: 'Employee lifestyle and convenience benefits',
      monthlyPremium: 1200,
      coverage: 0,
      eligibleEmployees: 100,
      enrolledEmployees: 60,
      features: ['Meal vouchers', 'Transport allowance', 'Mobile reimbursement', 'Internet allowance', 'Book allowance'],
      isActive: true
    }
  ];

  /**
   * Mock claims data
   */
  const claims: Claim[] = [
    {
      id: 'CLM001',
      employeeId: 'EMP001',
      employeeName: 'Alice Cooper',
      benefitType: 'Health Insurance',
      claimAmount: 25000,
      claimDate: '2024-01-10',
      status: 'approved',
      description: 'Hospitalization for surgery',
      attachments: 3
    },
    {
      id: 'CLM002',
      employeeId: 'EMP002',
      employeeName: 'Bob Johnson',
      benefitType: 'Wellness Program',
      claimAmount: 5000,
      claimDate: '2024-01-12',
      status: 'processing',
      description: 'Annual health checkup',
      attachments: 2
    },
    {
      id: 'CLM003',
      employeeId: 'EMP003',
      employeeName: 'Carol Davis',
      benefitType: 'Health Insurance',
      claimAmount: 8000,
      claimDate: '2024-01-15',
      status: 'pending',
      description: 'Dental treatment',
      attachments: 1
    },
    {
      id: 'CLM004',
      employeeId: 'EMP001',
      employeeName: 'Alice Cooper',
      benefitType: 'Lifestyle Benefits',
      claimAmount: 3000,
      claimDate: '2024-01-08',
      status: 'rejected',
      description: 'Mobile phone purchase',
      attachments: 1
    }
  ];

  /**
   * Get plan type color
   */
  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'retirement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'wellness': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'lifestyle': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get claim status color
   */
  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Benefits Administration</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage employee benefits, claims, and enrollment</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Gift className="w-4 h-4 mr-2" />
            Add New Plan
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Benefits Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Benefits Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(2450000)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">5</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">217</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">out of 250</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">12</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          {/* Employee Benefits Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Employee Benefits Overview
              </CardTitle>
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
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{employee.healthInsurance.plan}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Coverage: {formatCurrency(employee.healthInsurance.coverage)}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">PF Balance</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(employee.providentFund.totalBalance)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Benefits</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.benefits.length} active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Monthly Value</p>
                        <p className="text-sm text-green-600">{formatCurrency(employee.totalBenefitsValue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {benefitsPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPlanTypeColor(plan.type)}>
                        {plan.type}
                      </Badge>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Monthly Premium</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {plan.monthlyPremium > 0 ? formatCurrency(plan.monthlyPremium) : 'Free'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Coverage</p>
                        <p className="text-lg font-semibold text-green-600">
                          {plan.coverage > 0 ? formatCurrency(plan.coverage) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Enrollment</span>
                        <span className="text-sm">
                          {plan.enrolledEmployees} / {plan.eligibleEmployees}
                        </span>
                      </div>
                      <Progress value={(plan.enrolledEmployees / plan.eligibleEmployees) * 100} />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
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

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Benefits Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{claim.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{claim.employeeName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Benefit Type</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.benefitType}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Claim Amount</p>
                        <p className="text-sm font-semibold text-blue-600">{formatCurrency(claim.claimAmount)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Claim Date</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(claim.claimDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Attachments</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.attachments} files</p>
                      </div>
                      <Badge className={getClaimStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                      {claim.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollment Tab */}
        <TabsContent value="enrollment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Enrollment Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Health Insurance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Provident Fund</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-20" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wellness Program</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lifestyle Benefits</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={60} className="w-20" />
                      <span className="text-sm font-medium">60%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Enrollment Periods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-medium text-blue-900 dark:text-blue-200">Open Enrollment</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">December 1 - December 31, 2024</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Annual benefits enrollment period</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="font-medium text-green-900 dark:text-green-200">New Hire Enrollment</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Within 30 days of hire</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Automatic enrollment for new employees</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="font-medium text-yellow-900 dark:text-yellow-200">Life Event Changes</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Within 30 days of life event</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">Marriage, birth, adoption, etc.</p>
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