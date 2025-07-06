/**
 * IT Asset Management Component - Complete IT asset tracking and management
 * Handles hardware inventory, software licensing, asset assignment, maintenance, and depreciation
 */

import React, { useState } from 'react';
import { Laptop, Monitor, Smartphone, HardDrive, Wifi, Shield, Plus, Edit, Eye, Search, Filter, Cloud, Server, Settings, GitBranch, PlayCircle, PauseCircle, RotateCcw, CheckCircle, X, Save, Upload, Calendar, DollarSign, MapPin, User, Maximize2, Minimize2, Hash, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Asset {
  id: string;
  name: string;
  category: 'laptop' | 'desktop' | 'monitor' | 'phone' | 'tablet' | 'server' | 'network';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  status: 'active' | 'maintenance' | 'retired' | 'lost' | 'available';
  assignedTo?: string;
  assignedEmployee?: string;
  location: string;
  warrantyExpiry: string;
  specifications: Record<string, string>;
}

interface SoftwareLicense {
  id: string;
  name: string;
  vendor: string;
  licenseType: 'subscription' | 'perpetual' | 'volume';
  totalLicenses: number;
  usedLicenses: number;
  availableLicenses: number;
  costPerLicense: number;
  renewalDate: string;
  assignedEmployees: string[];
}

interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  type: 'scheduled' | 'repair' | 'upgrade' | 'replacement';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  technician: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

interface SystemDeployment {
  id: string;
  systemName: string;
  version: string;
  environment: 'development' | 'staging' | 'production' | 'testing';
  deploymentType: 'new_deployment' | 'update' | 'rollback' | 'hotfix';
  status: 'planned' | 'in_progress' | 'deployed' | 'failed' | 'rolled_back';
  scheduledTime: string;
  deployedTime?: string;
  deployedBy: string;
  affectedServices: string[];
  rollbackPlan: string;
  healthChecks: {
    check: string;
    status: 'passed' | 'failed' | 'pending';
    lastRun: string;
  }[];
  dependencies: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approver?: string;
}

interface SystemEnvironment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production' | 'testing';
  status: 'active' | 'maintenance' | 'inactive';
  currentVersion: string;
  lastDeployment: string;
  uptime: number;
  healthScore: number;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  services: {
    name: string;
    status: 'running' | 'stopped' | 'error';
    version: string;
  }[];
}

interface NewAssetForm {
  name: string;
  category: 'laptop' | 'desktop' | 'monitor' | 'phone' | 'tablet' | 'server' | 'network';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: string;
  warrantyExpiry: string;
  location: string;
  assignedTo: string;
  status: 'active' | 'maintenance' | 'retired' | 'lost' | 'available';
  specifications: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    graphics?: string;
    network?: string;
    os?: string;
    color?: string;
    size?: string;
    ports?: string;
  };
  notes: string;
}

interface NewSoftwareLicenseForm {
  name: string;
  vendor: string;
  licenseType: 'subscription' | 'perpetual' | 'volume';
  totalLicenses: string;
  costPerLicense: string;
  renewalDate: string;
  description: string;
  licenseKey: string;
  supportLevel: string;
  maxInstallations: string;
}

