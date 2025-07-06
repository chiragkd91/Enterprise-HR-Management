/**
 * Mobile App Component - Mobile-optimized interface for on-the-go access
 * Provides mobile-friendly features with touch interfaces
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, Clock, MapPin, Bell, Menu, X, Home, Users, Calendar, Target, Award, Settings, LogOut, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MobileApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  /**
   * Update current time every second
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Monitor online/offline status
   */
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Request location permission
   */
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          console.log('Location:', position.coords);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationEnabled(false);
        }
      );
    }
  };

  /**
   * Handle clock in/out
   */
  const handleClockInOut = () => {
    setIsClockingIn(true);
    
    // Simulate API call
    setTimeout(() => {
      setClockedIn(!clockedIn);
      setIsClockingIn(false);
    }, 1500);
  };

  const mobileMenuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Clock, label: 'Time Tracking' },
    { icon: Users, label: 'Team' },
    { icon: Calendar, label: 'Calendar' },
    { icon: Target, label: 'Goals' },
    { icon: Award, label: 'Recognition' },
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout' }
  ];

  const quickActions = [
    {
      title: 'Clock In/Out',
      description: 'Track your work hours',
      icon: Clock,
      color: 'bg-blue-500',
      action: handleClockInOut
    },
    {
      title: 'Request Leave',
      description: 'Submit time off request',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => console.log('Request leave')
    },
    {
      title: 'Team Directory',
      description: 'Find team members',
      icon: Users,
      color: 'bg-purple-500',
      action: () => console.log('Team directory')
    },
    {
      title: 'Recognition',
      description: 'Give recognition',
      icon: Award,
      color: 'bg-orange-500',
      action: () => console.log('Recognition')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Mobile HR</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Global Cyber IT</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white dark:bg-gray-800 w-64 h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {mobileMenuItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Offline Alert */}
        {!isOnline && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <WifiOff className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-700 dark:text-orange-400">
              You're offline. Some features may not be available.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Time Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={locationEnabled}
                    onCheckedChange={requestLocation}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                </div>
                {locationEnabled && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Office</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clock In/Out Button */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-4">
                <Badge variant={clockedIn ? 'default' : 'secondary'} className="mb-2">
                  {clockedIn ? 'Clocked In' : 'Clocked Out'}
                </Badge>
                {clockedIn && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Started at 9:00 AM
                  </p>
                )}
              </div>
              <Button
                onClick={handleClockInOut}
                disabled={isClockingIn}
                className={`w-full h-16 text-lg font-semibold ${
                  clockedIn 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isClockingIn ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{clockedIn ? 'Clock Out' : 'Clock In'}</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PWA Install Prompt */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Install App</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Install as a native app for better experience
                </p>
              </div>
              <Button variant="outline" size="sm">
                Install
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hours Worked</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">7.5 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Break Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">45 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">8/12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Meetings</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
