/**
 * Login Component - Authentication interface for Global Cyber IT
 * Provides secure login with demo credentials and feature showcase
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Users, BarChart3, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Login Component
 */
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@globalcyberit.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful! Welcome to Global Cyber IT');
      } else {
        setError('Invalid credentials. Please try again.');
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      toast.error('Login error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="text-white space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">GLOBAL CYBER IT</h1>
            <h2 className="text-2xl font-semibold mb-4">Smart ERP + CRM</h2>
            <p className="text-xl text-blue-100">Indian GST Support & Local Customization</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">GST Compliant</h3>
                  <p className="text-white/80 text-sm">
                    Full Indian GST support with automatic tax calculations and e-Invoice generation
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Smart CRM</h3>
                  <p className="text-white/80 text-sm">
                    Complete customer management with KYC, GSTIN validation, and Indian address format
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Business Analytics</h3>
                  <p className="text-white/80 text-sm">
                    Real-time dashboards with Indian business metrics and GST reporting
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Secure & Scalable</h3>
                  <p className="text-white/80 text-sm">
                    Enterprise-grade security with role-based access and complete audit trails
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Smart ERP + CRM account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@globalcyberit.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
              <p className="text-sm text-gray-600">Email: admin@globalcyberit.com</p>
              <p className="text-sm text-gray-600">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        ©2024 Global Cyber IT. All rights reserved.
      </div>
    </div>
  );
}
