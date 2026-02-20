"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { MapPin, Activity, Shield, ArrowLeft } from "lucide-react";

interface HealthTrendsProps {
  onBack: () => void;
}

export function HealthTrends({ onBack }: HealthTrendsProps) {
  const [diseases] = useState([
    {
      name: "Dengue",
      cases: 42,
      measures:
        "Use mosquito repellents, keep surroundings clean, and avoid stagnant water.",
    },
    {
      name: "Seasonal Flu",
      cases: 76,
      measures:
        "Wear masks in crowded areas, maintain hygiene, and get flu vaccination.",
    },
    {
      name: "Conjunctivitis",
      cases: 25,
      measures:
        "Avoid touching eyes, wash hands regularly, don’t share towels or cosmetics.",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Neighbourhood Health Trends
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Map Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              <MapPin className="h-5 w-5 text-blue-600" />
              Live Disease Spread Map
            </h2>
            <div className="w-full h-96 rounded-lg border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-center">
              {/* Placeholder for interactive map */}
              <p className="text-gray-500">
                🗺️ Interactive map showing neighbourhood disease hotspots will
                appear here.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              *Dotted regions on the map indicate recent disease cases in your
              neighbourhood. Darker clusters = higher density.
            </p>
          </CardContent>
        </Card>

        {/* Disease Summary Section */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              <Activity className="h-5 w-5 text-green-600" />
              Recently Spreading Diseases
            </h2>
            <div className="grid md:grid-cols-3 gap-6 p-6">
              {diseases.map((disease, idx) => (
                <Card
                  key={idx}
                  className="p-4 hover:shadow-lg transition-shadow border border-blue-100"
                >
                  <h3 className="text-lg font-medium text-gray-800">
                    {disease.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {disease.cases} cases nearby
                  </p>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 mt-1" />
                    <p className="text-sm text-gray-600">{disease.measures}</p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
