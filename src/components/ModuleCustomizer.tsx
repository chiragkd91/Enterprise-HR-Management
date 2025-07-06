/**
 * Module Customizer Component - Individual module customization interface
 * Allows deep customization of specific modules and their components
 */

import React, { useState } from 'react';
import { Settings, Plus, Trash2, Edit3, Save, Eye, Code2, Layout, Database, Workflow } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface FieldConfig {
  id: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'file' | 'checkbox';
  label: string;
  placeholder: string;
  required: boolean;
  visible: boolean;
  readonly: boolean;
  validation: string;
  options: string[];
  order: number;
  section: string;
}

interface ViewConfig {
  id: string;
  name: string;
  type: 'table' | 'card' | 'list' | 'kanban' | 'calendar' | 'chart';
  columns: string[];
  filters: string[];
  sorting: string[];
  pagination: boolean;
  search: boolean;
  export: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'manual' | 'automated' | 'approval' | 'notification';
  assignee: string;
  conditions: string[];
  actions: string[];
  timeout: number;
}

interface ModuleCustomizerProps {
  moduleName: string;
  onClose: () => void;
}

export default function ModuleCustomizer({ moduleName, onClose }: ModuleCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'fields' | 'views' | 'workflows' | 'permissions'>('fields');
  const [fields, setFields] = useState<FieldConfig[]>([
    {
      id: 'emp_id',
      name: 'employeeId',
      type: 'text',
      label: 'Employee ID',
      placeholder: 'Enter employee ID',
      required: true,
      visible: true,
      readonly: false,
      validation: '^[A-Z]{3}[0-9]{4}$',
      options: [],
      order: 1,
      section: 'basic'
    },
    {
      id: 'first_name',
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
      visible: true,
      readonly: false,
      validation: '',
      options: [],
      order: 2,
      section: 'basic'
    },
    {
      id: 'department',
      name: 'department',
      type: 'select',
      label: 'Department',
      placeholder: 'Select department',
      required: true,
      visible: true,
      readonly: false,
      validation: '',
      options: ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales'],
      order: 3,
      section: 'job'
    }
  ]);

  const [views, setViews] = useState<ViewConfig[]>([
    {
      id: 'employee_table',
      name: 'Employee Table',
      type: 'table',
      columns: ['employeeId', 'firstName', 'lastName', 'department', 'status'],
      filters: ['department', 'status'],
      sorting: ['firstName', 'lastName', 'employeeId'],
      pagination: true,
      search: true,
      export: true
    },
    {
      id: 'employee_cards',
      name: 'Employee Cards',
      type: 'card',
      columns: ['firstName', 'lastName', 'department', 'email'],
      filters: ['department'],
      sorting: ['firstName'],
      pagination: true,
      search: true,
      export: false
    }
  ]);

  const [workflows, setWorkflows] = useState<WorkflowStep[]>([
    {
      id: 'create_employee',
      name: 'Create Employee',
      type: 'manual',
      assignee: 'HR Manager',
      conditions: ['all_required_fields_filled'],
      actions: ['send_welcome_email', 'create_it_ticket'],
      timeout: 24
    },
    {
      id: 'approve_employee',
      name: 'Approve Employee',
      type: 'approval',
      assignee: 'Department Head',
      conditions: ['background_check_complete'],
      actions: ['activate_account', 'send_confirmation'],
      timeout: 48
    }
  ]);

  /**
   * Add new field
   */
  const addField = () => {
    const newField: FieldConfig = {
      id: `field_${Date.now()}`,
      name: `customField${fields.length + 1}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false,
      visible: true,
      readonly: false,
      validation: '',
      options: [],
      order: fields.length + 1,
      section: 'custom'
    };
    setFields([...fields, newField]);
  };

  /**
   * Update field
   */
  const updateField = (index: number, updates: Partial<FieldConfig>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  /**
   * Delete field
   */
  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  /**
   * Add new view
   */
  const addView = () => {
    const newView: ViewConfig = {
      id: `view_${Date.now()}`,
      name: 'New View',
      type: 'table',
      columns: [],
      filters: [],
      sorting: [],
      pagination: true,
      search: true,
      export: false
    };
    setViews([...views, newView]);
  };

  /**
   * Save customizations
   */
  const saveCustomizations = () => {
    const customizations = {
      moduleName,
      fields,
      views,
      workflows,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`module_customization_${moduleName}`, JSON.stringify(customizations));
    alert('Module customizations saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Customize {moduleName} Module
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Configure fields, views, workflows, and permissions for this module
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={saveCustomizations}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fields">
              <Database className="w-4 h-4 mr-2" />
              Fields
            </TabsTrigger>
            <TabsTrigger value="views">
              <Layout className="w-4 h-4 mr-2" />
              Views
            </TabsTrigger>
            <TabsTrigger value="workflows">
              <Workflow className="w-4 h-4 mr-2" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Settings className="w-4 h-4 mr-2" />
              Permissions
            </TabsTrigger>
          </TabsList>

          {/* Fields Configuration */}
          <TabsContent value="fields" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Form Fields Configuration</h3>
              <Button onClick={addField}>
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{field.label}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={field.required ? 'destructive' : 'secondary'}>
                          {field.required ? 'Required' : 'Optional'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateField(index, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Section</Label>
                        <Select
                          value={field.section}
                          onValueChange={(value) => updateField(index, { section: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Information</SelectItem>
                            <SelectItem value="contact">Contact Details</SelectItem>
                            <SelectItem value="job">Job Information</SelectItem>
                            <SelectItem value="custom">Custom Fields</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={field.order}
                          onChange={(e) => updateField(index, { order: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        />
                      </div>
                      {field.type === 'select' && (
                        <div className="md:col-span-3">
                          <Label>Options (comma-separated)</Label>
                          <Input
                            value={field.options.join(', ')}
                            onChange={(e) => updateField(index, { options: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                      <div className="md:col-span-3">
                        <Label>Validation Pattern (RegEx)</Label>
                        <Input
                          value={field.validation}
                          onChange={(e) => updateField(index, { validation: e.target.value })}
                          placeholder="^[A-Za-z0-9]+$"
                        />
                      </div>
                      <div className="md:col-span-3 flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(index, { required: checked })}
                          />
                          <Label>Required</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.visible}
                            onCheckedChange={(checked) => updateField(index, { visible: checked })}
                          />
                          <Label>Visible</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.readonly}
                            onCheckedChange={(checked) => updateField(index, { readonly: checked })}
                          />
                          <Label>Read Only</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Views Configuration */}
          <TabsContent value="views" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Data Views Configuration</h3>
              <Button onClick={addView}>
                <Plus className="w-4 h-4 mr-2" />
                Add View
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {views.map((view, index) => (
                <Card key={view.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{view.name}</CardTitle>
                      <Badge variant="outline">{view.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>View Name</Label>
                      <Input
                        value={view.name}
                        onChange={(e) => {
                          const updatedViews = [...views];
                          updatedViews[index] = { ...updatedViews[index], name: e.target.value };
                          setViews(updatedViews);
                        }}
                      />
                    </div>
                    <div>
                      <Label>View Type</Label>
                      <Select
                        value={view.type}
                        onValueChange={(value) => {
                          const updatedViews = [...views];
                          updatedViews[index] = { ...updatedViews[index], type: value as any };
                          setViews(updatedViews);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="table">Table</SelectItem>
                          <SelectItem value="card">Card Grid</SelectItem>
                          <SelectItem value="list">List View</SelectItem>
                          <SelectItem value="kanban">Kanban Board</SelectItem>
                          <SelectItem value="calendar">Calendar</SelectItem>
                          <SelectItem value="chart">Chart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={view.pagination}
                          onCheckedChange={(checked) => {
                            const updatedViews = [...views];
                            updatedViews[index] = { ...updatedViews[index], pagination: checked };
                            setViews(updatedViews);
                          }}
                        />
                        <Label>Pagination</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={view.search}
                          onCheckedChange={(checked) => {
                            const updatedViews = [...views];
                            updatedViews[index] = { ...updatedViews[index], search: checked };
                            setViews(updatedViews);
                          }}
                        />
                        <Label>Search</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={view.export}
                          onCheckedChange={(checked) => {
                            const updatedViews = [...views];
                            updatedViews[index] = { ...updatedViews[index], export: checked };
                            setViews(updatedViews);
                          }}
                        />
                        <Label>Export</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Workflows Configuration */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Workflow Configuration</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {workflows.map((step, index) => (
                <Card key={step.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{step.name}</CardTitle>
                      <Badge variant="outline">{step.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Step Name</Label>
                        <Input value={step.name} readOnly />
                      </div>
                      <div>
                        <Label>Assignee</Label>
                        <Input value={step.assignee} readOnly />
                      </div>
                      <div>
                        <Label>Timeout (hours)</Label>
                        <Input type="number" value={step.timeout} readOnly />
                      </div>
                      <div>
                        <Label>Conditions</Label>
                        <div className="flex flex-wrap gap-1">
                          {step.conditions.map((condition, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permissions Configuration */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role-based Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['HR Manager', 'Department Head', 'Employee', 'Admin'].map((role) => (
                    <div key={role} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">{role}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'].map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Switch />
                            <Label className="text-sm">{permission}</Label>
                          </div>
                        ))}
                      </div>
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
