/**
 * Employee Self-Service Portal - Personal HR functions for employees
 * Provides access to personal information, leave, attendance, and other self-service features
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit3, 
  DollarSign, 
  Receipt, 
  Info, 
  Calendar, 
  Clock, 
  FileText,
  Search,
  User,
  Contact,
  MapPin,
  Building,
  Users,
  Shield,
  CreditCard,
  Globe,
  Car,
  Award,
  Languages,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle,
  FileDown,
  Plus,
  BarChart3
} from 'lucide-react';

interface ServiceCard {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: ServiceItem[];
}

interface ServiceItem {
  label: string;
  action?: string;
}

export default function EmployeeSelfService() {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Self-service modules configuration
   */
  const serviceCards: ServiceCard[] = [
    {
      id: 'view',
      title: 'View',
      icon: Eye,
      color: 'blue',
      items: [
        { label: 'Employment | Contact | Personal' },
        { label: 'Statutory | Bank | Family' },
        { label: 'Nominee | Immigration | Driving Licenses' },
        { label: 'Skills | Languages | Qualifications' },
        { label: 'Previous Experience | Policy' }
      ]
    },
    {
      id: 'edit',
      title: 'Edit',
      icon: Edit3,
      color: 'green',
      items: [
        { label: 'Profile | Contact | Personal' },
        { label: 'Immigration | Driving License | Family' },
        { label: 'Nominee | Skills | Languages' },
        { label: 'Qualification | Previous Experience' }
      ]
    },
    {
      id: 'salary',
      title: 'Salary',
      icon: DollarSign,
      color: 'purple',
      items: [
        { label: 'CTC | Download CTC | Download Payslip' }
      ]
    },
    {
      id: 'taxation',
      title: 'Taxation',
      icon: Receipt,
      color: 'orange',
      items: [
        { label: 'View Tax Eligibility | Tax Projection |' },
        { label: 'Download Form 16' },
        { label: 'Declaration List' }
      ]
    },
    {
      id: 'quick-info',
      title: 'Quick Info',
      icon: Info,
      color: 'cyan',
      items: [
        { label: 'Leave Balances | Holiday List | My Documents' },
        { label: 'Add Quick Links' }
      ]
    },
    {
      id: 'workflow',
      title: 'Workflow',
      icon: BarChart3,
      color: 'indigo',
      items: [
        { label: 'My Approvers | My Workflow |' },
        { label: 'App. Status Count - Manager' }
      ]
    }
  ];

  const leaveCards: ServiceCard[] = [
    {
      id: 'my-info',
      title: 'My Info',
      icon: Info,
      color: 'blue',
      items: [
        { label: 'My Leave Register' }
      ]
    },
    {
      id: 'leave',
      title: 'Leave',
      icon: Calendar,
      color: 'green',
      items: [
        { label: 'Apply | Apply By Manager | Approve' },
        { label: 'Cancellation | Dashboard - Manager' }
      ]
    },
    {
      id: 'leave-reports',
      title: 'Leave Reports',
      icon: FileText,
      color: 'purple',
      items: [
        { label: 'Reports - Manager |' },
        { label: 'Leave Register Report - Manager' }
      ]
    },
    {
      id: 'outdoor-duty',
      title: 'Outdoor Duty',
      icon: MapPin,
      color: 'orange',
      items: [
        { label: 'Apply | Apply By Manager | Approve' },
        { label: 'Cancellation | Reports - Manager' }
      ]
    }
  ];

  const timeCards: ServiceCard[] = [
    {
      id: 'attendance',
      title: 'Attendance',
      icon: Clock,
      color: 'blue',
      items: [
        { label: 'My Attendance | View Attendance - Manager |' },
        { label: 'Dashboard - Manager' }
      ]
    },
    {
      id: 'swipe',
      title: 'Swipe',
      icon: CreditCard,
      color: 'green',
      items: [
        { label: 'Apply | Apply By Manager | Approve Swipe' },
        { label: 'Reports - Manager' }
      ]
    },
    {
      id: 'attendance-reports',
      title: 'Attendance Reports',
      icon: FileText,
      color: 'purple',
      items: [
        { label: 'Muster Report Writer - Manager |' },
        { label: 'Muster Report Writer Grouping - Manager |' },
        { label: 'Reports - Manager' }
      ]
    },
    {
      id: 'short-time-off',
      title: 'Short Time Off',
      icon: User,
      color: 'orange',
      items: [
        { label: 'Apply | Apply By Manager | Approve' },
        { label: 'Reports - Manager' }
      ]
    }
  ];

  const claimsCards: ServiceCard[] = [
    {
      id: 'expense',
      title: 'Expense',
      icon: Receipt,
      color: 'blue',
      items: [
        { label: 'Apply Voucher | Approve Voucher |' },
        { label: 'Voucher Reports - Manager' }
      ]
    }
  ];

  /**
   * Get color classes for cards
   */
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  /**
   * Render service section
   */
  const renderServiceSection = (title: string, cards: ServiceCard[]) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 bg-blue-50 border-blue-200"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const colorClasses = getColorClasses(card.color);
          
          return (
            <Card key={card.id} className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${colorClasses.split(' ')[2]}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {card.items.map((item, index) => (
                    <p key={index} className="text-sm text-gray-600 leading-relaxed">
                      {item.label}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Self Service</h1>
              <p className="text-gray-600">Access your personal HR information and services</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active Employee
              </Badge>
              <Button variant="outline">
                <FileDown className="w-4 h-4 mr-2" />
                Quick Download
              </Button>
            </div>
          </div>
        </div>

        {/* Self Service Section */}
        {renderServiceSection('Self Service', serviceCards)}

        {/* Leave Section */}
        {renderServiceSection('Leave', leaveCards)}

        {/* Time Section */}
        {renderServiceSection('Time', timeCards)}

        {/* Claims Section */}
        {renderServiceSection('Claims', claimsCards)}

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Apply Leave</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Clock className="w-6 h-6" />
                  <span className="text-sm">Mark Attendance</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <FileDown className="w-6 h-6" />
                  <span className="text-sm">Download Payslip</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Receipt className="w-6 h-6" />
                  <span className="text-sm">Submit Expense</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
