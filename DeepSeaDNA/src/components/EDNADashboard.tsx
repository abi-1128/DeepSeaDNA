import React, { useState } from 'react';
import { DNAUpload } from './DNAUpload';
import { SpeciesCard, SpeciesData } from './SpeciesCard';
import { BiodiversityMetrics, BiodiversityData } from './BiodiversityMetrics';
import { SpeciesChart } from './SpeciesChart';
import { ThemeToggle } from './ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, RefreshCw, Dna, Waves, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data for demonstration
const mockSpeciesData: SpeciesData[] = [
  {
    id: 'SP001',
    name: 'Bathymodiolus thermophilus',
    isNovel: false,
    confidence: 94,
    abundance: 23.5,
    conservationStatus: 'normal',
    driftStatus: 'local',
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Bivalvia',
      family: 'Mytilidae',
      genus: 'Bathymodiolus'
    }
  },
  {
    id: 'SP002',
    name: 'Novel Species',
    isNovel: true,
    confidence: 76,
    abundance: 18.2,
    conservationStatus: 'normal',
    driftStatus: 'possible',
    taxonomy: {}
  },
  {
    id: 'SP003',
    name: 'Calyptogena magnifica',
    isNovel: false,
    confidence: 91,
    abundance: 15.7,
    conservationStatus: 'endangered',
    driftStatus: 'local',
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Mollusca',
      class: 'Bivalvia',
      family: 'Vesicomyidae',
      genus: 'Calyptogena'
    }
  },
  {
    id: 'SP004',
    name: 'Alvinella pompejana',
    isNovel: false,
    confidence: 87,
    abundance: 12.3,
    conservationStatus: 'normal',
    driftStatus: 'confirmed',
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Annelida',
      family: 'Alvinellidae',
      genus: 'Alvinella'
    }
  },
  {
    id: 'SP005',
    name: 'Novel Species',
    isNovel: true,
    confidence: 68,
    abundance: 10.8,
    conservationStatus: 'normal',
    driftStatus: 'possible',
    taxonomy: {}
  },
  {
    id: 'SP006',
    name: 'Riftia pachyptila',
    isNovel: false,
    confidence: 96,
    abundance: 9.4,
    conservationStatus: 'invasive',
    driftStatus: 'confirmed',
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Annelida',
      family: 'Siboglinidae',
      genus: 'Riftia'
    }
  }
];

const mockBiodiversityData: BiodiversityData = {
  shannon: 2.847,
  simpson: 0.156,
  chao1: 18.6,
  totalSpecies: 15,
  novelSpecies: 3,
  localSpecies: 8,
  driftedSpecies: 4,
  dominantSpecies: 'Bathymodiolus thermophilus'
};

export function EDNADashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    species: mockSpeciesData,
    biodiversity: mockBiodiversityData,
    metadata: {}
  });
  const { toast } = useToast();

  const handleAnalysisStart = async (file: File, metadata: any) => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setAnalysisData({
        species: mockSpeciesData,
        biodiversity: mockBiodiversityData,
        metadata
      });
      setIsAnalyzing(false);
      setShowResults(true);
      toast({
        title: "Analysis Complete",
        description: `Identified ${mockSpeciesData.length} species with ${mockBiodiversityData.novelSpecies} novel discoveries.`
      });
    }, 3000);
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
    setIsAnalyzing(false);
  };

  const generatePDFReport = async () => {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text('eDNA Biodiversity Analysis Report', 20, 30);
    
    // Summary
    pdf.setFontSize(12);
    pdf.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, 50);
    pdf.text(`Total Species Identified: ${analysisData.biodiversity.totalSpecies}`, 20, 60);
    pdf.text(`Novel Species: ${analysisData.biodiversity.novelSpecies}`, 20, 70);
    pdf.text(`Shannon Diversity Index: ${analysisData.biodiversity.shannon.toFixed(3)}`, 20, 80);
    
    // Species List
    pdf.text('Species Identified:', 20, 100);
    analysisData.species.forEach((species, index) => {
      const yPos = 110 + (index * 10);
      const name = species.isNovel ? 'Novel Species' : species.name;
      pdf.text(`${index + 1}. ${name} (${species.confidence}% confidence)`, 25, yPos);
    });
    
    pdf.save('edna-analysis-report.pdf');
    
    toast({
      title: "Report Generated",
      description: "PDF report has been downloaded successfully."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Dna className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  eDNA Biodiversity Analyzer
                </h1>
                <p className="text-xs text-muted-foreground">Deep Sea Taxonomic Identification</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showResults && (
              <>
                <Button variant="outline" onClick={handleNewAnalysis}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
                <Button onClick={generatePDFReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {!showResults && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-3xl font-bold">Analyze Environmental DNA</h2>
              <p className="text-lg text-muted-foreground">
                Upload your FASTA or FASTQ files to identify eukaryotic taxa, assess biodiversity, 
                and detect ecological patterns from deep-sea eDNA samples.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <Badge variant="outline" className="text-sm">
                  <Waves className="h-4 w-4 mr-1" />
                  Deep Sea Analysis
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Dna className="h-4 w-4 mr-1" />
                  Novel Species Detection
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Biodiversity Metrics
                </Badge>
              </div>
            </div>
            <DNAUpload onAnalysisStart={handleAnalysisStart} />
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="animate-spin text-primary">
              <Dna className="h-16 w-16" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Analyzing eDNA Sample...</h2>
              <p className="text-muted-foreground">
                Processing sequences, identifying taxa, and calculating biodiversity indices
              </p>
            </div>
          </div>
        )}

        {showResults && (
          <div className="space-y-8">
            {/* Analysis Summary */}
            <Card className="border-l-4 border-l-primary shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analysisData.biodiversity.totalSpecies}</div>
                    <div className="text-sm text-muted-foreground">Total Species</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{analysisData.biodiversity.novelSpecies}</div>
                    <div className="text-sm text-muted-foreground">Novel Discoveries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{analysisData.biodiversity.shannon.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Shannon Index</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biodiversity Metrics */}
            <BiodiversityMetrics data={analysisData.biodiversity} />

            <Separator />

            {/* Charts Section */}
            <SpeciesChart species={analysisData.species} />

            <Separator />

            {/* Species Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Species Identification Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisData.species.map((species) => (
                  <SpeciesCard key={species.id} species={species} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}