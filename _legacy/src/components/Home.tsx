import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Pill,
  Shield,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  User,
  LogOut,
} from "lucide-react";

interface HomeProps {
  onSearch: (medicine: string) => void;
  onLogout: () => void;
  onProfile: () => void;
  onHealthTrends: () => void;
}

export function Home({
  onSearch,
  onLogout,
  onProfile,
  onHealthTrends,
}: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches] = useState([
    "Aspirin",
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleRecentSearch = (medicine: string) => {
    setSearchTerm(medicine);
    onSearch(medicine);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">MedSafe</h1>
                <p className="text-xs text-muted-foreground">
                  Drug Safety Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onHealthTrends}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Health Trends
              </Button>
              <Button variant="ghost" size="sm" onClick={onProfile}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Welcome to MedSafe
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Check if your medicine is safe for you
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get instant insights about potential side effects and safety
            information for any medication. Our AI-powered system analyzes drug
            interactions and provides personalized recommendations.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50/50 to-green-50/50">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter medicine name (e.g., Aspirin, Paracetamol, Ibuprofen...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={!searchTerm.trim()}
              >
                <Search className="h-5 w-5 mr-2" />
                Check Medicine Safety
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-600" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((medicine, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentSearch(medicine)}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    {medicine}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2">Safety First</h3>
            <p className="text-muted-foreground text-sm">
              Comprehensive safety analysis based on your profile and medical
              history
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="mb-2">Side Effect Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Detailed breakdown of potential side effects with severity levels
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2">Alternative Suggestions</h3>
            <p className="text-muted-foreground text-sm">
              Get recommendations for safer alternatives when available
            </p>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 mb-1">Medical Disclaimer</p>
                <p className="text-amber-700">
                  This tool provides general information only and should not
                  replace professional medical advice. Always consult with your
                  healthcare provider before making any changes to your
                  medication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
