/**
 * Payroll Management Component - Employee salary processing and tax calculations
 * Comprehensive payroll system with Indian GST compliance and salary components
 */

import React, { useState } from 'react';
import { DollarSign, Plus, Download, Calculator, FileText, TrendingUp, TrendingDown, IndianRupee, Receipt, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    special: number;
  };
  deductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    advance: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'processed' | 'pending' | 'draft' | 'paid';
  processedDate?: string;
  paymentDate?: string;
}

interface SalaryComponent {
  id: string;
  name: string;
  type: 'allowance' | 'deduction';
  calculation: 'fixed' | 'percentage';
  value: number;
  applicableTo: string[];
  taxable: boolean;
  mandatory: boolean;
}

export default function PayrollManagement() {
  const [activeTab, setActiveTab] = useState<'payroll' | 'components' | 'reports' | 'compliance'>('payroll');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  /**
   * Mock payroll records
   */
  const payrollRecords: PayrollRecord[] = [
    {
      id: 'PAY001',
      employeeId: 'EMP001',
      employeeName: 'Alex Rodriguez',
      department: 'Engineering',
      month: 'January',
      year: 2024,
      basicSalary: 80000,
      allowances: {
        hra: 32000,
        transport: 2400,
        medical: 1250,
        special: 5000
      },
      deductions: {
        pf: 9600,
        esi: 675,
        professionalTax: 200,
        tds: 8500,
        advance: 0
      },
      grossSalary: 120650,
      netSalary: 101675,
      status: 'paid',
      processedDate: '2024-01-28',
      paymentDate: '2024-01-31'
    },
    {
      id: 'PAY002',
      employeeId: 'EMP002',
      employeeName: 'Maria Garcia',
      department: 'Marketing',
      month: 'January',
      year: 2024,
      basicSalary: 65000,
      allowances: {
        hra: 26000,
        transport: 2400,
        medical: 1250,
        special: 3000
      },
      deductions: {
        pf: 7800,
        esi: 548,
        professionalTax: 200,
        tds: 6200,
        advance: 5000
      },
      grossSalary: 97650,
      netSalary: 77902,
      status: 'processed',
      processedDate: '2024-01-28'
    },
    {
      id: 'PAY003',
      employeeId: 'EMP003',
      employeeName: 'David Kim',
      department: 'Sales',
      month: 'January',
      year: 2024,
      basicSalary: 70000,
      allowances: {
        hra: 28000,
        transport: 2400,
        medical: 1250,
        special: 8000
      },
      deductions: {
        pf: 8400,
        esi: 593,
        professionalTax: 200,
        tds: 7800,
        advance: 0
      },
      grossSalary: 109650,
      netSalary: 92657,
      status: 'pending',
      processedDate: '2024-01-28'
    }
  ];

  /**
   * Mock salary components
   */
  const salaryComponents: SalaryComponent[] = [
    {
      id: 'COMP001',
      name: 'House Rent Allowance (HRA)',
      type: 'allowance',
      calculation: 'percentage',
      value: 40,
      applicableTo: ['All'],
      taxable: true,
      mandatory: true
    },
    {
      id: 'COMP002',
      name: 'Transport Allowance',
      type: 'allowance',
      calculation: 'fixed',
      value: 2400,
      applicableTo: ['All'],
      taxable: false,
      mandatory: true
    },
    {
      id: 'COMP003',
      name: 'Medical Allowance',
      type: 'allowance',
      calculation: 'fixed',
      value: 1250,
      applicableTo: ['All'],
      taxable: false,
      mandatory: true
    },
    {
      id: 'COMP004',
      name: 'Provident Fund (PF)',
      type: 'deduction',
      calculation: 'percentage',
      value: 12,
      applicableTo: ['All'],
      taxable: false,
      mandatory: true
    },
    {
      id: 'COMP005',
      name: 'Employee State Insurance (ESI)',
      type: 'deduction',
      calculation: 'percentage',
      value: 0.75,
      applicableTo: ['Salary < 25000'],
      taxable: false,
      mandatory: true
    },
    {
      id: 'COMP006',
      name: 'Professional Tax',
      type: 'deduction',
      calculation: 'fixed',
      value: 200,
      applicableTo: ['All'],
      taxable: false,
      mandatory: true
    }
  ];

  /**
   * Get status color for payroll records
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get component type color
   */
  const getComponentTypeColor = (type: string) => {
    return type === 'allowance' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  /**
   * Calculate payroll statistics
   */
  const getPayrollStats = () => {
    const totalGross = payrollRecords.reduce((sum, record) => sum + record.grossSalary, 0);
    const totalNet = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
    const totalDeductions = totalGross - totalNet;
    const processed = payrollRecords.filter(r => r.status === 'processed' || r.status === 'paid').length;
    
    return { totalGross, totalNet, totalDeductions, processed, total: payrollRecords.length };
  };

  const stats = getPayrollStats();

  /**
   * Format currency in Indian Rupees
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payroll Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Process employee salaries with Indian compliance</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Calculator className="w-4 h-4 mr-2" />
                Process Payroll
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gross Salary</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalGross)}</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Net Salary</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalNet)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deductions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalDeductions)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.processed}/{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payroll">Payroll Records</TabsTrigger>
            <TabsTrigger value="components">Salary Components</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Payroll Records Tab */}
          <TabsContent value="payroll" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">January 2024 Payroll</h3>
              <div className="flex items-center space-x-3">
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="2024-01">January 2024</option>
                  <option value="2023-12">December 2023</option>
                  <option value="2023-11">November 2023</option>
                </select>
                <Button variant="outline" size="sm">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate All
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {payrollRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{record.employeeName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-lg">{record.employeeName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{record.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {record.month} {record.year}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Basic Salary */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Basic Salary</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(record.basicSalary)}
                        </p>
                      </div>

                      {/* Allowances */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Allowances</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>HRA:</span>
                            <span>{formatCurrency(record.allowances.hra)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Transport:</span>
                            <span>{formatCurrency(record.allowances.transport)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Medical:</span>
                            <span>{formatCurrency(record.allowances.medical)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Special:</span>
                            <span>{formatCurrency(record.allowances.special)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Deductions</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>PF:</span>
                            <span>{formatCurrency(record.deductions.pf)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>ESI:</span>
                            <span>{formatCurrency(record.deductions.esi)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Prof. Tax:</span>
                            <span>{formatCurrency(record.deductions.professionalTax)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>TDS:</span>
                            <span>{formatCurrency(record.deductions.tds)}</span>
                          </div>
                          {record.deductions.advance > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Advance:</span>
                              <span>{formatCurrency(record.deductions.advance)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Summary</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Gross:</span>
                            <span className="font-medium">{formatCurrency(record.grossSalary)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Net Salary:</span>
                            <span className="font-bold text-green-600">{formatCurrency(record.netSalary)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {record.processedDate && (
                          <span>Processed: {new Date(record.processedDate).toLocaleDateString()}</span>
                        )}
                        {record.paymentDate && (
                          <span className="ml-4">Paid: {new Date(record.paymentDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Slip
                        </Button>
                        {record.status === 'processed' && (
                          <Button size="sm">
                            <Receipt className="w-4 h-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Salary Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Salary Components</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salaryComponents.map((component) => (
                <Card key={component.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getComponentTypeColor(component.type)}>
                          {component.type}
                        </Badge>
                        {component.mandatory && (
                          <Badge variant="outline" className="text-xs">Mandatory</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Calculation:</span>
                        <span className="font-medium capitalize">{component.calculation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Value:</span>
                        <span className="font-medium">
                          {component.calculation === 'percentage' ? `${component.value}%` : formatCurrency(component.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Taxable:</span>
                        <Badge variant={component.taxable ? 'destructive' : 'secondary'}>
                          {component.taxable ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Applicable to:</span>
                        <div className="mt-1">
                          {component.applicableTo.map((criteria, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                              {criteria}
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

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Monthly Payroll Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      PF Contribution Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="w-4 h-4 mr-2" />
                      TDS Certificate (Form 16)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Annual Salary Statement
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payroll Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Average Salary</span>
                      <span className="font-medium">{formatCurrency(Math.round(stats.totalNet / stats.total))}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Highest Department Cost</span>
                      <span className="font-medium">Engineering</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Tax Deducted</span>
                      <span className="font-medium">{formatCurrency(22500)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Compliance Score</span>
                      <Badge className="bg-green-100 text-green-800">100%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Indian Compliance Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>PF Compliance</span>
                      <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ESI Compliance</span>
                      <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TDS Compliance</span>
                      <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Professional Tax</span>
                      <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Labour Law Compliance</span>
                      <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statutory Filings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>PF Return (ECR)</span>
                      <span className="text-sm text-gray-600">Due: 15th Feb</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ESI Return</span>
                      <span className="text-sm text-gray-600">Due: 21st Feb</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TDS Return</span>
                      <span className="text-sm text-gray-600">Due: 31st Mar</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Form 16 Generation</span>
                      <span className="text-sm text-gray-600">Due: 15th Jun</span>
                    </div>
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