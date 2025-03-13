
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  dialogTitle?: string;
  dialogContent?: ReactNode;
  loading?: boolean;
}

export function DashboardCard({
  title,
  children,
  actionLabel,
  onAction,
  dialogTitle,
  dialogContent,
  loading = false
}: DashboardCardProps) {
  // Show loading spinner if needed
  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // If dialog content is provided, use a dialog trigger
  if (dialogTitle && dialogContent) {
    return (
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {actionLabel || "Manage"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {dialogContent}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {children}
      </div>
    );
  }

  // Regular card with optional action button
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {actionLabel && onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
