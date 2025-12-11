import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart, Waves } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface BiodiversityData {
  shannon: number;
  simpson: number;
  chao1: number;
  totalSpecies: number;
  novelSpecies: number;
  localSpecies: number;
  driftedSpecies: number;
  dominantSpecies: string;
}

interface BiodiversityMetricsProps {
  data: BiodiversityData;
}

export function BiodiversityMetrics({ data }: BiodiversityMetricsProps) {
  const getShannonBadge = (shannon: number) => {
    if (shannon > 3) return <Badge className="bg-success text-white">High Diversity</Badge>;
    if (shannon > 2) return <Badge className="bg-warning text-white">Moderate Diversity</Badge>;
    return <Badge className="bg-danger text-white">Low Diversity</Badge>;
  };

  const getDriftRatio = () => {
    const total = data.localSpecies + data.driftedSpecies;
    return total > 0 ? (data.driftedSpecies / total) * 100 : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Shannon Diversity */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-primary" />
            Shannon Diversity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{data.shannon.toFixed(3)}</div>
            {getShannonBadge(data.shannon)}
            <div className="text-xs text-muted-foreground">
              Measures species richness and evenness
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simpson Index */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChart className="h-5 w-5 text-primary" />
            Simpson Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{data.simpson.toFixed(3)}</div>
            <Progress value={data.simpson * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Probability of dominance
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chao1 Estimator */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Chao1 Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold">{Math.round(data.chao1)}</div>
            <div className="text-sm text-muted-foreground">
              vs {data.totalSpecies} observed
            </div>
            <div className="text-xs text-muted-foreground">
              Estimated total species richness
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drift Analysis */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Waves className="h-5 w-5 text-primary" />
            Drift Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">🏝 Local: {data.localSpecies}</span>
              <span className="text-sm">🌊 Drifted: {data.driftedSpecies}</span>
            </div>
            <Progress value={getDriftRatio()} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {getDriftRatio().toFixed(1)}% potentially drifted
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Species Summary */}
      <Card className="md:col-span-2 xl:col-span-4 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Species Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{data.totalSpecies}</div>
              <div className="text-sm text-muted-foreground">Total Species</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">{data.novelSpecies}</div>
              <div className="text-sm text-muted-foreground">Novel Species</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{data.localSpecies}</div>
              <div className="text-sm text-muted-foreground">Local Species</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-lg font-bold text-primary truncate">{data.dominantSpecies}</div>
              <div className="text-sm text-muted-foreground">Dominant Species</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}