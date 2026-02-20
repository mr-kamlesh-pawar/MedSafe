import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Shield, AlertTriangle, AlertCircle, Info, CheckCircle, XCircle, Pill } from 'lucide-react';

interface SideEffect {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: string;
  description: string;
  percentage: number;
}

interface Alternative {
  name: string;
  reason: string;
  safetyScore: number;
}

interface ResultsProps {
  medicine: string;
  onBack: () => void;
  onNewSearch: () => void;
}

const mockResults: Record<string, {
  overallSafety: 'safe' | 'moderate' | 'risky';
  safetyScore: number;
  sideEffects: SideEffect[];
  alternatives: Alternative[];
  description: string;
}> = {
  'aspirin': {
    overallSafety: 'moderate',
    safetyScore: 75,
    description: 'Aspirin is a common pain reliever and anti-inflammatory medication. Generally safe for most adults when used as directed.',
    sideEffects: [
      { name: 'Stomach upset', severity: 'mild', frequency: 'Common', description: 'May cause nausea, heartburn, or stomach pain', percentage: 15 },
      { name: 'Bleeding risk', severity: 'severe', frequency: 'Rare', description: 'Increased risk of bleeding, especially with long-term use', percentage: 5 },
      { name: 'Dizziness', severity: 'mild', frequency: 'Uncommon', description: 'May cause mild dizziness or lightheadedness', percentage: 8 },
      { name: 'Allergic reaction', severity: 'severe', frequency: 'Very rare', description: 'Severe allergic reactions including difficulty breathing', percentage: 1 }
    ],
    alternatives: [
      { name: 'Paracetamol', reason: 'Less stomach irritation', safetyScore: 85 },
      { name: 'Ibuprofen', reason: 'Similar effectiveness with different risk profile', safetyScore: 78 }
    ]
  },
  'paracetamol': {
    overallSafety: 'safe',
    safetyScore: 88,
    description: 'Paracetamol is one of the safest pain relievers available when used correctly. Low risk of side effects for most people.',
    sideEffects: [
      { name: 'Liver damage', severity: 'severe', frequency: 'Very rare', description: 'Risk of liver damage with overdose', percentage: 2 },
      { name: 'Skin rash', severity: 'mild', frequency: 'Rare', description: 'May cause mild skin reactions in sensitive individuals', percentage: 3 },
      { name: 'Nausea', severity: 'mild', frequency: 'Uncommon', description: 'Mild nausea, especially on empty stomach', percentage: 4 }
    ],
    alternatives: [
      { name: 'Ibuprofen', reason: 'Anti-inflammatory properties', safetyScore: 78 }
    ]
  },
  'ibuprofen': {
    overallSafety: 'moderate',
    safetyScore: 72,
    description: 'Ibuprofen is an effective anti-inflammatory pain reliever. Use with caution if you have stomach, heart, or kidney issues.',
    sideEffects: [
      { name: 'Stomach irritation', severity: 'moderate', frequency: 'Common', description: 'Can cause stomach pain, ulcers, or bleeding', percentage: 20 },
      { name: 'Kidney problems', severity: 'severe', frequency: 'Rare', description: 'Long-term use may affect kidney function', percentage: 3 },
      { name: 'Heart issues', severity: 'severe', frequency: 'Rare', description: 'May increase risk of heart attack or stroke', percentage: 2 },
      { name: 'Headache', severity: 'mild', frequency: 'Uncommon', description: 'Paradoxical headache with overuse', percentage: 7 }
    ],
    alternatives: [
      { name: 'Paracetamol', reason: 'Safer for stomach and heart', safetyScore: 88 },
      { name: 'Topical gel', reason: 'Reduced systemic side effects', safetyScore: 90 }
    ]
  }
};

export function Results({ medicine, onBack, onNewSearch }: ResultsProps) {
  const result = mockResults[medicine.toLowerCase()] || {
    overallSafety: 'moderate' as const,
    safetyScore: 65,
    description: `${medicine} is a medication with various effects. Consult your healthcare provider for personalized advice.`,
    sideEffects: [
      { name: 'Common side effects', severity: 'moderate' as const, frequency: 'Variable', description: 'Side effects may vary by individual', percentage: 10 },
      { name: 'Allergic reactions', severity: 'severe' as const, frequency: 'Rare', description: 'Always watch for signs of allergic reactions', percentage: 2 }
    ],
    alternatives: []
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: Info };
      case 'moderate':
        return { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', icon: AlertTriangle };
      case 'severe':
        return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', icon: AlertCircle };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: Info };
    }
  };

  const getSafetyIcon = (safety: string) => {
    switch (safety) {
      case 'safe':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'moderate':
        return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'risky':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { icon: Shield, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const safetyInfo = getSafetyIcon(result.overallSafety);
  const SafetyIcon = safetyInfo.icon;

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
            <div className="flex-1">
              <h1 className="text-xl text-gray-900 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-600" />
                Results for {medicine}
              </h1>
            </div>
            <Button onClick={onNewSearch} variant="outline">
              New Search
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Safety Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${safetyInfo.bg}`}>
                <SafetyIcon className={`h-6 w-6 ${safetyInfo.color}`} />
              </div>
              <div>
                <h2>Safety Assessment</h2>
                <p className="text-muted-foreground text-sm">Based on general population data</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Safety Score</span>
                  <span className="text-2xl">{result.safetyScore}/100</span>
                </div>
                <Progress value={result.safetyScore} className="h-3" />
              </div>
              <p className="text-muted-foreground">{result.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Side Effects */}
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Potential Side Effects</h2>
          <div className="grid gap-4">
            {result.sideEffects.map((effect, index) => {
              const colors = getSeverityColor(effect.severity);
              const IconComponent = colors.icon;
              
              return (
                <Card 
                  key={index} 
                  className={`${colors.bg} ${colors.border} transition-all hover:shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-5 w-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`${colors.text} capitalize`}>{effect.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={effect.severity === 'severe' ? 'destructive' : 'secondary'}
                              className="capitalize"
                            >
                              {effect.severity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{effect.percentage}%</span>
                          </div>
                        </div>
                        <p className={`text-sm ${colors.text} opacity-80 mb-2`}>
                          {effect.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Frequency: {effect.frequency}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Alternatives */}
        {result.alternatives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Recommended Alternatives</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {result.alternatives.map((alt, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg">{alt.name}</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {alt.safetyScore}/100
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{alt.reason}</p>
                    <Progress value={alt.safetyScore} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 mb-1">Important Medical Disclaimer</p>
                <p className="text-amber-700">
                  This information is for educational purposes only and should not replace professional medical advice. 
                  Individual reactions may vary. Always consult with your healthcare provider before starting, stopping, 
                  or changing any medication. Seek immediate medical attention if you experience severe side effects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}