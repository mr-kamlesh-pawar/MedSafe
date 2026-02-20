import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { User, Save, Edit3, ArrowLeft } from "lucide-react";

interface ProfileProps {
  onBack: () => void;
  onNewSearch: () => void;
}

export function Profile({ onBack, onNewSearch }: ProfileProps) {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Esha",
    lastName: "Chavan",
    gender: "Female",
    country: "India",
    age: 20,
    weight: 53,
    email: "esha@example.com",
    profilePic: "",
    medicalHistory: "No chronic illnesses. Recently donated blood.",
  });

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Profile Saved:", profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-200 to-green-200 p-2">
        {/* Profile Header */}
        <Card>
          <CardContent className="flex justify-between items-center p-6">
            <div className="flex items-center gap-4">
              <div className="w-30 h-30 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center overflow-hidden">
                {profile.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>
            {!editing ? (
              <Button
                className="bg-green-600 hover:bg-green-700"
                variant="default"
                onClick={() => setEditing(true)}
              >
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mt-6">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-6 p-3">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600 p-0">
                  First Name
                </label>
                <Input
                  placeholder="First Name"
                  value={`${profile.firstName}`}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600 p-0">
                  Last Name
                </label>
                <Input
                  placeholder="Last Name"
                  value={`${profile.lastName}`}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600 p-0">
                  Gender
                </label>
                <Input
                  placeholder="Gender"
                  value={profile.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600 p-0">
                  Country
                </label>
                <Input
                  placeholder="Country"
                  value={profile.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600 p-0">
                  Age
                </label>
                <Input
                  placeholder="Age"
                  value={profile.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-600 p-0">
                  Weight (kgs)
                </label>
                <Input
                  placeholder="Weight"
                  value={profile.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  disabled={!editing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Section */}
        <Card className="mt-6">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Medical History
            </h3>{" "}
            <Textarea
              rows={5}
              placeholder="Enter your medical history"
              value={profile.medicalHistory}
              onChange={(e) => handleChange("medicalHistory", e.target.value)}
              disabled={!editing}
            />{" "}
          </CardContent>{" "}
        </Card>
      </div>
    </div>
  );
}
