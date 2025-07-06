/**
 * Sheet Component - Slide-out panel for mobile navigation
 */

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SheetProps {
  children: React.ReactNode;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  children: React.ReactNode;
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

interface SheetTitleProps {
  className?: string;
  children: React.ReactNode;
}

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {}
});

export function Sheet({ children }: SheetProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  const { setOpen } = React.useContext(SheetContext);

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setOpen(true)
    });
  }

  return (
    <Button onClick={() => setOpen(true)}>
      {children}
    </Button>
  );
}

export function SheetContent({ side = 'right', className, children }: SheetContentProps) {
  const { open, setOpen } = React.useContext(SheetContext);

  if (!open) return null;

  const sideClasses = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0',
    bottom: 'bottom-0'
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setOpen(false)}
      />
      
      {/* Sheet */}
      <div className={`fixed ${sideClasses[side]} top-0 bottom-0 z-50 bg-white dark:bg-gray-800 shadow-lg min-w-80 ${className || ''}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}

export function SheetHeader({ children }: SheetHeaderProps) {
  return <div className="mb-4">{children}</div>;
}

export function SheetTitle({ className, children }: SheetTitleProps) {
  return <h2 className={`text-lg font-semibold ${className || ''}`}>{children}</h2>;
}
