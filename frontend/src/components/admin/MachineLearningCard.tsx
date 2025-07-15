import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, Edit, FileSliders, MessageCircleMore, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MessageForm } from "./MessageForm";
import { generateClientToken } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth";
import { Platform } from "@/types/message";


interface MessageFormData {
    platform: Platform;
    intention: string;
    finalMessage: string;
}

interface MachineLearningProps {
    totalNonTransfered: number;
    onMessageAdded: () => void;
}

export function MachineLearningCard({ onMessageAdded, totalNonTransfered }: MachineLearningProps) {
    const { user } = useAuth();
    const [isExecuting, setExecuting] = useState<boolean>(false)

    const handleAddMessage = async (message: MessageFormData) => {
        const payload = {
            user_id: user.id,
            intent: message.intention,
            platform: message.platform,
            generated: message.finalMessage,
            message: message.finalMessage,
            needs_validation: false
        }

        const response = await fetch("/api/message", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            },
            body: JSON.stringify(payload)
        });

        let result = null;
        try {
            result = await response.json(); // essaye de parser le corps, même s’il y a une erreur serveur
            if (result.description) {
                toast({
                    title: result.title,
                    description: result.description,
                    variant: result.success ? "success" : "destructive"
                });
            }
            onMessageAdded();
        } catch (jsonError) {
            console.warn("Impossible de parser le corps JSON :", jsonError);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la sauvegarde",
                variant: "destructive"
            });
        }
    }

    const handleTrainingScoring = () => {
        setExecuting(true)
        fetch("/api/llm/train/scoring", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            }
        }).finally(() => {
            toast({
                title: "Execution terminée",
                description: "L'entrainement du model de scoring est terminé",
                variant: "success"
            })
            setExecuting(false)
        });
    }

    const handleTraingGenai = () => {
        setExecuting(true)
        fetch("/api/llm/train/genai", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            }
        }).finally(() => {
            toast({
                title: "Execution terminée",
                description: "L'entrainement du model de génération de messages est terminé",
                variant: "success"
            })
            setExecuting(false)
        });
    }

    const handleExecuteScoring = async () => {
        setExecuting(true)
        fetch("/api/llm/execute/scoring", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            }
        }).finally(() => {
            toast({
                title: "Execution terminée",
                description: "Le scoring des nouveaux messages est terminé",
                variant: "success"
            })
            setExecuting(false)
        });
    };

    const handleExecuteAll = async () => {
        setExecuting(true)
        fetch("/api/llm/execute/all", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            }
        }).finally(() => {
            toast({
                title: "Execution terminée",
                description: "L'execution des models est terminée",
                variant: "success"
            })
            setExecuting(false)
        });
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
            <Card key="train-scoring" className="p-6 rounded-2xl shadow-md bg-muted/50">
                <div className="flex flex-col items-center text-center space-y-4">
                    <FileSliders size={28} className="mr-2 text-green-600" />

                    <h3 className="text-xl font-semibold leading-tight tracking-tight">
                        <span className="text-muted-foreground">Entraîner le modèle</span><br />
                        de scoring
                    </h3>

                    <Button
                        className="mt-2 px-6 py-2 bg-green-100 text-green-800 border border-green hover:bg-green-600 hover:text-secondary"
                        onClick={handleTrainingScoring}
                        disabled={isExecuting}>
                        <FileSliders size={16} className="mr-2" />
                        Lancer l'entraînement
                    </Button>
                </div>
            </Card>
            <Card key="train-genai" className="p-6 rounded-2xl shadow-md bg-muted/50">
                <div className="flex flex-col items-center text-center space-y-4">
                    <MessageCircleMore size={28} className="mr-2 text-green-600" />

                    <h3 className="text-xl font-semibold leading-tight tracking-tight">
                        <span className="text-muted-foreground">Entraîner le modèle</span><br />
                        de génération de texte
                    </h3>

                    <Button className="mt-2 px-6 py-2 bg-green-100 text-green-800 border border-green hover:bg-green-600 hover:text-secondary"
                        onClick={handleTraingGenai}
                        disabled={isExecuting}>
                        <MessageCircleMore size={16} className="mr-2" />
                        Lancer l'entrainement
                    </Button>
                </div>
            </Card>
            <Card key="exec-scoring" className="p-6 rounded-2xl shadow-md bg-muted/50">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Percent size={28} className="mr-2" />

                    <h3 className="text-xl font-semibold leading-tight tracking-tight">
                        <span className="text-muted-foreground">Scorer les nouveaux messages</span><br />
                        {totalNonTransfered} message{totalNonTransfered > 1 ? "s" : ""} en attente
                    </h3>

                    <Button className="mt-2 px-6 py-2 bg-orange-100 text-orange-800 border border-orange hover:bg-orange-600 hover:text-secondary"
                        onClick={handleExecuteScoring}
                        disabled={isExecuting}>
                        <Percent size={16} className="mr-2" />
                        Lancer le scoring
                    </Button>
                </div>
            </Card>
            <Card key="exec-all" className="p-6 rounded-2xl shadow-md bg-muted/50">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Brain size={28} className="text-red-600" />

                    <h3 className="text-xl font-semibold leading-tight tracking-tight">
                        <span className="text-muted-foreground">Lancer tout le process</span><br />
                        Entrainement et Scoring
                    </h3>

                    <Button
                        className="mt-2 px-6 py-2 bg-red-100 text-red-800 border border-red hover:bg-red-600 hover:text-secondary"
                        onClick={handleExecuteAll}
                        disabled={isExecuting}>
                        <Brain size={16} className="mr-2" />
                        Lancer le processus complet
                    </Button>
                </div>
            </Card>
            <Card key="add-message" className="p-6 rounded-2xl shadow-md bg-muted/50 col-span-2">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl text-center space-y-4">
                        <Edit size={28} className="text-red-600 w-8 h-16 mx-auto" />

                        <h3 className="text-xl font-semibold leading-tight tracking-tight">
                            Ajouter un message<br />
                            <span className="text-muted-foreground">dans la base de données</span>
                        </h3>

                        <MessageForm
                            onSubmit={handleAddMessage}
                            title="Ajouter un nouveau message"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}