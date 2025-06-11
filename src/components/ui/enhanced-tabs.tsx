
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const EnhancedTabs = TabsPrimitive.Root

const EnhancedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-primary/5 p-1 text-muted-foreground backdrop-blur-sm border border-primary/10",
      className
    )}
    {...props}
  />
))
EnhancedTabsList.displayName = TabsPrimitive.List.displayName

const EnhancedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:scale-102 hover:bg-primary/10",
      className
    )}
    {...props}
  />
))
EnhancedTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const EnhancedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-fade-in",
      className
    )}
    {...props}
  />
))
EnhancedTabsContent.displayName = TabsPrimitive.Content.displayName

export { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent }
