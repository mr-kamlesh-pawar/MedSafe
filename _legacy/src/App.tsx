import React, { useState } from "react";
import { Registration } from "./components/Registration";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Results } from "./components/Results";
import { Profile } from "./components/Profile";
import { HealthTrends } from "./components/HealthTrends";

type AppState =
  | "login"
  | "register"
  | "home"
  | "results"
  | "profile"
  | "healthTrends";

export default function App() {
  const [currentView, setCurrentView] = useState<AppState>("login");
  const [searchedMedicine, setSearchedMedicine] = useState<string>("");

  const handleLogin = () => {
    setCurrentView("home");
  };

  const handleRegister = () => {
    setCurrentView("home");
  };

  const handleSwitchToRegister = () => {
    setCurrentView("register");
  };

  const handleSwitchToLogin = () => {
    setCurrentView("login");
  };

  const handleSearch = (medicine: string) => {
    setSearchedMedicine(medicine);
    setCurrentView("results");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleNewSearch = () => {
    setCurrentView("home");
    setSearchedMedicine("");
  };

  const handleHealthTrends = () => {
    setCurrentView("healthTrends");
    setSearchedMedicine("");
  };

  const handleProfile = () => {
    setCurrentView("profile");
    setSearchedMedicine("");
  };

  const handleLogout = () => {
    setCurrentView("login");
    setSearchedMedicine("");
  };

  switch (currentView) {
    case "register":
      return (
        <Registration
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
    case "login":
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    case "profile":
      return (
        <Profile onBack={handleBackToHome} onNewSearch={handleNewSearch} />
      );
    case "home":
      return (
        <Home
          onSearch={handleSearch}
          onLogout={handleLogout}
          onProfile={handleProfile}
          onHealthTrends={handleHealthTrends}
        />
      );
    case "results":
      return (
        <Results
          medicine={searchedMedicine}
          onBack={handleBackToHome}
          onNewSearch={handleNewSearch}
        />
      );
    case "healthTrends":
      return <HealthTrends onBack={handleBackToHome} />;
    default:
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
  }
}
