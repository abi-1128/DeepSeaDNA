import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, MapPin, Waves } from 'lucide-react';

export interface SpeciesData {
  id: string;
  name: string;
  isNovel: boolean;
  confidence: number;
  abundance: number;
  conservationStatus: 'normal' | 'invasive' | 'endangered';
  driftStatus: 'local' | 'possible' | 'confirmed';
  taxonomy: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    family?: string;
    genus?: string;
  };
}

interface SpeciesCardProps {
  species: SpeciesData;
}

export function SpeciesCard({ species }: SpeciesCardProps) {
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge className="bg-confidence-high text-white">High ({confidence}%)</Badge>;
    } else if (confidence >= 70) {
      return <Badge className="bg-confidence-medium text-white">Medium ({confidence}%)</Badge>;
    } else {
      return <Badge className="bg-confidence-low text-white">Low ({confidence}%)</Badge>;
    }
  };

  const getConservationBadge = (status: string) => {
    const badges = {
      normal: <Badge className="bg-conservation-normal text-white">🟢 Normal</Badge>,
      invasive: <Badge className="bg-conservation-invasive text-white">🟡 Invasive</Badge>,
      endangered: <Badge className="bg-conservation-endangered text-white">🔴 Endangered</Badge>
    };
    return badges[status as keyof typeof badges];
  };

  const getDriftBadge = (status: string) => {
    const badges = {
      local: <Badge className="bg-drift-local text-white">🏝 Local</Badge>,
      possible: <Badge className="bg-drift-possible text-white">🟡 Possibly Drifted</Badge>,
      confirmed: <Badge className="bg-drift-confirmed text-white">🌊 Drifted</Badge>
    };
    return badges[status as keyof typeof badges];
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className={species.isNovel ? 'text-warning' : 'text-foreground'}>
            {species.isNovel ? '🧬 Novel Species' : species.name}
          </span>
          {species.isNovel && <AlertTriangle className="h-5 w-5 text-warning" />}
          {!species.isNovel && <CheckCircle className="h-5 w-5 text-success" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Taxonomy */}
        {!species.isNovel && (
          <div className="text-sm text-muted-foreground">
            {species.taxonomy.family && <span>Family: {species.taxonomy.family}</span>}
            {species.taxonomy.genus && <span> • Genus: {species.taxonomy.genus}</span>}
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {getConfidenceBadge(species.confidence)}
          {getConservationBadge(species.conservationStatus)}
          {getDriftBadge(species.driftStatus)}
        </div>

        {/* Abundance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Relative Abundance</span>
            <span className="font-medium">{species.abundance.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(species.abundance * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            ID: {species.id}
          </span>
          <span className="flex items-center gap-1">
            <Waves className="h-3 w-3" />
            Deep Sea
          </span>
        </div>
      </CardContent>
    </Card>
  );
}