/**
 * Main Navigation Component - Enterprise HR Management System
 * Provides sidebar navigation for all HR modules and system functions
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield, 
  Settings, 
  LogOut,
  UserPlus,
  FileText,
  Building
} from 'lucide-react';

/**
 * Navigation item interface
 */
interface NavigationItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

/**
 * Main Navigation Props
 */
interface MainNavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

/**
 * Main Navigation Component
 */
export default function MainNavigation({ activeModule, onModuleChange }: MainNavigationProps) {
  const { user, logout } = useAuth();

  /**
   * Get navigation items based on user role
   */
  const getNavigationItems = (): NavigationItem[] => {
    // Employee navigation
    if (user?.role === 'Employee') {
      return [
        {
          key: 'dashboard',
          label: 'My Dashboard',
          icon: LayoutDashboard,
          description: 'Personal overview'
        },
        {
          key: 'employee-portal',
          label: 'Self Service',
          icon: Users,
          description: 'Personal HR services'
        },
        {
          key: 'leave',
          label: 'Leave',
          icon: Calendar,
          description: 'My leave requests'
        },
        {
          key: 'attendance',
          label: 'Attendance',
          icon: Clock,
          description: 'My time tracking'
        }
      ];
    }
    
    // Manager navigation
    if (user?.role === 'Manager') {
      return [
        {
          key: 'dashboard',
          label: 'My Dashboard',
          icon: LayoutDashboard,
          description: 'Personal overview'
        },
        {
          key: 'employee-portal',
          label: 'Self Service',
          icon: Users,
          description: 'Personal HR services'
        },
        {
          key: 'leave',
          label: 'Leave Management',
          icon: Calendar,
          description: 'Team leave approvals'
        },
        {
          key: 'attendance',
          label: 'Attendance',
          icon: Clock,
          description: 'Team time tracking'
        },
        {
          key: 'performance',
          label: 'Performance',
          icon: TrendingUp,
          description: 'Team performance reviews'
        }
      ];
    }
    
    // HR navigation
    if (user?.role === 'HR') {
      return [
        {
          key: 'dashboard',
          label: 'HR Dashboard',
          icon: LayoutDashboard,
          description: 'HR overview'
        },
        {
          key: 'employee-portal',
          label: 'Self Service',
          icon: Users,
          description: 'Personal HR services'
        },
        {
          key: 'employees',
          label: 'Employees',
          icon: Users,
          description: 'Employee management'
        },
        {
          key: 'leave',
          label: 'Leave Management',
          icon: Calendar,
          description: 'All leave requests'
        },
        {
          key: 'attendance',
          label: 'Attendance',
          icon: Clock,
          description: 'Company attendance'
        }
      ];
    }
    
    // Admin navigation
    return [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Overview and analytics'
      },
      {
        key: 'user-creation',
        label: 'User Management',
        icon: UserPlus,
        description: 'Create employee accounts'
      },
      {
        key: 'employee-portal',
        label: 'Employee Portal',
        icon: Users,
        description: 'Self-service portal for employees'
      },
      {
        key: 'it-onboarding',
        label: 'User Onboarding',
        icon: UserPlus,
        description: 'Employee onboarding & offboarding'
      },
      {
        key: 'employees',
        label: 'Employees',
        icon: Users,
        description: 'Employee management'
      },
      {
        key: 'leave',
        label: 'Leave Management',
        icon: Calendar,
        description: 'Leave requests and approvals'
      },
      {
        key: 'payroll',
        label: 'Payroll',
        icon: DollarSign,
        description: 'Salary and compensation'
      },
      {
        key: 'performance',
        label: 'Performance',
        icon: TrendingUp,
        description: 'Performance reviews'
      },
      {
        key: 'attendance',
        label: 'Attendance',
        icon: Clock,
        description: 'Time and attendance tracking'
      },
      {
        key: 'benefits',
        label: 'Benefits',
        icon: Shield,
        description: 'Employee benefits administration'
      },
      {
        key: 'customization',
        label: 'Customization',
        icon: Settings,
        description: 'Customize system appearance and modules'
      }
    ];
  };

  const navigationItems = getNavigationItems();

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Global Cyber IT</h1>
                <p className="text-sm text-gray-500">Enterprise HR</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onModuleChange(item.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Settings */}
        <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start hover:bg-gray-200"
              onClick={() => onModuleChange('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 border border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
