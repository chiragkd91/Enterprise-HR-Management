/**
 * Main Application Component - Enterprise HR Management System
 * Handles authentication flow and main application routing
 */

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import MainNavigation from './components/MainNavigation';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeSelfService from './components/EmployeeSelfService';
import UserCreation from './components/UserCreation';
import ITOnboardingOffboarding from './components/ITOnboardingOffboarding';
import OnboardingSystem from './components/OnboardingSystem';
import EmployeeManagement from './components/EmployeeManagement';
import LeaveManagement from './components/LeaveManagement';
import PayrollManagement from './components/PayrollManagement';
import PerformanceManagement from './components/PerformanceManagement';
import TimeAttendance from './components/TimeAttendance';
import BenefitsAdministration from './components/BenefitsAdministration';
import SystemCustomization from './components/SystemCustomization';
import { Toaster } from 'sonner';

/**
 * Main App Content Component
 */
function AppContent() {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = React.useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  /**
   * Render active module based on navigation selection
   */
  const renderModule = () => {
    // Show employee dashboard for non-admin users
    if (user?.role === 'Employee' || user?.role === 'Manager' || user?.role === 'HR') {
      switch (activeModule) {
        case 'dashboard':
          return <EmployeeDashboard />;
        case 'employee-portal':
          return <EmployeeSelfService />;
        case 'leave':
          return <LeaveManagement />;
        case 'attendance':
          return <TimeAttendance />;
        default:
          return <EmployeeDashboard />;
      }
    }
    
    // Admin modules
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'employee-portal':
        return <EmployeeSelfService />;
      case 'user-creation':
        return <UserCreation />;
      case 'it-onboarding':
        return <ITOnboardingOffboarding />;
      case 'employees':
        return <EmployeeManagement />;
      case 'leave':
        return <LeaveManagement />;
      case 'payroll':
        return <PayrollManagement />;
      case 'performance':
        return <PerformanceManagement />;
      case 'attendance':
        return <TimeAttendance />;
      case 'benefits':
        return <BenefitsAdministration />;
      case 'customization':
        return <SystemCustomization />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation 
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {renderModule()}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

/**
 * Main App Component with Authentication Provider
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
