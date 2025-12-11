import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpeciesData } from './SpeciesCard';

interface SpeciesChartProps {
  species: SpeciesData[];
}

export function SpeciesChart({ species }: SpeciesChartProps) {
  const pieData = species.slice(0, 8).map((s, index) => ({
    name: s.isNovel ? `Novel ${index + 1}` : s.name.split(' ').slice(0, 2).join(' '),
    value: s.abundance,
    color: s.isNovel ? '#f59e0b' : ['#0ea5e9', '#06b6d4', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#84cc16', '#f472b6'][index % 8]
  }));

  const barData = species.slice(0, 10).map((s, index) => ({
    name: s.isNovel ? `Novel ${index + 1}` : s.name.split(' ').slice(-1)[0],
    abundance: s.abundance,
    confidence: s.confidence
  }));

  const conservationData = [
    { status: 'Normal', count: species.filter(s => s.conservationStatus === 'normal').length, color: '#10b981' },
    { status: 'Invasive', count: species.filter(s => s.conservationStatus === 'invasive').length, color: '#f59e0b' },
    { status: 'Endangered', count: species.filter(s => s.conservationStatus === 'endangered').length, color: '#ef4444' }
  ];

  const driftData = [
    { status: 'Local', count: species.filter(s => s.driftStatus === 'local').length, color: '#10b981' },
    { status: 'Possible Drift', count: species.filter(s => s.driftStatus === 'possible').length, color: '#f59e0b' },
    { status: 'Drifted', count: species.filter(s => s.driftStatus === 'confirmed').length, color: '#0ea5e9' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {`Abundance: ${payload[0].value.toFixed(2)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Species Distribution Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="abundance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="abundance">Abundance</TabsTrigger>
            <TabsTrigger value="confidence">Confidence</TabsTrigger>
            <TabsTrigger value="conservation">Conservation</TabsTrigger>
            <TabsTrigger value="drift">Drift Status</TabsTrigger>
          </TabsList>

          <TabsContent value="abundance" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="confidence" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="conservation" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conservationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {conservationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="drift" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={driftData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="status" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}