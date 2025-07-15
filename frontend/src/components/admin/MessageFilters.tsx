import { MessageFilters, PlatformList, MessageStatus } from "@/types/message";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { PlatformIcon } from "./PlatformIcon";
import { StatusBadge } from "./StatusBadge";

interface MessageFiltersProps {
    filters: MessageFilters;
    onFiltersChange: (filters: MessageFilters) => void;
    onReset: () => void;
}

const statuses: MessageStatus[] = ["pending", "validated", "rejected", "new"];

export function MessageFilters({ filters, onFiltersChange, onReset }: MessageFiltersProps) {
    const updateFilter = (key: keyof MessageFilters, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const hasActiveFilters = filters.status || filters.platform || filters.search ||
        filters.minScore !== undefined || filters.maxScore !== undefined;

    return (
        <div className="space-y-4 p-4 bg-card border rounded-lg shadow-sm">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                    placeholder="Rechercher dans les messages..."
                    value={filters.search || ""}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Status Filter */}
                <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={status} />
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Platform Filter */}
                <Select
                    value={filters.platform || "all"}
                    onValueChange={(value) => updateFilter("platform", value === "all" ? undefined : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les plateformes</SelectItem>
                        {PlatformList.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center gap-2">
                                    <PlatformIcon platform={platform.value} size={14} />
                                    <span className="capitalize">{platform.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Score Filter */}
                <Select
                    value={filters.minScore?.toString() || "all"}
                    onValueChange={(value) => {
                        if (value === "all") {
                            updateFilter("minScore", undefined);
                            updateFilter("maxScore", undefined);
                        } else {
                            const minScore = parseFloat(value);
                            updateFilter("minScore", minScore);
                            updateFilter("maxScore", undefined);
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Score minimum" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les scores</SelectItem>
                        <SelectItem value="0.9">90%+ (Excellent)</SelectItem>
                        <SelectItem value="0.8">80%+ (Bon)</SelectItem>
                        <SelectItem value="0.7">70%+ (Moyen)</SelectItem>
                        <SelectItem value="0.6">60%+ (Faible)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <Button
                        onClick={onReset}
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground"
                    >
                        <X size={14} className="mr-1" />
                        Réinitialiser
                    </Button>
                </div>
            )}
        </div>
    );
}