import { MessageStats } from "@/types/message";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, ClockAlert, CheckCircle, XCircle } from "lucide-react";

interface StatsCardProps {
  stats: MessageStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const validationRate = stats && stats.total > 0 ? (stats.validated / stats.total) * 100 : 0;
  const rejectionRate = stats && stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0;

  const statItems = [
    {
      label: "Total",
      value: stats ? stats.total : 0,
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      label: "En attente",
      value: stats ? stats.pending : 0,
      icon: Clock,
      color: "text-status-pending"
    },
    {
      label: "Non analysé",
      value: stats ? stats.nonTransfered : 0,
      icon: ClockAlert,
      color: "text-status-new"
    },
    {
      label: "Validés",
      value: stats ? stats.validated : 0,
      icon: CheckCircle,
      color: "text-status-validated"
    },
    {
      label: "Rejetés",
      value: stats ? stats.rejected : 0,
      icon: XCircle,
      color: "text-status-rejected"
    }
  ];

  const scoreItems = [
    {
      label: 'Score moyen',
      value: stats? stats.averageScore : 0,
      color: 'text-primary'
    },
    {
      label: 'Taux de validation',
      value: stats? stats.averageValidated : 0,
      color: 'text-status-validated'
    },
    {
      label: 'Taux de rejet',
      value: stats? stats.averageRejected : 0,
      color: 'text-status-rejected'
    },
    {
      label: 'Niveau de confidentialité',
      value: stats? stats.averagePii : 0,
      color: 'text-status-rejected'
    },
    {
      label: 'Taux de similarité cosinus',
      value: stats? stats.averageCosine : 0,
      color: 'text-primary'
    },
    {
      label: 'Taux de distance de Levenshtein',
      value: stats? stats.averageLevenshtein : 0,
      color: 'text-status-validated'
    },

  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {statItems.map((item) => (
        <Card key={item.label} className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            <item.icon className={`${item.color} h-8 w-8`} />
          </div>
        </Card>
      ))}
      
      {/* Additional metrics */}
      {Array.from({ length: Math.ceil(scoreItems.length / 3) }).map((_, groupIndex) => (
        <Card key={groupIndex} className="col-span-2 lg:col-span-5 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
            {scoreItems
              .slice(groupIndex * 3, groupIndex * 3 + 3)
              .map((item, index) => (
                <div key={index}>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`text-xl font-semibold ${item.color}`}>
                    {item ? item.value.toFixed(2) : 0}%
                  </p>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}