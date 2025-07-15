import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface ConfirmationDialogProps {
  id: string
  icon: ReactNode
  confirmLabel: string
  confirmStyle?: string
  onConfirm: (id: string) => void
  children: ReactNode
}

export function ConfirmationDialog({
  id,
  onConfirm,
  icon,
  confirmLabel,
  confirmStyle,
  children
}: ConfirmationDialogProps) {
    let buttonClass = "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
    if (confirmStyle == "destructive") {
        buttonClass = "border border-destructive text-destructive bg-background hover:bg-destructive/90 hover:text-destructive-foreground"
    }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={`px-3 ${buttonClass}`}
        >
          {icon}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            {children}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { onConfirm(id)}}
            className={buttonClass}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}