export default function ITAssetManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hardware' | 'software' | 'maintenance' | 'deployment' | 'asset-series'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [showAddLicenseDialog, setShowAddLicenseDialog] = useState(false);
  const [isDialogMaximized, setIsDialogMaximized] = useState(false);
  const [newAsset, setNewAsset] = useState<NewAssetForm>({
    name: '',
    category: 'laptop',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyExpiry: '',
    location: '',
    assignedTo: 'unassigned',
    status: 'available',
    specifications: {},
    notes: ''
  });
  const [newLicense, setNewLicense] = useState<NewSoftwareLicenseForm>({
    name: '',
    vendor: '',
    licenseType: 'subscription',
    totalLicenses: '',
    costPerLicense: '',
    renewalDate: '',
    description: '',
    licenseKey: '',
    supportLevel: 'standard',
    maxInstallations: ''
  });

  // Asset ID Series Management
  const [assetSeries, setAssetSeries] = useState([
    {
      id: 'SERIES001',
      name: 'Laptop Series',
      prefix: 'LAP',
      category: 'laptop',
      currentNumber: 1001,
      startNumber: 1001,
      format: 'LAP-{YYYY}-{####}',
      description: 'Standard laptop asset numbering',
      isActive: true,
      createdDate: '2024-01-01',
      totalGenerated: 15
    },
    {
      id: 'SERIES002', 
      name: 'Desktop Series',
      prefix: 'DSK',
      category: 'desktop',
      currentNumber: 2001,
      startNumber: 2001,
      format: 'DSK-{YYYY}-{####}',
      description: 'Desktop computer asset numbering',
      isActive: true,
      createdDate: '2024-01-01',
      totalGenerated: 8
    },
    {
      id: 'SERIES003',
      name: 'Mobile Device Series', 
      prefix: 'MOB',
      category: 'phone',
      currentNumber: 3001,
      startNumber: 3001,
      format: 'MOB-{YYYY}-{####}',
      description: 'Mobile devices and tablets',
      isActive: true,
      createdDate: '2024-01-01',
      totalGenerated: 22
    },
    {
      id: 'SERIES004',
      name: 'Server Series',
      prefix: 'SRV',
      category: 'server',
      currentNumber: 5001,
      startNumber: 5001,
      format: 'SRV-{YYYY}-{####}',
      description: 'Server and infrastructure equipment',
      isActive: true,
      createdDate: '2024-01-01',
      totalGenerated: 5
    }
  ]);

  const [showAddSeriesDialog, setShowAddSeriesDialog] = useState(false);
  const [newAssetSeries, setNewAssetSeries] = useState({
    name: '',
    prefix: '',
    category: 'laptop',
    startNumber: '1001',
    format: '{PREFIX}-{YYYY}-{####}',
    description: ''
  });

  /**
   * Comprehensive brand list by category
   */
  const brandsByCategory = {
    laptop: [
      'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer', 'Microsoft Surface', 
      'Samsung', 'LG', 'Alienware', 'ThinkPad', 'MacBook', 'Chromebook', 'Toshiba', 
      'Sony VAIO', 'Huawei', 'Xiaomi', 'Framework', 'System76', 'Clevo', 'Origin PC', 
      'Sager', 'Gigabyte', 'Zephyrus', 'ROG', 'Predator', 'Pavilion', 'Inspiron', 
      'XPS', 'Latitude', 'Precision', 'EliteBook', 'ProBook', 'Spectre', 'Envy'
    ],
    desktop: [
      'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Apple iMac', 'Alienware', 
      'Origin PC', 'Corsair', 'NZXT', 'CyberPowerPC', 'iBuyPower', 'Falcon Northwest', 
      'Digital Storm', 'Maingear', 'Velocity Micro', 'Custom Built', 'Intel NUC', 
      'ZOTAC', 'Gigabyte BRIX', 'ASUS Mini PC', 'HP Elite', 'Dell OptiPlex', 
      'Lenovo ThinkCentre', 'Acer Veriton', 'Gateway', 'Compaq', 'eMachines',
      'Shuttle', 'ASRock', 'Biostar', 'ECS', 'Foxconn'
    ],
    monitor: [
      'Dell', 'HP', 'ASUS', 'Acer', 'LG', 'Samsung', 'BenQ', 'AOC', 'ViewSonic', 
      'MSI', 'Alienware', 'Apple Studio Display', 'Apple Pro Display XDR', 'EIZO', 
      'NEC', 'Philips', 'Sony', 'Lenovo', 'Corsair', 'Razer', 'Gigabyte', 
      'Cooler Master', 'Monoprice', 'Sceptre', 'VIOTEK', 'Pixio', 'Westinghouse', 
      'Planar', 'Iiyama', 'HKC', 'KOORUI', 'CRUA', 'KTC', 'Deco Gear', 
      'PRISM+', 'Xiaomi', 'Huawei', 'TCL', 'Hisense'
    ],
    phone: [
      'Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus', 'Xiaomi', 
      'Huawei', 'Oppo', 'Vivo', 'Realme', 'Nothing', 'Motorola', 'Nokia', 
      'Sony Xperia', 'Asus ROG Phone', 'RedMagic', 'Black Shark', 'Honor', 
      'TCL', 'Alcatel', 'Fairphone', 'CAT', 'Rugged', 'Sonim', 'Kyocera', 
      'Blackview', 'Ulefone', 'Doogee', 'Oukitel', 'AGM', 'Cubot', 
      'Umidigi', 'Blu', 'ZTE', 'Coolpad', 'Meizu'
    ],
    tablet: [
      'Apple iPad', 'Samsung Galaxy Tab', 'Microsoft Surface', 'Amazon Fire', 
      'Google Pixel Tablet', 'Lenovo Tab', 'Huawei MatePad', 'Xiaomi Pad', 
      'ASUS ZenPad', 'Acer Iconia', 'HP Elite x2', 'Dell Latitude', 
      'Sony Xperia Tablet', 'Nokia T20', 'TCL Tab', 'Alcatel', 'Blackview', 
      'Teclast', 'Chuwi', 'Alldocube', 'Winnovo', 'Dragon Touch', 
      'VASOUN', 'PRITOM', 'Contixo', 'VANKYO', 'YESTEL', 'YELLYOUTH'
    ],
    server: [
      'Dell PowerEdge', 'HP ProLiant', 'HPE Apollo', 'Lenovo ThinkSystem', 
      'IBM Power Systems', 'Cisco UCS', 'Supermicro', 'Fujitsu PRIMERGY', 
      'Huawei FusionServer', 'Inspur', 'Oracle', 'Intel', 'ASUS ESC', 
      'MSI Server', 'Gigabyte', 'ASRock Rack', 'Tyan', 'Quanta', 
      'Wistron', 'Inventec', 'Foxconn', 'ZT Systems', 'Silicon Mechanics', 
      'Penguin Computing', 'Boston Limited', 'Thomas-Krenn', 'Broadberry'
    ],
    network: [
      'Cisco', 'Juniper', 'Aruba', 'Ubiquiti', 'Netgear', 'TP-Link', 'D-Link', 
      'Linksys', 'ASUS', 'Fortinet', 'Palo Alto Networks', 'SonicWall', 
      'Meraki', 'Ruckus', 'Extreme Networks', 'Allied Telesis', 'Brocade', 
      'F5 Networks', 'Riverbed', 'Silver Peak', 'Peplink', 'MikroTik', 
      'EdgeRouter', 'UniFi', 'Engenius', 'ZyXEL', 'Cambium Networks', 
      'Grandstream', 'Yealink', 'Polycom', 'Jabra', 'Plantronics', 
      'Avaya', 'Mitel', 'Panasonic', '3Com', 'SMC', 'Buffalo'
    ]
  };

  /**
   * Get brands for selected category
   */
  const getBrandsForCategory = (category: string) => {
    return brandsByCategory[category as keyof typeof brandsByCategory] || [];
  };

  /**
   * Get brand icon based on brand name
   */
  const getBrandIcon = (brand: string) => {
    const brandIcons: Record<string, string> = {
      'Apple': '🍎', 'Dell': '💻', 'HP': '🖥️', 'Lenovo': '💼', 'ASUS': '⚡',
      'Samsung': '📱', 'Microsoft': '🪟', 'Google': '🔍', 'Cisco': '🌐',
      'Intel': '⚙️', 'AMD': '🔥', 'NVIDIA': '🎮', 'Acer': '💫', 'MSI': '🎯',
      'Razer': '🐍', 'Alienware': '👽', 'Sony': '🎵', 'LG': '📺', 'BenQ': '🖼️',
      'Huawei': '📡', 'Xiaomi': '🔋', 'OnePlus': '⚡', 'Nokia': '📞'
    };
    return brandIcons[brand] || '🏢';
  };

  /**
   * Mock hardware assets
   */
  const assets: Asset[] = [
    {
      id: 'ASSET001',
      name: 'MacBook Pro 16"',
      category: 'laptop',
      brand: 'Apple',
      model: 'MacBook Pro 16-inch (2023)',
      serialNumber: 'C02Z71XJMD6T',
      purchaseDate: '2023-06-15',
      purchasePrice: 2899,
      currentValue: 2320,
      status: 'active',
      assignedTo: 'EMP001',
      assignedEmployee: 'Sarah Johnson',
      location: 'Engineering Department',
      warrantyExpiry: '2026-06-15',
      specifications: {
        'Processor': 'Apple M2 Pro',
        'RAM': '32GB',
        'Storage': '1TB SSD',
        'Display': '16.2-inch Liquid Retina XDR'
      }
    },
    {
      id: 'ASSET002',
      name: 'Dell UltraSharp Monitor',
      category: 'monitor',
      brand: 'Dell',
      model: 'U2723QE',
      serialNumber: 'CN0H7G5K7380155C',
      purchaseDate: '2023-08-20',
      purchasePrice: 649,
      currentValue: 520,
      status: 'active',
      assignedTo: 'EMP002',
      assignedEmployee: 'Michael Rodriguez',
      location: 'Marketing Department',
      warrantyExpiry: '2026-08-20',
      specifications: {
        'Size': '27 inches',
        'Resolution': '4K UHD (3840 x 2160)',
        'Panel Type': 'IPS',
        'Refresh Rate': '60Hz'
      }
    },
    {
      id: 'ASSET003',
      name: 'iPhone 15 Pro',
      category: 'phone',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      serialNumber: 'F4LJN2XTDC',
      purchaseDate: '2023-09-22',
      purchasePrice: 999,
      currentValue: 850,
      status: 'active',
      assignedTo: 'EMP003',
      assignedEmployee: 'Emily Chen',
      location: 'HR Department',
      warrantyExpiry: '2024-09-22',
      specifications: {
        'Storage': '256GB',
        'Color': 'Space Black',
        'Carrier': 'Unlocked',
        'Screen Size': '6.1 inches'
      }
    },
    {
      id: 'ASSET004',
      name: 'HP EliteDesk 800',
      category: 'desktop',
      brand: 'HP',
      model: 'EliteDesk 800 G9',
      serialNumber: '8CG34567AB',
      purchaseDate: '2023-05-10',
      purchasePrice: 1299,
      currentValue: 975,
      status: 'maintenance',
      assignedTo: 'EMP004',
      assignedEmployee: 'James Wilson',
      location: 'Finance Department',
      warrantyExpiry: '2026-05-10',
      specifications: {
        'Processor': 'Intel Core i7-12700',
        'RAM': '16GB DDR4',
        'Storage': '512GB SSD',
        'Graphics': 'Intel UHD Graphics 770'
      }
    },
    {
      id: 'ASSET005',
      name: 'Dell Server',
      category: 'server',
      brand: 'Dell',
      model: 'PowerEdge R750',
      serialNumber: 'DKXS123',
      purchaseDate: '2023-01-15',
      purchasePrice: 8500,
      currentValue: 7225,
      status: 'active',
      location: 'Data Center',
      warrantyExpiry: '2026-01-15',
      specifications: {
        'Processor': '2x Intel Xeon Silver 4314',
        'RAM': '128GB DDR4',
        'Storage': '4x 2TB SSD',
        'Network': '4x 1GbE + 2x 10GbE'
      }
    }
  ];

  /**
   * Mock system deployments
   */
  const systemDeployments: SystemDeployment[] = [
    {
      id: 'DEP001',
      systemName: 'HR Management System',
      version: 'v2.3.1',
      environment: 'production',
      deploymentType: 'update',
      status: 'deployed',
      scheduledTime: '2024-02-05T02:00:00Z',
      deployedTime: '2024-02-05T02:15:00Z',
      deployedBy: 'DevOps Team',
      affectedServices: ['API Gateway', 'Database', 'Frontend'],
      rollbackPlan: 'Automated rollback to v2.3.0 available',
      healthChecks: [
        { check: 'API Health', status: 'passed', lastRun: '2024-02-05T03:00:00Z' },
        { check: 'Database Connection', status: 'passed', lastRun: '2024-02-05T03:00:00Z' },
        { check: 'Frontend Load', status: 'passed', lastRun: '2024-02-05T03:00:00Z' }
      ],
      dependencies: ['Database Migration', 'Cache Refresh'],
      approvalStatus: 'approved',
      approver: 'IT Director'
    },
    {
      id: 'DEP002',
      systemName: 'Payroll System',
      version: 'v1.8.2',
      environment: 'staging',
      deploymentType: 'new_deployment',
      status: 'in_progress',
      scheduledTime: '2024-02-06T01:30:00Z',
      deployedBy: 'Backend Team',
      affectedServices: ['Payroll API', 'Tax Calculator', 'Report Generator'],
      rollbackPlan: 'Manual rollback required - 30 minutes estimated',
      healthChecks: [
        { check: 'Service Startup', status: 'pending', lastRun: '2024-02-06T01:30:00Z' },
        { check: 'Database Seeding', status: 'pending', lastRun: '2024-02-06T01:30:00Z' }
      ],
      dependencies: ['Environment Setup', 'SSL Certificate'],
      approvalStatus: 'approved',
      approver: 'Security Team'
    },
    {
      id: 'DEP003',
      systemName: 'Asset Management',
      version: 'v3.1.0',
      environment: 'development',
      deploymentType: 'hotfix',
      status: 'planned',
      scheduledTime: '2024-02-06T14:00:00Z',
      deployedBy: 'Engineering Team',
      affectedServices: ['Asset API', 'Inventory Service'],
      rollbackPlan: 'Git revert to previous commit',
      healthChecks: [
        { check: 'Unit Tests', status: 'passed', lastRun: '2024-02-05T16:45:00Z' },
        { check: 'Integration Tests', status: 'passed', lastRun: '2024-02-05T16:50:00Z' }
      ],
      dependencies: ['Code Review', 'Security Scan'],
      approvalStatus: 'pending'
    }
  ];

  /**
   * Mock system environments
   */
  const systemEnvironments: SystemEnvironment[] = [
    {
      id: 'ENV001',
      name: 'Production Environment',
      type: 'production',
      status: 'active',
      currentVersion: 'v2.3.1',
      lastDeployment: '2024-02-05T02:15:00Z',
      uptime: 99.9,
      healthScore: 98,
      resources: {
        cpu: 65,
        memory: 72,
        storage: 45,
        network: 38
      },
      services: [
        { name: 'Web Server', status: 'running', version: 'v2.3.1' },
        { name: 'API Gateway', status: 'running', version: 'v2.3.1' },
        { name: 'Database', status: 'running', version: 'v2.3.1' },
        { name: 'Cache Service', status: 'running', version: 'v2.3.1' }
      ]
    },
    {
      id: 'ENV002',
      name: 'Staging Environment',
      type: 'staging',
      status: 'active',
      currentVersion: 'v1.8.2',
      lastDeployment: '2024-02-06T01:30:00Z',
      uptime: 95.2,
      healthScore: 92,
      resources: {
        cpu: 45,
        memory: 58,
        storage: 62,
        network: 25
      },
      services: [
        { name: 'Payroll API', status: 'running', version: 'v1.8.2' },
        { name: 'Tax Calculator', status: 'running', version: 'v1.8.2' },
        { name: 'Report Generator', status: 'error', version: 'v1.8.1' }
      ]
    },
    {
      id: 'ENV003',
      name: 'Development Environment',
      type: 'development',
      status: 'maintenance',
      currentVersion: 'v3.1.0-dev',
      lastDeployment: '2024-02-05T10:20:00Z',
      uptime: 87.5,
      healthScore: 85,
      resources: {
        cpu: 78,
        memory: 82,
        storage: 35,
        network: 55
      },
      services: [
        { name: 'Asset API', status: 'stopped', version: 'v3.1.0-dev' },
        { name: 'Inventory Service', status: 'running', version: 'v3.1.0-dev' }
      ]
    }
  ];

  /**
   * Software licenses
   */
  const softwareLicenses: SoftwareLicense[] = [
    {
      id: 'LIC001',
      name: 'Microsoft 365 Business Premium',
      vendor: 'Microsoft',
      licenseType: 'subscription',
      totalLicenses: 300,
      usedLicenses: 285,
      availableLicenses: 15,
      costPerLicense: 22,
      renewalDate: '2024-12-31',
      assignedEmployees: ['EMP001', 'EMP002', 'EMP003']
    },
    {
      id: 'LIC002',
      name: 'Adobe Creative Cloud',
      vendor: 'Adobe',
      licenseType: 'subscription',
      totalLicenses: 50,
      usedLicenses: 42,
      availableLicenses: 8,
      costPerLicense: 54.99,
      renewalDate: '2024-08-15',
      assignedEmployees: ['EMP002', 'EMP005']
    },
    {
      id: 'LIC003',
      name: 'JetBrains IntelliJ IDEA',
      vendor: 'JetBrains',
      licenseType: 'subscription',
      totalLicenses: 95,
      usedLicenses: 88,
      availableLicenses: 7,
      costPerLicense: 169,
      renewalDate: '2024-06-30',
      assignedEmployees: ['EMP001', 'EMP006']
    },
    {
      id: 'LIC004',
      name: 'Slack Pro',
      vendor: 'Salesforce',
      licenseType: 'subscription',
      totalLicenses: 320,
      usedLicenses: 298,
      availableLicenses: 22,
      costPerLicense: 7.25,
      renewalDate: '2024-11-20',
      assignedEmployees: ['EMP001', 'EMP002', 'EMP003', 'EMP004']
    }
  ];

  /**
   * Maintenance records
   */
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: 'MAINT001',
      assetId: 'ASSET004',
      assetName: 'HP EliteDesk 800',
      type: 'repair',
      description: 'Hard drive replacement due to failure',
      scheduledDate: '2024-02-05',
      cost: 150,
      technician: 'John Tech',
      status: 'in-progress'
    },
    {
      id: 'MAINT002',
      assetId: 'ASSET005',
      assetName: 'Dell Server',
      type: 'scheduled',
      description: 'Monthly maintenance and updates',
      scheduledDate: '2024-02-10',
      cost: 0,
      technician: 'System Admin',
      status: 'pending'
    },
    {
      id: 'MAINT003',
      assetId: 'ASSET001',
      assetName: 'MacBook Pro 16"',
      type: 'upgrade',
      description: 'RAM upgrade to 64GB',
      scheduledDate: '2024-01-28',
      completedDate: '2024-01-28',
      cost: 800,
      technician: 'Apple Certified Tech',
      status: 'completed'
    }
  ];

  /**
   * Get asset category icon and theme
   */
  const getAssetTheme = (category: string) => {
    switch (category) {
      case 'laptop': return { icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'desktop': return { icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' };
      case 'monitor': return { icon: Monitor, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' };
      case 'phone': return { icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' };
      case 'server': return { icon: HardDrive, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900' };
      case 'network': return { icon: Wifi, color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900' };
      default: return { icon: Monitor, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' };
    }
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'retired': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'available': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'deployed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planned': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'rolled_back': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'stopped': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Get category theme for environments and deployments
   */
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'production': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900' };
      case 'staging': return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' };
      case 'development': return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'testing': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' };
      case 'hardware': return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' };
      case 'software': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' };
      case 'network': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' };
      case 'security': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' };
    }
  };

  /**
   * Handle asset form submission
   */
  const handleAddAsset = async () => {
    try {
      const assetData: Partial<Asset> = {
        name: newAsset.name,
        category: newAsset.category as any,
        brand: newAsset.brand,
        model: newAsset.model,
        serialNumber: newAsset.serialNumber,
        purchaseDate: newAsset.purchaseDate,
        purchasePrice: parseFloat(newAsset.purchasePrice),
        currentValue: parseFloat(newAsset.purchasePrice), // Initial value equals purchase price
        warrantyExpiry: newAsset.warrantyExpiry,
        location: newAsset.location,
        assignedTo: newAsset.assignedTo !== 'unassigned' ? newAsset.assignedTo : undefined,
        assignedEmployee: newAsset.assignedTo !== 'unassigned' ? getEmployeeName(newAsset.assignedTo) : undefined,
        status: newAsset.status as any,
        specifications: newAsset.specifications
      };

      // Here you would call the API to create the asset
      console.log('Creating new asset:', assetData);
      
      // Reset form and close dialog
      setNewAsset({
        name: '',
        category: 'laptop',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        purchasePrice: '',
        warrantyExpiry: '',
        location: '',
        assignedTo: 'unassigned',
        status: 'available',
        specifications: {},
        notes: ''
      });
      setShowAddAssetDialog(false);
      
      // Show success message
      alert('Asset added successfully!');
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Error adding asset. Please try again.');
    }
  };

  /**
   * Handle license form submission
   */
  const handleAddLicense = async () => {
    try {
      const licenseData: Partial<SoftwareLicense> = {
        name: newLicense.name,
        vendor: newLicense.vendor,
        licenseType: newLicense.licenseType as any,
        totalLicenses: parseInt(newLicense.totalLicenses),
        usedLicenses: 0, // Start with 0 used licenses
        availableLicenses: parseInt(newLicense.totalLicenses),
        costPerLicense: parseFloat(newLicense.costPerLicense),
        renewalDate: newLicense.renewalDate,
        assignedEmployees: []
      };

      // Here you would call the API to create the license
      console.log('Creating new license:', licenseData);
      
      // Reset form and close dialog
      setNewLicense({
        name: '',
        vendor: '',
        licenseType: 'subscription',
        totalLicenses: '',
        costPerLicense: '',
        renewalDate: '',
        description: '',
        licenseKey: '',
        supportLevel: 'standard',
        maxInstallations: ''
      });
      setShowAddLicenseDialog(false);
      
      // Show success message
      alert('Software license added successfully!');
    } catch (error) {
      console.error('Error adding license:', error);
      alert('Error adding license. Please try again.');
    }
  };

  /**
   * Get employee name from ID (mock function)
   */
  const getEmployeeName = (employeeId: string) => {
    const employees = [
      { id: 'EMP001', name: 'Sarah Johnson' },
      { id: 'EMP002', name: 'Michael Rodriguez' },
      { id: 'EMP003', name: 'Emily Chen' },
      { id: 'EMP004', name: 'James Wilson' },
      { id: 'EMP005', name: 'Lisa Anderson' },
      { id: 'EMP006', name: 'David Thompson' }
    ];
    return employees.find(emp => emp.id === employeeId)?.name || '';
  };

  /**
   * Generate auto serial number
   */
  const generateSerialNumber = () => {
    const prefix = newAsset.category.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  /**
   * Generate Asset ID from series
   */
  const generateAssetIdFromSeries = (category: string) => {
    const series = assetSeries.find(s => s.category === category && s.isActive);
    if (!series) {
      return generateSerialNumber(); // Fallback to old method
    }

    const year = new Date().getFullYear();
    const paddedNumber = series.currentNumber.toString().padStart(4, '0');
    
    let assetId = series.format
      .replace('{PREFIX}', series.prefix)
      .replace('{YYYY}', year.toString())
      .replace('{####}', paddedNumber);

    // Update the series current number
    setAssetSeries(prev => prev.map(s => 
      s.id === series.id 
        ? { ...s, currentNumber: s.currentNumber + 1, totalGenerated: s.totalGenerated + 1 }
        : s
    ));

    return assetId;
  };

  /**
   * Handle adding new asset series
   */
  const handleAddAssetSeries = () => {
    const newSeries = {
      id: `SERIES${Date.now()}`,
      name: newAssetSeries.name,
      prefix: newAssetSeries.prefix.toUpperCase(),
      category: newAssetSeries.category,
      currentNumber: parseInt(newAssetSeries.startNumber),
      startNumber: parseInt(newAssetSeries.startNumber),
      format: newAssetSeries.format,
      description: newAssetSeries.description,
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0],
      totalGenerated: 0
    };

    setAssetSeries(prev => [...prev, newSeries]);
    setNewAssetSeries({
      name: '',
      prefix: '',
      category: 'laptop',
      startNumber: '1001',
      format: '{PREFIX}-{YYYY}-{####}',
      description: ''
    });
    setShowAddSeriesDialog(false);
  };

  /**
   * Generate next asset ID for preview
   */
  const previewNextAssetId = (seriesId: string) => {
    const series = assetSeries.find(s => s.id === seriesId);
    if (!series) return '';

    const year = new Date().getFullYear();
    const paddedNumber = series.currentNumber.toString().padStart(4, '0');
    
    return series.format
      .replace('{PREFIX}', series.prefix)
      .replace('{YYYY}', year.toString())
      .replace('{####}', paddedNumber);
  };

  /**
   * Calculate depreciation
   */
  const calculateDepreciation = (asset: Asset) => {
    const ageInMonths = Math.floor((new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
    const depreciationRate = 0.05; // 5% per month
    const depreciation = Math.min(asset.purchasePrice * depreciationRate * ageInMonths, asset.purchasePrice * 0.8);
    return asset.purchasePrice - depreciation;
  };

  /**
   * Filter assets
   */
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignedEmployee?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Calculate asset statistics
   */
  const assetStats = {
    totalAssets: assets.length,
    totalValue: assets.reduce((sum, asset) => sum + asset.currentValue, 0),
    activeAssets: assets.filter(a => a.status === 'active').length,
    maintenanceAssets: assets.filter(a => a.status === 'maintenance').length,
    avgDepreciation: assets.reduce((sum, asset) => sum + ((asset.purchasePrice - asset.currentValue) / asset.purchasePrice), 0) / assets.length * 100
  };

  const licenseStats = {
    totalLicenses: softwareLicenses.reduce((sum, license) => sum + license.totalLicenses, 0),
    usedLicenses: softwareLicenses.reduce((sum, license) => sum + license.usedLicenses, 0),
    totalCost: softwareLicenses.reduce((sum, license) => sum + (license.totalLicenses * license.costPerLicense), 0),
    utilizationRate: (softwareLicenses.reduce((sum, license) => sum + license.usedLicenses, 0) / softwareLicenses.reduce((sum, license) => sum + license.totalLicenses, 0)) * 100
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IT Asset Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage hardware, software, and IT infrastructure</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="hardware">Hardware Assets</TabsTrigger>
            <TabsTrigger value="software">Software Licenses</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="deployment">System Deployment</TabsTrigger>
            <TabsTrigger value="asset-series">Asset ID Series</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{assetStats.totalAssets}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${assetStats.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <HardDrive className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Software Licenses</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{licenseStats.totalLicenses}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance Items</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{assetStats.maintenanceAssets}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Edit className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asset Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {['laptop', 'desktop', 'monitor', 'phone', 'server', 'network'].map((category) => {
                    const count = assets.filter(a => a.category === category).length;
                    const theme = getAssetTheme(category);
                    return (
                      <div key={category} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${theme.bg}`}>
                          <theme.icon className={`w-6 h-6 ${theme.color}`} />
                        </div>
                        <p className="font-bold text-lg">{count}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{category}s</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* License Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Software License Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {softwareLicenses.slice(0, 4).map((license) => (
                    <div key={license.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{license.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {license.usedLicenses} / {license.totalLicenses}
                        </span>
                      </div>
                      <Progress value={(license.usedLicenses / license.totalLicenses) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hardware Assets Tab */}
          <TabsContent value="hardware" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Hardware Assets</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assets..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Asset
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`${isDialogMaximized ? 'max-w-full max-h-full w-screen h-screen' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
                    <DialogHeader>
                      <div className="flex items-center justify-between">
                        <DialogTitle>Add New IT Asset</DialogTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsDialogMaximized(!isDialogMaximized)}
                        >
                          {isDialogMaximized ? (
                            <Minimize2 className="w-4 h-4" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="asset-name">Asset Name *</Label>
                          <Input
                            id="asset-name"
                            placeholder="e.g., MacBook Pro 16-inch"
                            value={newAsset.name}
                            onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-category">Category *</Label>
                          <Select value={newAsset.category} onValueChange={(value) => setNewAsset({...newAsset, category: value as any})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="laptop">
                                <div className="flex items-center">
                                  <Laptop className="w-4 h-4 mr-2" />
                                  Laptop
                                </div>
                              </SelectItem>
                              <SelectItem value="desktop">
                                <div className="flex items-center">
                                  <Monitor className="w-4 h-4 mr-2" />
                                  Desktop
                                </div>
                              </SelectItem>
                              <SelectItem value="monitor">
                                <div className="flex items-center">
                                  <Monitor className="w-4 h-4 mr-2" />
                                  Monitor
                                </div>
                              </SelectItem>
                              <SelectItem value="phone">
                                <div className="flex items-center">
                                  <Smartphone className="w-4 h-4 mr-2" />
                                  Phone
                                </div>
                              </SelectItem>
                              <SelectItem value="tablet">
                                <div className="flex items-center">
                                  <Smartphone className="w-4 h-4 mr-2" />
                                  Tablet
                                </div>
                              </SelectItem>
                              <SelectItem value="server">
                                <div className="flex items-center">
                                  <HardDrive className="w-4 h-4 mr-2" />
                                  Server
                                </div>
                              </SelectItem>
                              <SelectItem value="network">
                                <div className="flex items-center">
                                  <Wifi className="w-4 h-4 mr-2" />
                                  Network Equipment
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="asset-brand">Brand *</Label>
                            <div className="relative">
                              <Select 
                                value={newAsset.brand} 
                                onValueChange={(value) => setNewAsset({...newAsset, brand: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select brand" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[400px] overflow-y-auto">
                                  {/* Search hint */}
                                  <div className="px-2 py-1 text-xs text-gray-400 italic border-b">
                                    💡 Start typing to search brands...
                                  </div>
                                  
                                  {/* Top Tier Brands */}
                                  <div className="px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border-b bg-blue-50 dark:bg-blue-900/20">
                                    🌟 Premium Brands
                                  </div>
                                  <SelectItem value="Apple">{getBrandIcon('Apple')} Apple</SelectItem>
                                  <SelectItem value="Dell">{getBrandIcon('Dell')} Dell</SelectItem>
                                  <SelectItem value="HP">{getBrandIcon('HP')} HP</SelectItem>
                                  <SelectItem value="Lenovo">{getBrandIcon('Lenovo')} Lenovo</SelectItem>
                                  <SelectItem value="Microsoft Surface">{getBrandIcon('Microsoft')} Microsoft Surface</SelectItem>
                                  <SelectItem value="Samsung">{getBrandIcon('Samsung')} Samsung</SelectItem>
                                  <SelectItem value="Google Pixel">{getBrandIcon('Google')} Google Pixel</SelectItem>
                                  <SelectItem value="Cisco">{getBrandIcon('Cisco')} Cisco</SelectItem>
                                  
                                  {/* Category-specific brands */}
                                  {newAsset.category && getBrandsForCategory(newAsset.category).length > 0 && (
                                    <>
                                      <div className="px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-400 border-b border-t mt-1 bg-green-50 dark:bg-green-900/20">
                                        📂 {newAsset.category.charAt(0).toUpperCase() + newAsset.category.slice(1)} Specialists
                                      </div>
                                      {getBrandsForCategory(newAsset.category)
                                        .filter(brand => !['Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft Surface', 'Samsung', 'Google Pixel', 'Cisco'].includes(brand))
                                        .sort()
                                        .slice(0, 15) // Show top 15 category brands
                                        .map((brand) => (
                                          <SelectItem key={`cat-${brand}`} value={brand}>
                                            {getBrandIcon(brand)} {brand}
                                          </SelectItem>
                                        ))
                                      }
                                    </>
                                  )}
                                  
                                  {/* Gaming/Performance Brands */}
                                  {(newAsset.category === 'laptop' || newAsset.category === 'desktop') && (
                                    <>
                                      <div className="px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 border-b border-t mt-1 bg-red-50 dark:bg-red-900/20">
                                        🎮 Gaming & Performance
                                      </div>
                                      <SelectItem value="ASUS ROG">⚡ ASUS ROG</SelectItem>
                                      <SelectItem value="MSI Gaming">🎯 MSI Gaming</SelectItem>
                                      <SelectItem value="Razer">🐍 Razer</SelectItem>
                                      <SelectItem value="Alienware">👽 Alienware</SelectItem>
                                      <SelectItem value="Origin PC">🔥 Origin PC</SelectItem>
                                      <SelectItem value="Corsair">⚔️ Corsair</SelectItem>
                                    </>
                                  )}
                                  
                                  {/* Mobile Brands */}
                                  {(newAsset.category === 'phone' || newAsset.category === 'tablet') && (
                                    <>
                                      <div className="px-2 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 border-b border-t mt-1 bg-purple-50 dark:bg-purple-900/20">
                                        📱 Mobile Leaders
                                      </div>
                                      <SelectItem value="Apple iPhone">🍎 Apple iPhone</SelectItem>
                                      <SelectItem value="Samsung Galaxy">📱 Samsung Galaxy</SelectItem>
                                      <SelectItem value="Google Pixel">🔍 Google Pixel</SelectItem>
                                      <SelectItem value="OnePlus">⚡ OnePlus</SelectItem>
                                      <SelectItem value="Xiaomi">🔋 Xiaomi</SelectItem>
                                      <SelectItem value="Huawei">📡 Huawei</SelectItem>
                                    </>
                                  )}
                                  
                                  {/* Server Brands */}
                                  {newAsset.category === 'server' && (
                                    <>
                                      <div className="px-2 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 border-b border-t mt-1 bg-orange-50 dark:bg-orange-900/20">
                                        🖥️ Enterprise Servers
                                      </div>
                                      <SelectItem value="Dell PowerEdge">💻 Dell PowerEdge</SelectItem>
                                      <SelectItem value="HP ProLiant">🖥️ HP ProLiant</SelectItem>
                                      <SelectItem value="HPE Apollo">⚡ HPE Apollo</SelectItem>
                                      <SelectItem value="Lenovo ThinkSystem">💼 Lenovo ThinkSystem</SelectItem>
                                      <SelectItem value="Supermicro">🔧 Supermicro</SelectItem>
                                      <SelectItem value="IBM Power Systems">🏢 IBM Power Systems</SelectItem>
                                    </>
                                  )}
                                  
                                  {/* Network Brands */}
                                  {newAsset.category === 'network' && (
                                    <>
                                      <div className="px-2 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border-b border-t mt-1 bg-cyan-50 dark:bg-cyan-900/20">
                                        🌐 Network Leaders
                                      </div>
                                      <SelectItem value="Cisco">🌐 Cisco</SelectItem>
                                      <SelectItem value="Juniper">🔗 Juniper</SelectItem>
                                      <SelectItem value="Aruba">📡 Aruba</SelectItem>
                                      <SelectItem value="Ubiquiti">📶 Ubiquiti</SelectItem>
                                      <SelectItem value="Fortinet">🛡️ Fortinet</SelectItem>
                                      <SelectItem value="Palo Alto Networks">🔒 Palo Alto Networks</SelectItem>
                                    </>
                                  )}
                                  
                                  {/* Budget Brands */}
                                  <div className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-t mt-1 bg-gray-50 dark:bg-gray-900/20">
                                    💰 Budget Friendly
                                  </div>
                                  <SelectItem value="Acer">💫 Acer</SelectItem>
                                  <SelectItem value="TP-Link">🔗 TP-Link</SelectItem>
                                  <SelectItem value="Netgear">📶 Netgear</SelectItem>
                                  <SelectItem value="D-Link">🔄 D-Link</SelectItem>
                                  <SelectItem value="Refurbished">♻️ Refurbished</SelectItem>
                                  
                                  {/* All remaining brands */}
                                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-t mt-1">
                                    📋 All Other Brands
                                  </div>
                                  {[...new Set(Object.values(brandsByCategory).flat())]
                                    .filter(brand => 
                                      ![
                                        'Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft Surface', 'Samsung', 'Google Pixel', 'Cisco',
                                        'ASUS ROG', 'MSI Gaming', 'Razer', 'Alienware', 'Origin PC', 'Corsair',
                                        'Apple iPhone', 'Samsung Galaxy', 'OnePlus', 'Xiaomi', 'Huawei',
                                        'Dell PowerEdge', 'HP ProLiant', 'HPE Apollo', 'Lenovo ThinkSystem', 'Supermicro', 'IBM Power Systems',
                                        'Juniper', 'Aruba', 'Ubiquiti', 'Fortinet', 'Palo Alto Networks',
                                        'Acer', 'TP-Link', 'Netgear', 'D-Link', 'Refurbished'
                                      ].includes(brand)
                                    )
                                    .sort()
                                    .map((brand) => (
                                      <SelectItem key={`all-${brand}`} value={brand}>
                                        {getBrandIcon(brand)} {brand}
                                      </SelectItem>
                                    ))
                                  }
                                  
                                  {/* Custom brand option */}
                                  <div className="px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-b border-t mt-1 bg-indigo-50 dark:bg-indigo-900/20">
                                    ⚙️ Custom Options
                                  </div>
                                  <SelectItem value="Custom Brand">🔧 Custom / Other Brand</SelectItem>
                                  <SelectItem value="White Label">🏷️ White Label / OEM</SelectItem>
                                  <SelectItem value="Unknown">❓ Unknown Brand</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              {/* Custom brand input when "Custom Brand" is selected */}
                              {newAsset.brand === 'Custom Brand' && (
                                <div className="mt-2">
                                  <Input
                                    placeholder="Enter custom brand name"
                                    onChange={(e) => setNewAsset({...newAsset, brand: e.target.value})}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    💡 Enter the exact brand name for your asset
                                  </p>
                                </div>
                              )}
                              
                              {/* Show selected brand preview */}
                              {newAsset.brand && newAsset.brand !== 'Custom Brand' && (
                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                  Selected: {getBrandIcon(newAsset.brand)} {newAsset.brand}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="asset-model">Model *</Label>
                            <Input
                              id="asset-model"
                              placeholder="e.g., MacBook Pro 16-inch (2023)"
                              value={newAsset.model}
                              onChange={(e) => setNewAsset({...newAsset, model: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="asset-serial">Asset ID *</Label>
                            <div className="flex space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setNewAsset({...newAsset, serialNumber: generateAssetIdFromSeries(newAsset.category)})}
                              >
                                <Hash className="w-4 h-4 mr-1" />
                                Generate from Series
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setNewAsset({...newAsset, serialNumber: generateSerialNumber()})}
                              >
                                Generate Random
                              </Button>
                            </div>
                          </div>
                          <div className="relative">
                            <Input
                              id="asset-serial"
                              placeholder="Asset ID will be auto-generated"
                              value={newAsset.serialNumber}
                              readOnly={newAsset.serialNumber.includes('-')} // Lock series-generated IDs
                              onChange={(e) => setNewAsset({...newAsset, serialNumber: e.target.value})}
                              className={newAsset.serialNumber.includes('-') ? 'bg-gray-100 dark:bg-gray-800' : ''}
                            />
                            {newAsset.serialNumber.includes('-') && (
                              <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          {newAsset.category && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Next series ID for {newAsset.category}: {previewNextAssetId(assetSeries.find(s => s.category === newAsset.category)?.id || '')}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-status">Status *</Label>
                          <Select value={newAsset.status} onValueChange={(value) => setNewAsset({...newAsset, status: value as any})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Purchase & Assignment Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase & Assignment</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="asset-purchase-date">Purchase Date *</Label>
                            <Input
                              id="asset-purchase-date"
                              type="date"
                              value={newAsset.purchaseDate}
                              onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="asset-warranty">Warranty Expiry *</Label>
                            <Input
                              id="asset-warranty"
                              type="date"
                              value={newAsset.warrantyExpiry}
                              onChange={(e) => setNewAsset({...newAsset, warrantyExpiry: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-price">Purchase Price *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="asset-price"
                              type="number"
                              placeholder="0.00"
                              className="pl-10"
                              value={newAsset.purchasePrice}
                              onChange={(e) => setNewAsset({...newAsset, purchasePrice: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-location">Location *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="asset-location"
                              placeholder="e.g., Engineering Department"
                              className="pl-10"
                              value={newAsset.location}
                              onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-assigned">Assign to Employee</Label>
                          <Select value={newAsset.assignedTo} onValueChange={(value) => setNewAsset({...newAsset, assignedTo: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">No Assignment</SelectItem>
                              <SelectItem value="EMP001">Sarah Johnson - Engineering</SelectItem>
                              <SelectItem value="EMP002">Michael Rodriguez - Marketing</SelectItem>
                              <SelectItem value="EMP003">Emily Chen - HR</SelectItem>
                              <SelectItem value="EMP004">James Wilson - Finance</SelectItem>
                              <SelectItem value="EMP005">Lisa Anderson - Sales</SelectItem>
                              <SelectItem value="EMP006">David Thompson - IT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-3">
                          <Label>Specifications</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Processor"
                              value={newAsset.specifications.processor || ''}
                              onChange={(e) => setNewAsset({
                                ...newAsset,
                                specifications: {...newAsset.specifications, processor: e.target.value}
                              })}
                            />
                            <Input
                              placeholder="RAM"
                              value={newAsset.specifications.ram || ''}
                              onChange={(e) => setNewAsset({
                                ...newAsset,
                                specifications: {...newAsset.specifications, ram: e.target.value}
                              })}
                            />
                            <Input
                              placeholder="Storage"
                              value={newAsset.specifications.storage || ''}
                              onChange={(e) => setNewAsset({
                                ...newAsset,
                                specifications: {...newAsset.specifications, storage: e.target.value}
                              })}
                            />
                            <Input
                              placeholder="Display"
                              value={newAsset.specifications.display || ''}
                              onChange={(e) => setNewAsset({
                                ...newAsset,
                                specifications: {...newAsset.specifications, display: e.target.value}
                              })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="asset-notes">Notes</Label>
                          <Textarea
                            id="asset-notes"
                            placeholder="Additional notes about this asset..."
                            value={newAsset.notes}
                            onChange={(e) => setNewAsset({...newAsset, notes: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowAddAssetDialog(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleAddAsset}>
                        <Save className="w-4 h-4 mr-2" />
                        Add Asset
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => {
                const theme = getAssetTheme(asset.category);
                return (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg}`}>
                          <theme.icon className={`w-5 h-5 ${theme.color}`} />
                        </div>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{asset.brand} {asset.model}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p><strong>Serial:</strong> {asset.serialNumber}</p>
                          <p><strong>Assigned to:</strong> {asset.assignedEmployee || 'Unassigned'}</p>
                          <p><strong>Location:</strong> {asset.location}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Purchase Price:</span>
                          <span className="font-medium">${asset.purchasePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Current Value:</span>
                          <span className="font-medium">${asset.currentValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Warranty:</span>
                          <span className="font-medium">{new Date(asset.warrantyExpiry).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Software Licenses Tab */}
          <TabsContent value="software" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Software Licenses</h2>
              <Dialog open={showAddLicenseDialog} onOpenChange={setShowAddLicenseDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add License
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Software License</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-name">Software Name *</Label>
                        <Input
                          id="license-name"
                          placeholder="e.g., Microsoft 365 Business Premium"
                          value={newLicense.name}
                          onChange={(e) => setNewLicense({...newLicense, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-vendor">Vendor *</Label>
                        <Input
                          id="license-vendor"
                          placeholder="e.g., Microsoft"
                          value={newLicense.vendor}
                          onChange={(e) => setNewLicense({...newLicense, vendor: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-type">License Type *</Label>
                        <Select value={newLicense.licenseType} onValueChange={(value) => setNewLicense({...newLicense, licenseType: value as any})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subscription">Subscription</SelectItem>
                            <SelectItem value="perpetual">Perpetual</SelectItem>
                            <SelectItem value="volume">Volume License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-total">Total Licenses *</Label>
                        <Input
                          id="license-total"
                          type="number"
                          placeholder="e.g., 100"
                          value={newLicense.totalLicenses}
                          onChange={(e) => setNewLicense({...newLicense, totalLicenses: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-cost">Cost per License *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="license-cost"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            value={newLicense.costPerLicense}
                            onChange={(e) => setNewLicense({...newLicense, costPerLicense: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-renewal">Renewal Date *</Label>
                        <Input
                          id="license-renewal"
                          type="date"
                          value={newLicense.renewalDate}
                          onChange={(e) => setNewLicense({...newLicense, renewalDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-support">Support Level</Label>
                        <Select value={newLicense.supportLevel} onValueChange={(value) => setNewLicense({...newLicense, supportLevel: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Support</SelectItem>
                            <SelectItem value="standard">Standard Support</SelectItem>
                            <SelectItem value="premium">Premium Support</SelectItem>
                            <SelectItem value="enterprise">Enterprise Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-max">Max Installations</Label>
                        <Input
                          id="license-max"
                          type="number"
                          placeholder="e.g., 1"
                          value={newLicense.maxInstallations}
                          onChange={(e) => setNewLicense({...newLicense, maxInstallations: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license-key">License Key</Label>
                      <Input
                        id="license-key"
                        placeholder="Enter license key (optional)"
                        value={newLicense.licenseKey}
                        onChange={(e) => setNewLicense({...newLicense, licenseKey: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license-description">Description</Label>
                      <Textarea
                        id="license-description"
                        placeholder="Additional notes about this license..."
                        value={newLicense.description}
                        onChange={(e) => setNewLicense({...newLicense, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowAddLicenseDialog(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleAddLicense}>
                      <Save className="w-4 h-4 mr-2" />
                      Add License
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {softwareLicenses.map((license) => (
                <Card key={license.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">{license.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {license.vendor} • {license.licenseType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="font-bold text-2xl">{license.usedLicenses}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Used</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-2xl">{license.totalLicenses}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-2xl text-green-600">{license.availableLicenses}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">${license.costPerLicense}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Per License</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{new Date(license.renewalDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Renewal</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">License Utilization</span>
                        <span className="text-sm font-medium">
                          {Math.round((license.usedLicenses / license.totalLicenses) * 100)}%
                        </span>
                      </div>
                      <Progress value={(license.usedLicenses / license.totalLicenses) * 100} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* License Summary */}
            <Card>
              <CardHeader>
                <CardTitle>License Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{licenseStats.totalLicenses}</p>
                    <p className="text-sm text-blue-600">Total Licenses</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{licenseStats.usedLicenses}</p>
                    <p className="text-sm text-green-600">Used Licenses</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(licenseStats.utilizationRate)}%</p>
                    <p className="text-sm text-purple-600">Utilization Rate</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">${licenseStats.totalCost.toLocaleString()}</p>
                    <p className="text-sm text-orange-600">Annual Cost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Maintenance Records</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>

            <div className="space-y-4">
              {maintenanceRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{record.assetName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {record.type} • {record.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Technician: {record.technician}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{new Date(record.scheduledDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                        </div>
                        {record.completedDate && (
                          <div className="text-right">
                            <p className="font-medium">{new Date(record.completedDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="font-medium">${record.cost}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Cost</p>
                        </div>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* System Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">System Deployment Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Deployment
              </Button>
            </div>

            {/* Environment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {systemEnvironments.map((env) => (
                <Card key={env.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{env.name}</CardTitle>
                      <Badge className={getStatusColor(env.status)}>
                        {env.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Version: {env.currentVersion}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Health Score */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Health Score</span>
                          <span className="text-sm font-medium">{env.healthScore}%</span>
                        </div>
                        <Progress value={env.healthScore} />
                      </div>

                      {/* Uptime */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Uptime</span>
                          <span className="text-sm font-medium">{env.uptime}%</span>
                        </div>
                        <Progress value={env.uptime} />
                      </div>

                      {/* Resource Usage */}
                      <div>
                        <p className="text-sm font-medium mb-2">Resource Usage</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span>CPU: {env.resources.cpu}%</span>
                            <Progress value={env.resources.cpu} className="h-1" />
                          </div>
                          <div>
                            <span>Memory: {env.resources.memory}%</span>
                            <Progress value={env.resources.memory} className="h-1" />
                          </div>
                          <div>
                            <span>Storage: {env.resources.storage}%</span>
                            <Progress value={env.resources.storage} className="h-1" />
                          </div>
                          <div>
                            <span>Network: {env.resources.network}%</span>
                            <Progress value={env.resources.network} className="h-1" />
                          </div>
                        </div>
                      </div>

                      {/* Services Status */}
                      <div>
                        <p className="text-sm font-medium mb-2">Services ({env.services.length})</p>
                        <div className="space-y-1">
                          {(env.services || []).slice(0, 3).map((service, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span>{service.name}</span>
                              <Badge className={getStatusColor(service.status)} variant="outline">
                                {service.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Deployment Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Active Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemDeployments.map((deployment) => (
                    <div key={deployment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{deployment.systemName}</h4>
                            <Badge variant="outline">{deployment.version}</Badge>
                            <Badge className={getCategoryTheme(deployment.environment).bg + ' ' + getCategoryTheme(deployment.environment).color}>
                              {deployment.environment}
                            </Badge>
                            <Badge className={getStatusColor(deployment.status)}>
                              {deployment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Type:</strong> {deployment.deploymentType.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Deployed by:</strong> {deployment.deployedBy}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Scheduled:</strong> {new Date(deployment.scheduledTime).toLocaleString()}
                              </p>
                              {deployment.deployedTime && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <strong>Deployed:</strong> {new Date(deployment.deployedTime).toLocaleString()}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <strong>Affected Services:</strong>
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {(deployment.affectedServices || []).map((service, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Health Checks */}
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Health Checks</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {(deployment.healthChecks || []).map((check, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded text-xs">
                                  <span>{check.check}</span>
                                  <Badge className={getStatusColor(check.status)} variant="outline">
                                    {check.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Rollback Plan */}
                          <div className="mt-3">
                            <p className="text-sm font-medium">Rollback Plan:</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{deployment.rollbackPlan}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {deployment.status === 'in_progress' && (
                            <Button variant="outline" size="sm">
                              <PauseCircle className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                          )}
                          {deployment.status === 'deployed' && (
                            <Button variant="outline" size="sm">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Rollback
                            </Button>
                          )}
                          {deployment.status === 'planned' && (
                            <Button size="sm">
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Deploy
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deployment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deployments</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemDeployments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round((systemDeployments.filter(d => d.status === 'deployed').length / systemDeployments.length) * 100)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Environments</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {systemEnvironments.filter(e => e.status === 'active').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Health Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(systemEnvironments.reduce((sum, env) => sum + env.healthScore, 0) / systemEnvironments.length)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Asset ID Series Tab */}
          <TabsContent value="asset-series" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Asset ID Series Management</h2>
              <Dialog open={showAddSeriesDialog} onOpenChange={setShowAddSeriesDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Series
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Asset ID Series</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="series-name">Series Name *</Label>
                        <Input
                          id="series-name"
                          placeholder="e.g., Laptop Series 2024"
                          value={newAssetSeries.name}
                          onChange={(e) => setNewAssetSeries({...newAssetSeries, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="series-prefix">Prefix *</Label>
                        <Input
                          id="series-prefix"
                          placeholder="e.g., LAP"
                          value={newAssetSeries.prefix}
                          onChange={(e) => setNewAssetSeries({...newAssetSeries, prefix: e.target.value.toUpperCase()})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="series-category">Category *</Label>
                        <Select value={newAssetSeries.category} onValueChange={(value) => setNewAssetSeries({...newAssetSeries, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laptop">Laptop</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="monitor">Monitor</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="server">Server</SelectItem>
                            <SelectItem value="network">Network Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="series-start">Starting Number *</Label>
                        <Input
                          id="series-start"
                          type="number"
                          placeholder="e.g., 1001"
                          value={newAssetSeries.startNumber}
                          onChange={(e) => setNewAssetSeries({...newAssetSeries, startNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="series-format">ID Format *</Label>
                      <Input
                        id="series-format"
                        placeholder="e.g., {PREFIX}-{YYYY}-{####}"
                        value={newAssetSeries.format}
                        onChange={(e) => setNewAssetSeries({...newAssetSeries, format: e.target.value})}
                      />
                      <p className="text-xs text-gray-500">
                        Available placeholders: {'{PREFIX}'} (prefix), {'{YYYY}'} (year), {'{####}'} (4-digit number)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="series-description">Description</Label>
                      <Textarea
                        id="series-description"
                        placeholder="Description of this asset series..."
                        value={newAssetSeries.description}
                        onChange={(e) => setNewAssetSeries({...newAssetSeries, description: e.target.value})}
                      />
                    </div>

                    {/* Preview */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium mb-1">Preview Next ID:</p>
                      <p className="text-lg font-mono">
                        {newAssetSeries.format
                          .replace('{PREFIX}', newAssetSeries.prefix || 'XXX')
                          .replace('{YYYY}', new Date().getFullYear().toString())
                          .replace('{####}', (newAssetSeries.startNumber || '1001').padStart(4, '0'))
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowAddSeriesDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAssetSeries}>
                      Create Series
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Series Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Series</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{assetSeries.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Hash className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Series</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {assetSeries.filter(s => s.isActive).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Generated</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {assetSeries.reduce((sum, s) => sum + s.totalGenerated, 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {new Set(assetSeries.map(s => s.category)).size}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Laptop className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Series Management Table */}
            <Card>
              <CardHeader>
                <CardTitle>Asset ID Series</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetSeries.map((series) => {
                    const categoryTheme = getAssetTheme(series.category);
                    return (
                      <div key={series.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryTheme.bg}`}>
                              <categoryTheme.icon className={`w-5 h-5 ${categoryTheme.color}`} />
                            </div>
                            <div>
                              <h4 className="font-medium">{series.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>Format: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{series.format}</code></span>
                                <span>Category: {series.category}</span>
                                <span>Created: {new Date(series.createdDate).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{series.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="font-bold text-lg">{series.currentNumber}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Next Number</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-lg">{series.totalGenerated}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Generated</p>
                            </div>
                            <div className="text-center">
                              <Badge className={series.isActive ? getStatusColor('active') : getStatusColor('retired')}>
                                {series.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="font-mono text-sm">{previewNextAssetId(series.id)}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Next ID</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setAssetSeries(prev => prev.map(s => 
                                  s.id === series.id ? { ...s, isActive: !s.isActive } : s
                                ))}
                              >
                                {series.isActive ? (
                                  <X className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
