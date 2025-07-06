/**
 * System Customization Component - Complete customization control center
 * Allows users to customize all aspects of the HR management system
 */

import React, { useState } from 'react';
import { Settings, Palette, Layout, Shield, Database, Workflow, Save, RotateCcw, Eye, Code, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface CustomizationSettings {
  // Theme Settings
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    darkMode: boolean;
    fontSize: number;
    borderRadius: number;
  };
  
  // Layout Settings
  layout: {
    sidebarWidth: number;
    headerHeight: number;
    contentPadding: number;
    cardSpacing: number;
    showSidebar: boolean;
    compactMode: boolean;
  };
  
  // Module Settings
  modules: {
    dashboard: ModuleConfig;
    employees: ModuleConfig;
    onboarding: ModuleConfig;
    leave: ModuleConfig;
    payroll: ModuleConfig;
    performance: ModuleConfig;
    attendance: ModuleConfig;
    benefits: ModuleConfig;
  };
  
  // System Settings
  system: {
    companyName: string;
    companyLogo: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
}

interface ModuleConfig {
  enabled: boolean;
  displayName: string;
  icon: string;
  color: string;
  permissions: string[];
  customFields: CustomField[];
  workflows: WorkflowConfig[];
}

interface CustomField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  visible: boolean;
  order: number;
}

interface WorkflowConfig {
  id: string;
  name: string;
  steps: WorkflowStep[];
  approvers: string[];
  notifications: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  required: boolean;
  assignee: string;
}

