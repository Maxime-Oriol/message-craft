import { useState, useMemo, useEffect } from "react";
import { Message, MessageFilters, MessageStats, Platform } from "@/types/message";
import { StatsCard } from "@/components/admin/StatsCard";
import { MessageFilters as MessageFiltersComponent } from "@/components/admin/MessageFilters";
import { Badge } from "@/components/ui/badge"
import { MessageCard } from "@/components/admin/MessageCard";
import { MessageDetail } from "@/components/admin/MessageDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, List, BarChart, MessageCircleMore, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateClientToken } from "@/lib/utils"
import { MachineLearningCard } from "@/components/admin/MachineLearningCard";

const Dashboard = () => {
    const load_messages = async (): Promise<Message[]> => {
        let result = []
        try {
            const response = await fetch("/api/messages?order=created_at&sort=desc", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-Craft-Auth": generateClientToken()
                }
            });

            const json = await response.json()
            result = json.map((data: any) => new Message(data));
        } catch (jsonError) {
            console.log(`Error while loading messages : ${jsonError}`)
        } finally {
            return result;
        }
    }

    const calculate_stats = (messages: Message[]): MessageStats => {

        if (messages == undefined || messages.length == 0) {
            setStats(null);
            return;
        }

        const {
            piiTotal,
            piiCount,
            cosineTotal,
            cosineCount,
            levenshteinTotal,
            levenshteinCount,
            reliabilityScoreTotal,
            reliabilityScoreCount
        } = messages.reduce(
            (acc, m) => {
                if (m.piiScore != null) {
                    acc.piiTotal += m.piiScore;
                    acc.piiCount++;
                }
                if (m.cosineScore != null) {
                    acc.cosineTotal += m.cosineScore;
                    acc.cosineCount++;
                }
                if (m.levenshteinScore != null) {
                    acc.levenshteinTotal += m.levenshteinScore;
                    acc.levenshteinCount++;
                }
                if (m.reliabilityScore != null) {
                    acc.reliabilityScoreTotal += m.reliabilityScore;
                    acc.reliabilityScoreCount++;
                }
                return acc;
            },
            {
                piiTotal: 0,
                piiCount: 0,
                cosineTotal: 0,
                cosineCount: 0,
                levenshteinTotal: 0,
                levenshteinCount: 0,
                reliabilityScoreTotal: 0,
                reliabilityScoreCount: 0
            }
        );

        const avgPiiScore = piiCount > 0 ? piiTotal / piiCount : 0;
        const avgSimCosine = cosineCount > 0 ? cosineTotal / cosineCount : 0;
        const avgDistLevenshtein = levenshteinCount > 0 ? levenshteinTotal / levenshteinCount : 0;
        const avgReliabilityScore = reliabilityScoreCount > 0 ? reliabilityScoreTotal / reliabilityScoreCount : 0;

        const validated = messages.filter(m => m.status === "validated").length
        const pending = messages.filter(m => m.status === "pending").length
        const rejected = messages.filter(m => m.status === "rejected").length


        return {
            total: messages.length,
            validated: validated,
            pending: pending,
            rejected: rejected,
            nonTransfered: messages.filter(m => !m.isTransfered).length,
            averageValidated: (validated / (messages.length - pending)),
            averageRejected: (rejected / (messages.length - pending)),
            averagePii: avgPiiScore,
            averageCosine: avgSimCosine,
            averageLevenshtein: avgDistLevenshtein,
            averageScore: avgReliabilityScore
        }
    }

    const [messages, setMessages] = useState<Message[]>([]);
    const [filters, setFilters] = useState<MessageFilters>({});
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [delConfirmationMessage, setDelConfirmationMessage] = useState<Message | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const { toast } = useToast();
    const [stats, setStats] = useState<MessageStats | null>(null)
    const [redisStatus, setRedisStatus] = useState<Object>({})

    // Filter messages
    const filteredMessages = useMemo(() => {
        return messages.filter((message) => {
            if (filters.status && message.status !== filters.status) return false;
            if (filters.platform && message.platform !== filters.platform) return false;
            if (filters.minScore && message.reliabilityScore < filters.minScore) return false;
            if (filters.maxScore && message.reliabilityScore > filters.maxScore) return false;
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return (
                    message.generated.toLowerCase().includes(searchLower) ||
                    message.message.toLowerCase().includes(searchLower) ||
                    message.platform.toLowerCase().includes(searchLower) ||
                    message.intent.toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }, [messages, filters]);

    const refreshData = () => {
        load_messages().then((messages: Message[]) => {
            setMessages(messages)
            setStats(calculate_stats(messages))
        })
    }

    useEffect(() => {
        setRedisStatus({ "status": "pending", "text": "Implémentation en cours" })
        if (messages.length == 0) {
            refreshData()
        }
    }, []);

    const _validate_or_reject = (id: string, validated: boolean) => {
        setMessages(prevMessages =>
            prevMessages.map(message =>
                message.id === id
                    ? { ...message, status: validated ? "validated" : "rejected", validatedAt: new Date() }
                    : message
            )
        );

        fetch("/api/message/validate", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            },
            body: JSON.stringify({ id })
        }).then(response => response.json())
            .then(result => {
                toast({
                    title: result.title,
                    description: result.description,
                    variant: (result.success == true ? "success" : "destructive")
                });
            });
    }

    const handleValidate = (id: string) => {
        _validate_or_reject(id, true);
    };
    const handleReject = (id: string) => {
        _validate_or_reject(id, false);
    };

    const handleView = (id: string) => {
        const message = messages.find(m => m.id === id);
        setSelectedMessage(message || null);
    };

    const handleDelete = async (id: string) => {
        const message = messages.find(m => m.id === id);
        const response = await fetch("/api/message", {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "X-Craft-Auth": generateClientToken()
            },
            body: JSON.stringify(message)
        });

        let result = null;
        try {
            result = await response.json(); // essaye de parser le corps, même s’il y a une erreur serveur
            setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
            toast({
                title: result.title,
                description: result.description,
                variant: result.success ? "success" : "destructive"
            })
        } catch (jsonError) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression du message, veuillez réessayer plus tard",
                variant: "destructive"
            });
            console.warn("Impossible de parser le corps JSON :", jsonError);
        }
        setDelConfirmationMessage(null)
    }

    const resetFilters = () => {
        setFilters({});
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                MessageCraft
                            </h1>
                            <p className="text-muted-foreground">Interface d'administration</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 size={16} />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <Tabs defaultValue="stats" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="stats">
                            <BarChart size={16} className="mr-2" />
                            Statistiques
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="flex items-center gap-2">
                            <MessageCircleMore size={16} />
                            <span>Messages</span>
                            {stats && (
                                <div className="flex items-center gap-1">
                                    {stats.pending > 0 && (
                                        <Badge variant="pending" className="text-xs sm:text-sm px-2 sm:px-3">
                                            {stats.pending} en attente
                                        </Badge>
                                    )}
                                    {stats.nonTransfered > 0 && (
                                        <Badge variant="new" className="text-xs sm:text-sm px-2 sm:px-3">
                                            {stats.nonTransfered} non traité(s)
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="LLM" className="flex items-center gap-2">
                            <BrainCircuit size={16} className="mr-2" />
                            Machine Learning
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="messages" className="space-y-6">
                        {/* Filters */}
                        <MessageFiltersComponent
                            filters={filters}
                            onFiltersChange={setFilters}
                            onReset={resetFilters}
                        />

                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {filteredMessages.length} message(s) trouvé(s)
                            </p>
                        </div>

                        {/* Messages List */}
                        <div className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "space-y-4"
                        }>
                            {filteredMessages.map((message) => (
                                <MessageCard
                                    key={message.id}
                                    message={message}
                                    onValidate={handleValidate}
                                    onReject={handleReject}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {filteredMessages.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">Aucun message trouvé</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Modifiez vos filtres pour voir plus de résultats
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-6">
                        <StatsCard stats={stats} />
                    </TabsContent>

                    <TabsContent value="LLM" className="space-y-6">
                        <MachineLearningCard totalNonTransfered={stats ? stats.nonTransfered : 0} onMessageAdded={refreshData} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Message Detail Modal */}
            <MessageDetail
                message={selectedMessage}
                open={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                onValidate={handleValidate}
                onReject={handleReject}
            />

            {/* Status Footer */}
            <footer className="border-t bg-card/50 backdrop-blur mt-8">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-status-${redisStatus.status ? redisStatus.status : "new"} animate-pulse`}></div>
                                {redisStatus.text ? redisStatus.text : "IDLE"}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>25 utilisateurs en ligne</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;