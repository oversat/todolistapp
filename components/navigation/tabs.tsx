'use client';

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

type TabValue = 'chibis' | 'awake' | 'sleep' | 'settings';

interface CustomTabsProps extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, 'value' | 'onValueChange'> {
  value: TabValue;
  onValueChange: (value: TabValue) => void;
}

export const TabsRoot = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, CustomTabsProps>(
  ({ className, value, onValueChange, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      className={cn('w-full', className)}
      value={value}
      onValueChange={(newValue: string) => {
        if (newValue === 'chibis' || newValue === 'awake' || newValue === 'sleep' || newValue === 'settings') {
          onValueChange(newValue);
        }
      }}
      {...props}
    />
  )
);
TabsRoot.displayName = TabsPrimitive.Root.displayName;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-black/70 p-1',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-vt323',
      'ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-neon-blue data-[state=active]:text-white',
      'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