export default function SystemCustomization() {
  const [activeTab, setActiveTab] = useState<'theme' | 'layout' | 'modules' | 'system' | 'preview'>('theme');
  const [selectedModule, setSelectedModule] = useState('dashboard');
  const [settings, setSettings] = useState<CustomizationSettings>({
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#64748B',
      accentColor: '#10B981',
      backgroundColor: '#F8FAFC',
      textColor: '#1E293B',
      borderColor: '#E2E8F0',
      darkMode: false,
      fontSize: 14,
      borderRadius: 8
    },
    layout: {
      sidebarWidth: 256,
      headerHeight: 64,
      contentPadding: 24,
      cardSpacing: 16,
      showSidebar: true,
      compactMode: false
    },
    modules: {
      dashboard: {
        enabled: true,
        displayName: 'Dashboard',
        icon: 'LayoutDashboard',
        color: '#3B82F6',
        permissions: ['view', 'edit'],
        customFields: [],
        workflows: []
      },
      employees: {
        enabled: true,
        displayName: 'Employee Management',
        icon: 'Users',
        color: '#8B5CF6',
        permissions: ['view', 'edit', 'create', 'delete'],
        customFields: [
          { id: 'emp_id', name: 'Employee ID', type: 'text', required: true, visible: true, order: 1 },
          { id: 'department', name: 'Department', type: 'select', required: true, visible: true, order: 2 }
        ],
        workflows: []
      },
      onboarding: {
        enabled: true,
        displayName: 'IT Onboarding',
        icon: 'UserPlus',
        color: '#10B981',
        permissions: ['view', 'edit', 'create'],
        customFields: [],
        workflows: [
          {
            id: 'onboard_flow',
            name: 'Standard Onboarding',
            steps: [
              { id: 'step1', name: 'Identity Verification', type: 'manual', required: true, assignee: 'HR Team' },
              { id: 'step2', name: 'IT Setup', type: 'automated', required: true, assignee: 'IT Team' }
            ],
            approvers: ['HR Manager', 'IT Manager'],
            notifications: true
          }
        ]
      },
      leave: {
        enabled: true,
        displayName: 'Leave Management',
        icon: 'Calendar',
        color: '#F59E0B',
        permissions: ['view', 'edit', 'approve'],
        customFields: [],
        workflows: []
      },
      payroll: {
        enabled: true,
        displayName: 'Payroll Management',
        icon: 'DollarSign',
        color: '#EF4444',
        permissions: ['view', 'edit'],
        customFields: [],
        workflows: []
      },
      performance: {
        enabled: true,
        displayName: 'Performance Management',
        icon: 'TrendingUp',
        color: '#06B6D4',
        permissions: ['view', 'edit', 'review'],
        customFields: [],
        workflows: []
      },
      attendance: {
        enabled: true,
        displayName: 'Time & Attendance',
        icon: 'Clock',
        color: '#84CC16',
        permissions: ['view', 'edit'],
        customFields: [],
        workflows: []
      },
      benefits: {
        enabled: true,
        displayName: 'Benefits Administration',
        icon: 'Shield',
        color: '#EC4899',
        permissions: ['view', 'edit', 'enroll'],
        customFields: [],
        workflows: []
      }
    },
    system: {
      companyName: 'Global Cyber IT',
      companyLogo: '',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR',
      language: 'en'
    }
  });

  /**
   * Update settings helper
   */
  const updateSettings = (section: keyof CustomizationSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  /**
   * Update module settings
   */
  const updateModuleSettings = (module: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: {
          ...prev.modules[module as keyof typeof prev.modules],
          [field]: value
        }
      }
    }));
  };

  /**
   * Save customization settings
   */
  const saveSettings = () => {
    localStorage.setItem('hr_customization_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  /**
   * Reset to defaults
   */
  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all customizations?')) {
      localStorage.removeItem('hr_customization_settings');
      window.location.reload();
    }
  };

  /**
   * Export settings
   */
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hr_system_settings.json';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Customization</h1>
              <p className="text-gray-600 dark:text-gray-400">Customize all aspects of your HR management system</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={exportSettings}>
                <Code className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={saveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="theme">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="w-4 h-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="modules">
              <Database className="w-4 h-4 mr-2" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Theme Customization */}
          <TabsContent value="theme" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) => updateSettings('theme', 'primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.theme.primaryColor}
                        onChange={(e) => updateSettings('theme', 'primaryColor', e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.theme.secondaryColor}
                        onChange={(e) => updateSettings('theme', 'secondaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.theme.secondaryColor}
                        onChange={(e) => updateSettings('theme', 'secondaryColor', e.target.value)}
                        placeholder="#64748B"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.theme.accentColor}
                        onChange={(e) => updateSettings('theme', 'accentColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.theme.accentColor}
                        onChange={(e) => updateSettings('theme', 'accentColor', e.target.value)}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typography & Spacing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Font Size: {settings.theme.fontSize}px</Label>
                    <Slider
                      value={[settings.theme.fontSize]}
                      onValueChange={(value) => updateSettings('theme', 'fontSize', value[0])}
                      min={12}
                      max={18}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Border Radius: {settings.theme.borderRadius}px</Label>
                    <Slider
                      value={[settings.theme.borderRadius]}
                      onValueChange={(value) => updateSettings('theme', 'borderRadius', value[0])}
                      min={0}
                      max={16}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <Switch
                      id="darkMode"
                      checked={settings.theme.darkMode}
                      onCheckedChange={(checked) => updateSettings('theme', 'darkMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layout Customization */}
          <TabsContent value="layout" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Sidebar Width: {settings.layout.sidebarWidth}px</Label>
                    <Slider
                      value={[settings.layout.sidebarWidth]}
                      onValueChange={(value) => updateSettings('layout', 'sidebarWidth', value[0])}
                      min={200}
                      max={400}
                      step={8}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Header Height: {settings.layout.headerHeight}px</Label>
                    <Slider
                      value={[settings.layout.headerHeight]}
                      onValueChange={(value) => updateSettings('layout', 'headerHeight', value[0])}
                      min={48}
                      max={96}
                      step={8}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Content Padding: {settings.layout.contentPadding}px</Label>
                    <Slider
                      value={[settings.layout.contentPadding]}
                      onValueChange={(value) => updateSettings('layout', 'contentPadding', value[0])}
                      min={16}
                      max={48}
                      step={4}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layout Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showSidebar">Show Sidebar</Label>
                    <Switch
                      id="showSidebar"
                      checked={settings.layout.showSidebar}
                      onCheckedChange={(checked) => updateSettings('layout', 'showSidebar', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactMode">Compact Mode</Label>
                    <Switch
                      id="compactMode"
                      checked={settings.layout.compactMode}
                      onCheckedChange={(checked) => updateSettings('layout', 'compactMode', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label>Card Spacing: {settings.layout.cardSpacing}px</Label>
                    <Slider
                      value={[settings.layout.cardSpacing]}
                      onValueChange={(value) => updateSettings('layout', 'cardSpacing', value[0])}
                      min={8}
                      max={32}
                      step={4}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Module Customization */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Module List */}
              <Card>
                <CardHeader>
                  <CardTitle>Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(settings.modules).map(([key, module]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedModule === key ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedModule(key)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{module.displayName}</span>
                          <Switch
                            checked={module.enabled}
                            onCheckedChange={(checked) => updateModuleSettings(key, 'enabled', checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Module Configuration */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {settings.modules[selectedModule as keyof typeof settings.modules]?.displayName} Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.modules[selectedModule as keyof typeof settings.modules]?.displayName || ''}
                      onChange={(e) => updateModuleSettings(selectedModule, 'displayName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="moduleColor">Module Color</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        type="color"
                        value={settings.modules[selectedModule as keyof typeof settings.modules]?.color || '#3B82F6'}
                        onChange={(e) => updateModuleSettings(selectedModule, 'color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.modules[selectedModule as keyof typeof settings.modules]?.color || '#3B82F6'}
                        onChange={(e) => updateModuleSettings(selectedModule, 'color', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['view', 'edit', 'create', 'delete', 'approve', 'review', 'enroll'].map((permission) => (
                        <Badge
                          key={permission}
                          variant={
                            settings.modules[selectedModule as keyof typeof settings.modules]?.permissions?.includes(permission) 
                              ? 'default' 
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            const currentPermissions = settings.modules[selectedModule as keyof typeof settings.modules]?.permissions || [];
                            const newPermissions = currentPermissions.includes(permission)
                              ? currentPermissions.filter(p => p !== permission)
                              : [...currentPermissions, permission];
                            updateModuleSettings(selectedModule, 'permissions', newPermissions);
                          }}
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.system.companyName}
                      onChange={(e) => updateSettings('system', 'companyName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companyLogo">Company Logo URL</Label>
                    <Input
                      id="companyLogo"
                      value={settings.system.companyLogo}
                      onChange={(e) => updateSettings('system', 'companyLogo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.system.timezone} onValueChange={(value) => updateSettings('system', 'timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={settings.system.dateFormat} onValueChange={(value) => updateSettings('system', 'dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.system.currency} onValueChange={(value) => updateSettings('system', 'currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div 
                    className="w-full h-64 rounded-lg mb-4"
                    style={{ 
                      backgroundColor: settings.theme.backgroundColor,
                      border: `1px solid ${settings.theme.borderColor}`,
                      borderRadius: `${settings.theme.borderRadius}px`
                    }}
                  >
                    <div 
                      className="h-16 flex items-center justify-between px-6"
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    >
                      <div className="text-white font-bold">{settings.system.companyName}</div>
                      <div className="text-white text-sm">Enterprise HR</div>
                    </div>
                    <div className="flex">
                      <div 
                        className="h-48 flex flex-col p-4"
                        style={{ 
                          width: `${settings.layout.sidebarWidth / 4}px`,
                          backgroundColor: settings.theme.darkMode ? '#1F2937' : '#FFFFFF'
                        }}
                      >
                        {Object.entries(settings.modules).filter(([_, module]) => module.enabled).slice(0, 4).map(([key, module]) => (
                          <div 
                            key={key}
                            className="p-2 mb-2 rounded text-sm"
                            style={{ 
                              backgroundColor: module.color + '20',
                              color: module.color,
                              fontSize: `${settings.theme.fontSize - 2}px`
                            }}
                          >
                            {module.displayName}
                          </div>
                        ))}
                      </div>
                      <div 
                        className="flex-1 p-4"
                        style={{ 
                          backgroundColor: settings.theme.backgroundColor,
                          color: settings.theme.textColor
                        }}
                      >
                        <div 
                          className="h-20 rounded mb-4"
                          style={{ 
                            backgroundColor: settings.theme.accentColor + '20',
                            borderRadius: `${settings.theme.borderRadius}px`
                          }}
                        ></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div 
                            className="h-16 rounded"
                            style={{ 
                              backgroundColor: settings.theme.secondaryColor + '20',
                              borderRadius: `${settings.theme.borderRadius}px`
                            }}
                          ></div>
                          <div 
                            className="h-16 rounded"
                            style={{ 
                              backgroundColor: settings.theme.primaryColor + '20',
                              borderRadius: `${settings.theme.borderRadius}px`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    This preview shows how your customizations will appear in the system
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
