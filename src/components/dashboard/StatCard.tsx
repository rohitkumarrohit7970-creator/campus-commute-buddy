import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'gradient-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  accent: 'bg-accent text-accent-foreground',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-white/20 text-primary-foreground',
  success: 'bg-white/20 text-success-foreground',
  warning: 'bg-white/20 text-warning-foreground',
  accent: 'bg-white/20 text-accent-foreground',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg",
        variantStyles[variant]
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className={cn(
                "text-sm font-medium mb-1",
                variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
              )}>
                {title}
              </p>
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <p className={cn(
                  "text-sm mt-2",
                  variant === 'default' 
                    ? trend.isPositive ? 'text-success' : 'text-destructive'
                    : 'opacity-80'
                )}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from yesterday
                </p>
              )}
            </div>
            <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
