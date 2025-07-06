/**
 * System Integration Component - Demonstrates Flask-React integration
 * Shows real-time features, API connectivity, and enterprise capabilities
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications, useDashboardWidgets, useWebSocketSimulation, useGlobalSearch } from '../hooks/useRealTimeData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Database, 
  Wifi, 
  Search, 
  Activity, 
  Shield, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function SystemIntegration() {
  const { user, hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time hooks
  const { notifications, loading: notifLoading } = useNotifications();
  const { widgets, loading: widgetLoading } = useDashboardWidgets();
  const { events, connectionStatus } = useWebSocketSimulation(['user_login', 'attendance_clock', 'leave_request', 'performance_update']);
  const { results: searchResults, loading: searchLoading, search } = useGlobalSearch();

  /**
   * Handle search
   */
  const handleSearch = () => {
    if (searchQuery.length >= 2) {
      search(searchQuery, ['employees', 'attendance', 'leave', 'performance']);
    }
  };

  /**
   * Integration status indicators
   */
  const integrationStatus = {
    backend: 'connected',
    database: 'connected',
    websocket: connectionStatus,
    security: 'active'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'disconnected':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Integration Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Flask Backend + React Frontend Integration Status</p>
        </div>

        {/* User Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user?.role?.name} • {user?.email}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                Active Session
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Flask Backend</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(integrationStatus.backend)}>
                      {getStatusIcon(integrationStatus.backend)}
                      <span className="ml-1">{integrationStatus.backend}</span>
                    </Badge>
                  </div>
                </div>
                <Server className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">PostgreSQL DB</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(integrationStatus.database)}>
                      {getStatusIcon(integrationStatus.database)}
                      <span className="ml-1">{integrationStatus.database}</span>
                    </Badge>
                  </div>
                </div>
                <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Real-time Events</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(integrationStatus.websocket)}>
                      {getStatusIcon(integrationStatus.websocket)}
                      <span className="ml-1">{integrationStatus.websocket}</span>
                    </Badge>
                  </div>
                </div>
                <Wifi className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Layer</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(integrationStatus.security)}>
                      {getStatusIcon(integrationStatus.security)}
                      <span className="ml-1">{integrationStatus.security}</span>
                    </Badge>
                  </div>
                </div>
                <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Events</TabsTrigger>
            <TabsTrigger value="search">Global Search</TabsTrigger>
            <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dashboard Widgets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Dashboard Widgets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {widgetLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">Loading widgets...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {widgets.length > 0 ? (
                        widgets.map((widget, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium">{widget.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Type: {widget.type}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 dark:text-gray-400">No widgets configured</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium text-sm">{notification.subject}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.body}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(notification.scheduled_at).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 dark:text-gray-400">No recent notifications</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Events Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="w-5 h-5 mr-2" />
                  Live System Events
                  <Badge variant="outline" className="ml-2">
                    {connectionStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{event.data.message}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            User ID: {event.data.userId} • Type: {event.type}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">Waiting for real-time events...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Global Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Global Search API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search across all modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={searchLoading}>
                      {searchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>

                  {Object.keys(searchResults).length > 0 && (
                    <div className="space-y-4">
                      {Object.entries(searchResults).map(([module, results]) => (
                        <div key={module}>
                          <h4 className="font-medium mb-2 capitalize">{module} ({results.length})</h4>
                          <div className="space-y-2">
                            {results.slice(0, 3).map((result: any, index: number) => (
                              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                {result.name || result.title || `${module} #${result.id}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Role-Based Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>Current Role</span>
                    <Badge variant="default">{user?.role?.name}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Available Permissions:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'employees.read',
                        'employees.write',
                        'leave.approve',
                        'performance.read',
                        'reports.read',
                        'admin.access'
                      ].map((permission) => (
                        <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                          <span>{permission}</span>
                          {hasRole('Admin') || (hasRole('HR') && !permission.includes('admin')) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
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
