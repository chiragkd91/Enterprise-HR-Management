/**
 * Security Dashboard Component - Enhanced security management with MFA
 * Provides comprehensive security monitoring and management features
 */

import React, { useState } from 'react';
import { Shield, Key, AlertTriangle, Activity, Lock, Unlock, Eye, EyeOff, Smartphone, Mail, MessageSquare, QrCode, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'mfa_setup' | 'suspicious_activity';
  timestamp: Date;
  location: string;
  device: string;
  ip: string;
  status: 'success' | 'failed' | 'blocked';
}

interface MFAMethod {
  id: string;
  type: 'sms' | 'email' | 'authenticator' | 'backup_codes';
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  lastUsed?: Date;
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  /**
   * Security score calculation
   */
  const calculateSecurityScore = (): number => {
    let score = 0;
    if (mfaEnabled) score += 30;
    if (mfaMethods.filter(m => m.enabled).length >= 2) score += 20;
    if (securitySettings.passwordComplexity) score += 15;
    if (securitySettings.sessionTimeout) score += 10;
    if (securitySettings.ipWhitelist) score += 15;
    if (securitySettings.auditLogging) score += 10;
    return Math.min(score, 100);
  };

  const securityScore = calculateSecurityScore();

  /**
   * MFA methods configuration
   */
  const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([
    {
      id: 'sms',
      type: 'sms',
      name: 'SMS Authentication',
      icon: MessageSquare,
      enabled: true,
      lastUsed: new Date(2024, 6, 1)
    },
    {
      id: 'email',
      type: 'email',
      name: 'Email Authentication',
      icon: Mail,
      enabled: true,
      lastUsed: new Date(2024, 6, 3)
    },
    {
      id: 'authenticator',
      type: 'authenticator',
      name: 'Authenticator App',
      icon: Smartphone,
      enabled: false
    },
    {
      id: 'backup_codes',
      type: 'backup_codes',
      name: 'Backup Codes',
      icon: Key,
      enabled: true
    }
  ]);

  /**
   * Security settings
   */
  const [securitySettings, setSecuritySettings] = useState({
    passwordComplexity: true,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLogging: true,
    failedLoginLockout: true,
    deviceRemembering: true
  });

  /**
   * Mock security events
   */
  const recentEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      timestamp: new Date(2024, 6, 5, 9, 30),
      location: 'New York, NY',
      device: 'Chrome on Windows',
      ip: '192.168.1.1',
      status: 'success'
    },
    {
      id: '2',
      type: 'failed_login',
      timestamp: new Date(2024, 6, 5, 8, 15),
      location: 'Unknown',
      device: 'Mobile Browser',
      ip: '10.0.0.1',
      status: 'blocked'
    },
    {
      id: '3',
      type: 'mfa_setup',
      timestamp: new Date(2024, 6, 4, 14, 20),
      location: 'San Francisco, CA',
      device: 'Safari on Mac',
      ip: '192.168.1.2',
      status: 'success'
    }
  ];

  /**
   * Backup codes for MFA
   */
  const backupCodes = [
    'A1B2C3D4',
    'E5F6G7H8',
    'I9J0K1L2',
    'M3N4O5P6',
    'Q7R8S9T0',
    'U1V2W3X4',
    'Y5Z6A7B8',
    'C9D0E1F2'
  ];

  /**
   * Toggle MFA method
   */
  const toggleMfaMethod = (methodId: string) => {
    setMfaMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
  };

  /**
   * Generate new backup codes
   */
  const generateBackupCodes = () => {
    // In production, this would call an API
    console.log('Generating new backup codes...');
  };

  /**
   * Download backup codes
   */
  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_codes.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Get security score color
   */
  const getSecurityScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Enhanced security management with multi-factor authentication</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>

        {/* Security Score */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Score</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your account security rating</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getSecurityScoreColor(securityScore)}`}>
                  {securityScore}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Security Level</p>
              </div>
            </div>
            <Progress value={securityScore} className="w-full" />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {securityScore >= 80 ? 'Excellent security configuration' : 
               securityScore >= 60 ? 'Good security, consider enabling more features' : 
               'Security needs improvement'}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mfa">Multi-Factor Auth</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Active Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current active sessions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span>Security Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recent security alerts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Last Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">2h ago</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last login activity</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          event.status === 'success' ? 'bg-green-500' :
                          event.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {event.type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.location} • {event.device} • {event.ip}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.timestamp.toLocaleString()}
                        </p>
                        <Badge variant={event.status === 'success' ? 'default' : 'destructive'}>
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MFA Tab */}
          <TabsContent value="mfa" className="space-y-6">
            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                Multi-factor authentication adds an extra layer of security to your account. Enable at least two methods for maximum protection.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mfaMethods.map((method) => (
                <Card key={method.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <method.icon className="w-5 h-5" />
                        <span>{method.name}</span>
                      </div>
                      <Switch 
                        checked={method.enabled}
                        onCheckedChange={() => toggleMfaMethod(method.id)}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.enabled ? 'Enabled and active' : 'Disabled'}
                      </p>
                      {method.lastUsed && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last used: {method.lastUsed.toLocaleDateString()}
                        </p>
                      )}
                      {method.type === 'authenticator' && !method.enabled && (
                        <Button size="sm" variant="outline">
                          <QrCode className="w-4 h-4 mr-2" />
                          Setup with QR Code
                        </Button>
                      )}
                      {method.type === 'backup_codes' && method.enabled && (
                        <div className="space-y-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowBackupCodes(!showBackupCodes)}
                          >
                            {showBackupCodes ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            {showBackupCodes ? 'Hide' : 'Show'} Codes
                          </Button>
                          {showBackupCodes && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                {backupCodes.map((code, index) => (
                                  <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-center">
                                    {code}
                                  </div>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={downloadBackupCodes}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                                <Button size="sm" variant="outline" onClick={generateBackupCodes}>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Generate New
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={event.status === 'success' ? 'default' : 'destructive'}>
                            {event.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {event.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <Badge variant="outline">{event.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Location: {event.location}</p>
                        <p>Device: {event.device}</p>
                        <p>IP Address: {event.ip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(securitySettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'passwordComplexity' && 'Enforce strong password requirements'}
                          {key === 'sessionTimeout' && 'Auto-logout after inactivity'}
                          {key === 'ipWhitelist' && 'Restrict access to specific IP addresses'}
                          {key === 'auditLogging' && 'Log all security events'}
                          {key === 'failedLoginLockout' && 'Lock account after failed attempts'}
                          {key === 'deviceRemembering' && 'Remember trusted devices'}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setSecuritySettings(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
