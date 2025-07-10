import { Message } from "@/types/message";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { PlatformIcon } from "./PlatformIcon";
import { Check, X, Copy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageDetailProps {
  message: Message | null;
  open: boolean;
  onClose: () => void;
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
}

export function MessageDetail({ message, open, onClose, onValidate, onReject }: MessageDetailProps) {
  const { toast } = useToast();

  if (!message) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copié !",
        description: "Le message a été copié dans le presse-papiers.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le message.",
        variant: "destructive",
      });
    }
  };

  const scoreColor = message.reliabilityScore >= 0.9 
    ? "text-status-validated" 
    : message.reliabilityScore >= 0.7 
      ? "text-status-pending" 
      : "text-status-rejected";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlatformIcon platform={message.platform} size={20} />
            {message.intention}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {message.platform}
            </Badge>
            <StatusBadge status={message.status} />
            <Badge variant="outline" className={scoreColor}>
              Score: {(message.reliabilityScore * 100).toFixed(0)}%
            </Badge>
          </div>

          {/* Context */}
          {message.context && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Contexte</h4>
              <p className="text-sm bg-muted p-3 rounded-md">{message.context}</p>
            </div>
          )}

          {/* Message Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Message généré</h4>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="h-7 px-2"
              >
                <Copy size={14} className="mr-1" />
                Copier
              </Button>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>

          {/* Detailed Scores */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Scores détaillés</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-muted p-3 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Fiabilité globale</p>
                <p className={`text-lg font-semibold ${scoreColor}`}>
                  {(message.reliabilityScore * 100).toFixed(1)}%
                </p>
              </div>
              {message.cosineScore && (
                <div className="bg-muted p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Cosine</p>
                  <p className="text-lg font-semibold">
                    {(message.cosineScore * 100).toFixed(1)}%
                  </p>
                </div>
              )}
              {message.levenshteinScore && (
                <div className="bg-muted p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Levenshtein</p>
                  <p className="text-lg font-semibold">
                    {(message.levenshteinScore * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              Créé le {message.createdAt.toLocaleDateString('fr-FR')} à {message.createdAt.toLocaleTimeString('fr-FR')}
            </div>
            {message.validatedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={14} />
                {message.status === "validated" ? "Validé" : "Rejeté"} le {message.validatedAt.toLocaleDateString('fr-FR')} à {message.validatedAt.toLocaleTimeString('fr-FR')}
              </div>
            )}
          </div>

          {/* Actions */}
          {message.status === "pending" && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  onValidate(message.id);
                  onClose();
                }}
                className="flex-1 bg-status-validated hover:bg-status-validated/90 text-status-validated-foreground"
              >
                <Check size={16} className="mr-2" />
                Valider ce message
              </Button>
              <Button
                onClick={() => {
                  onReject(message.id);
                  onClose();
                }}
                variant="outline"
                className="flex-1 border-status-rejected text-status-rejected hover:bg-status-rejected hover:text-status-rejected-foreground"
              >
                <X size={16} className="mr-2" />
                Rejeter ce message
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}