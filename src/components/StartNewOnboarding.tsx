/**
 * Start New Onboarding Component - Comprehensive user registration and onboarding
 * Handles all aspects of new user onboarding including KYC, GSTIN, and role assignment
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  FileText, 
  Upload, 
  Camera,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Globe,
  BookOpen,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

interface UserRegistrationData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Role Assignment
  role: string;
  department: string;
  designation: string;
  reportingManager: string;
  joiningDate: string;
  
  // Password
  password: string;
  confirmPassword: string;
  
  // KYC Documents
  aadharNumber: string;
  panNumber: string;
  documents: File[];
  
  // GSTIN (if applicable)
  gstinRequired: boolean;
  gstinNumber: string;
  businessName: string;
  businessType: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Banking Details
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  
  // Policies Acknowledgment
  policiesAccepted: boolean;
  codeOfConductAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

export default function StartNewOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserRegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    role: '',
    department: '',
    designation: '',
    reportingManager: '',
    joiningDate: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    panNumber: '',
    documents: [],
    gstinRequired: false,
    gstinNumber: '',
    businessName: '',
    businessType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    policiesAccepted: false,
    codeOfConductAccepted: false,
    privacyPolicyAccepted: false
  });

  const steps: OnboardingStep[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Personal details and contact information',
      icon: User,
      completed: false
    },
    {
      id: 'role-assignment',
      title: 'Role Assignment',
      description: 'Department, designation, and role setup',
      icon: Building,
      completed: false
    },
    {
      id: 'kyc-verification',
      title: 'KYC Verification',
      description: 'Identity verification and document upload',
      icon: Shield,
      completed: false
    },
    {
      id: 'gstin-registration',
      title: 'GSTIN Registration',
      description: 'GST compliance and business details',
      icon: FileText,
      completed: false
    },
    {
      id: 'emergency-banking',
      title: 'Emergency & Banking',
      description: 'Emergency contacts and banking information',
      icon: CreditCard,
      completed: false
    },
    {
      id: 'policies-training',
      title: 'Policies & Training',
      description: 'Company policies and training modules',
      icon: BookOpen,
      completed: false
    },
    {
      id: 'review-submit',
      title: 'Review & Submit',
      description: 'Final review and onboarding completion',
      icon: CheckCircle,
      completed: false
    }
  ];

  /**
   * Handle form field changes
   */
  const handleInputChange = (field: keyof UserRegistrationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  /**
   * Validate current step
   */
  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basic Information
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 1: // Role Assignment
        return !!(formData.role && formData.department && formData.designation);
      case 2: // KYC Verification
        return !!(formData.aadharNumber && formData.panNumber);
      case 3: // GSTIN Registration
        return formData.gstinRequired ? !!(formData.gstinNumber && formData.businessName) : true;
      case 4: // Emergency & Banking
        return !!(formData.emergencyContactName && formData.bankName && formData.accountNumber);
      case 5: // Policies & Training
        return formData.policiesAccepted && formData.codeOfConductAccepted && formData.privacyPolicyAccepted;
      default:
        return true;
    }
  };

  /**
   * Move to next step
   */
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fill all required fields before proceeding');
    }
  };

  /**
   * Move to previous step
   */
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Submit onboarding
   */
  const submitOnboarding = () => {
    if (validateStep(currentStep)) {
      toast.success('Onboarding submitted successfully! Welcome to the team!');
      console.log('Onboarding Data:', formData);
    } else {
      toast.error('Please complete all required fields');
    }
  };

  /**
   * Render form step content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="employee@globalcyberit.com"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="PIN Code"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Role Assignment
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">User Role *</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="e.g., Senior Developer, Marketing Manager"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Select onValueChange={(value) => handleInputChange('reportingManager', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john.smith">John Smith (Engineering Manager)</SelectItem>
                    <SelectItem value="sarah.wilson">Sarah Wilson (HR Manager)</SelectItem>
                    <SelectItem value="mike.johnson">Mike Johnson (Finance Manager)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        );

      case 2: // KYC Verification
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aadharNumber">Aadhaar Number *</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                  required
                />
              </div>
              <div>
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label>Document Upload</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload KYC Documents</h3>
                <p className="text-gray-600 mb-4">
                  Upload Aadhaar Card, PAN Card, and other identity proofs
                </p>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="document-upload"
                />
                <Label htmlFor="document-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </Label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported: JPG, PNG, PDF (Max 5MB each)
                </p>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Uploaded Documents:</h4>
                  <div className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline">Uploaded</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // GSTIN Registration
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gstinRequired"
                checked={formData.gstinRequired}
                onCheckedChange={(checked) => handleInputChange('gstinRequired', checked)}
              />
              <Label htmlFor="gstinRequired">GSTIN Registration Required</Label>
            </div>
            
            {formData.gstinRequired && (
              <>
                <div>
                  <Label htmlFor="gstinNumber">GSTIN Number *</Label>
                  <Input
                    id="gstinNumber"
                    value={formData.gstinNumber}
                    onChange={(e) => handleInputChange('gstinNumber', e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter business name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="private-limited">Private Limited</SelectItem>
                      <SelectItem value="public-limited">Public Limited</SelectItem>
                      <SelectItem value="llp">LLP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {!formData.gstinRequired && (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GSTIN Not Required</h3>
                <p className="text-gray-600">You can proceed to the next step.</p>
              </div>
            )}
          </div>
        );

      case 4: // Emergency & Banking
        return (
          <div className="space-y-6">
            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Contact Name *</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
                    <Input
                      id="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="emergencyContactRelation">Relationship</Label>
                  <Select onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Banking Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Banking Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      placeholder="Bank name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      placeholder="Account number"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      placeholder="IFSC Code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      placeholder="As per bank records"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Policies & Training
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Policies</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="policiesAccepted"
                    checked={formData.policiesAccepted}
                    onCheckedChange={(checked) => handleInputChange('policiesAccepted', checked)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="policiesAccepted" className="font-medium">
                      Employee Handbook & Policies *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      I have read and understood the employee handbook, company policies, and procedures.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      View Employee Handbook
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="codeOfConductAccepted"
                    checked={formData.codeOfConductAccepted}
                    onCheckedChange={(checked) => handleInputChange('codeOfConductAccepted', checked)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="codeOfConductAccepted" className="font-medium">
                      Code of Conduct *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      I agree to abide by the company's code of conduct and ethical guidelines.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      View Code of Conduct
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyPolicyAccepted"
                    checked={formData.privacyPolicyAccepted}
                    onCheckedChange={(checked) => handleInputChange('privacyPolicyAccepted', checked)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="privacyPolicyAccepted" className="font-medium">
                      Privacy Policy *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      I acknowledge the privacy policy and consent to data processing as outlined.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      View Privacy Policy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Training Modules</h3>
              <div className="space-y-3">
                {[
                  { name: 'Security Awareness Training', duration: '2 hours', mandatory: true },
                  { name: 'Company Culture & Values', duration: '1 hour', mandatory: true },
                  { name: 'Workplace Safety', duration: '1.5 hours', mandatory: true },
                  { name: 'IT Security & Data Protection', duration: '2 hours', mandatory: true },
                  { name: 'Role-specific Training', duration: '4 hours', mandatory: false }
                ].map((training, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{training.name}</p>
                      <p className="text-sm text-gray-600">Duration: {training.duration}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {training.mandatory && (
                        <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                      )}
                      <Badge variant="outline">Assigned</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Review & Submit
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <p className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.email}<br />
                      {formData.phone}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Role Assignment</h4>
                    <p className="text-sm text-gray-600">
                      {formData.designation}<br />
                      {formData.department}<br />
                      Role: {formData.role}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">KYC Status</h4>
                    <p className="text-sm text-gray-600">
                      Aadhaar: {formData.aadharNumber ? '✓ Provided' : '✗ Not provided'}<br />
                      PAN: {formData.panNumber ? '✓ Provided' : '✗ Not provided'}<br />
                      Documents: {formData.documents.length} uploaded
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Compliance</h4>
                    <p className="text-sm text-gray-600">
                      GSTIN: {formData.gstinRequired ? (formData.gstinNumber ? '✓ Provided' : '⚠ Required') : 'Not required'}<br />
                      Policies: {formData.policiesAccepted ? '✓ Accepted' : '✗ Not accepted'}<br />
                      Training: Assigned
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You will receive a welcome email with login credentials</li>
                <li>• IT team will prepare your workstation and accounts</li>
                <li>• HR will schedule your orientation session</li>
                <li>• Training modules will be available in your dashboard</li>
                <li>• Your manager will contact you for the first meeting</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start New Onboarding</h1>
          <p className="text-gray-600">Complete employee registration and onboarding process</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <currentStepData.icon className="w-5 h-5 mr-2" />
              {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600">{currentStepData.description}</p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={submitOnboarding} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Onboarding
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
