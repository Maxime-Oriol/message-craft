import { useForm } from "react-hook-form";
import { Message, Platform } from "@/types/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformList } from "@/types/message";

interface MessageFormData {
    platform: Platform;
    intention: string;
    finalMessage: string;
}

interface MessageFormProps {
    onSubmit: (data: MessageFormData) => void;
    message?: Message | null;
    title: string;
}

export function MessageForm({ onSubmit, message }: MessageFormProps) {
    const {
        register,
        setValue,
        watch,
        reset,
        getValues,
        formState: { errors }
    } = useForm<MessageFormData>({
        defaultValues: {
            platform: message?.platform || "email",
            intention: message?.intention || "",
            finalMessage: message?.finalMessage || "",
        }
    });

    const platform = watch("platform");

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = getValues();
        onSubmit(data);
        reset();
    };

    return (

        <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Platform */}
            <div className="space-y-2">
                <Label htmlFor="platform">Plateforme</Label>
                <Select
                    value={platform}
                    onValueChange={(value: Platform) => setValue("platform", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                        {PlatformList.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                                {p.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Intention */}
            <div className="space-y-2">
                <Label htmlFor="intention">Intention</Label>
                <Textarea
                    id="intention"
                    placeholder="Décrivez l'intention du message..."
                    className="min-h-[80px]"
                    {...register("intention", { required: "L'intention est requise" })}
                />
                {errors.intention && (
                    <p className="text-sm text-destructive">{errors.intention.message}</p>
                )}
            </div>

            {/* Message final */}
            <div className="space-y-2">
                <Label htmlFor="finalMessage">Message final</Label>
                <Textarea
                    id="finalMessage"
                    placeholder="Version finale du message..."
                    className="min-h-[120px]"
                    {...register("finalMessage", { required: "Le message final est requis" })}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1">
                    {message ? "Modifier" : "Ajouter"}
                </Button>
            </div>
        </form>
    );
}