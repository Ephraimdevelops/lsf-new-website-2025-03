import { cn } from "@/lib/utils";
import Typography from "@/components/shared/Typography";
import { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
    icon?: LucideIcon;
    text: string;
    className?: string;
    variant?: "default" | "outline";
}

const SectionBadge = ({ icon: Icon, text, className, variant = "default" }: SectionBadgeProps) => {
    return (
        <div className={cn(
            "inline-flex items-center gap-4 rounded-full px-8 py-4 mb-8 border backdrop-blur-sm transition-all duration-300",
            variant === "default"
                ? "bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 border-primary/20"
                : "bg-white/10 border-white/20",
            className
        )}>
            {Icon ? (
                <Icon className={cn(
                    "h-6 w-6 animate-pulse",
                    variant === "default" ? "text-primary" : "text-secondary-orange"
                )} />
            ) : (
                <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    variant === "default" ? "bg-primary" : "bg-secondary-orange"
                )}></div>
            )}
            <Typography
                variant="overline"
                className={cn(
                    "font-bold text-lg tracking-wider",
                    variant === "default" ? "text-primary" : "text-white"
                )}
            >
                {text}
            </Typography>
        </div>
    );
};

export default SectionBadge;
