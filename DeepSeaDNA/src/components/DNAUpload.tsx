import React, { useCallback } from 'react';
import { Upload, FileText, Dna } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface DNAUploadProps {
  onAnalysisStart: (file: File, metadata: any) => void;
}

export function DNAUpload({ onAnalysisStart }: DNAUploadProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [metadata, setMetadata] = React.useState({
    location: '',
    depth: '',
    temperature: '',
    notes: ''
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.name.endsWith('.fasta') || droppedFile.name.endsWith('.fastq') || droppedFile.name.endsWith('.fa') || droppedFile.name.endsWith('.fq'))) {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file format",
        description: "Please upload a FASTA (.fasta, .fa) or FASTQ (.fastq, .fq) file.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a DNA sequence file to analyze.",
        variant: "destructive"
      });
      return;
    }

    onAnalysisStart(file, metadata);
    toast({
      title: "Analysis started",
      description: "Your eDNA sample is being processed...",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="h-6 w-6 text-primary" />
          eDNA Sample Upload
        </CardTitle>
        <CardDescription>
          Upload your FASTA or FASTQ files for taxonomic identification and biodiversity analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragActive ? 'border-primary bg-accent/50' : 'border-muted-foreground/25'
          } ${file ? 'border-success bg-success/5' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".fasta,.fastq,.fa,.fq"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-success" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium">Drop your DNA sequence file here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (.fasta, .fastq, .fa, .fq)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Sampling Location</Label>
            <Input
              id="location"
              placeholder="e.g., Pacific Deep Sea"
              value={metadata.location}
              onChange={(e) => setMetadata({ ...metadata, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depth">Depth (m)</Label>
            <Input
              id="depth"
              type="number"
              placeholder="e.g., 2000"
              value={metadata.depth}
              onChange={(e) => setMetadata({ ...metadata, depth: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="e.g., 4.2"
              value={metadata.temperature}
              onChange={(e) => setMetadata({ ...metadata, temperature: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional sampling notes..."
              className="resize-none"
              rows={3}
              value={metadata.notes}
              onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!file}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
        >
          <Dna className="h-5 w-5 mr-2" />
          Analyze eDNA Sample
        </Button>
      </CardContent>
    </Card>
  );
}