import { Message } from "@/types/message";
import { StatusBadge } from "./StatusBadge";
import { PlatformIcon } from "./PlatformIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";

interface MessageCardProps {
    message: Message;
    onValidate: (id: string) => void;
    onReject: (id: string) => void;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    className?: string;
}

export function MessageCard({ message, onValidate, onReject, onView, onDelete, className }: MessageCardProps) {
    const scoreColor = message.reliabilityScore >= 0.9
        ? "text-status-validated"
        : message.reliabilityScore >= 0.7
            ? "text-status-pending"
            : "text-status-rejected";

    return (
        <Card className={cn(
            "p-4 transition-all duration-200 hover:shadow-lg border-l-4",
            message.status == "new" && "border-l-new bg-new/5",
            message.status === "validated" && "border-l-status-validated bg-status-validated/5",
            message.status === "rejected" && "border-l-status-rejected bg-status-rejected/5",
            message.status === "pending" && "border-l-status-pending bg-status-pending/5",
            className
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <PlatformIcon platform={message.platform} size={18} />
                    <span className="font-medium text-sm text-muted-foreground">
                        {message.platform.charAt(0).toUpperCase() + message.platform.slice(1)}
                    </span>
                </div>
                <StatusBadge status={message.status} />
            </div>

            {/* Intention */}
            <div className="mb-3">
                <h3 className="font-semibold text-base text-foreground mb-1">
                    Plateforme : {message.platform}
                </h3>
                <p className="text-xs text-muted-foreground">
                    {message.intent}
                </p>
            </div>

            {/* Message Content */}
            <div className="mb-4">
                <h3 className="font-semibold text-base text-foreground mb-1">
                    Message final
                </h3>
                <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                    {message.piiMessage ? message.piiMessage : message.message ? message.message : message.generated}
                </p>
            </div>

            {/* Score */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                    <span className="text-muted-foreground">Score: </span>
                    <span className={cn("font-semibold", scoreColor)}>
                        {message.isTransfered ? `${(message.reliabilityScore * 100).toFixed(0)}%` : "Non calculé"}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                    {message.createdAt && message.createdAt.toLocaleDateString('fr-FR')}
                </div>
            </div>

            {/* Actions */}

            <div className="flex justify-end gap-2">
                {message.status === "pending" && (<>
                    <Button
                        onClick={() => onValidate(message.id)}
                        size="sm"
                        className="flex-1 bg-status-validated hover:bg-status-validated/90 text-status-validated-foreground"
                    >
                        <Check size={16} className="mr-1" />
                        Valider
                    </Button>
                    <Button
                        onClick={() => onReject(message.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-status-rejected text-status-rejected hover:bg-status-rejected hover:text-status-rejected-foreground"
                    >
                        <X size={16} className="mr-1" />
                        Rejeter
                    </Button>
                </>)}

                <Button
                    onClick={() => onView(message.id)}
                    size="sm"
                    variant="outline"
                    className="px-3 hover:bg-primary hover:text-primary-foreground"
                >
                    <Eye size={16} />
                </Button>

                <ConfirmationDialog
                    id={message.id}
                    onConfirm={() => onDelete(message.id)}
                    icon={<Trash2 size={16} />}
                    confirmLabel="Supprimer"
                    confirmStyle="destructive"
                >
                    <>
                        Êtes-vous sûr de vouloir supprimer ce message ?<br />
                        La suppression est permanente et les données ne pourront pas être récupérées.<br />
                        De plus, les données ne pourront pas être utilisées pour entraîner le modèle.
                    </>

                </ConfirmationDialog>
            </div>
        </Card>
    );
}