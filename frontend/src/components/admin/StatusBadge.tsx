import { MessageStatus } from "@/types/message";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: MessageStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "En attente",
    className: "bg-status-pending text-status-pending-foreground hover:bg-status-pending/90"
  },
  validated: {
    label: "Validé",
    className: "bg-status-validated text-status-validated-foreground hover:bg-status-validated/90"
  },
  rejected: {
    label: "Rejeté",
    className: "bg-status-rejected text-status-rejected-foreground hover:bg-status-rejected/90"
  },
  new: {
    label: "Non traité",
    className: "bg-status-new text-status-new-foreground hover:bg-status-new/90"
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}