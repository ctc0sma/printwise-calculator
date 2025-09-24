"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, PlusCircle } from "lucide-react";
// import { useSession } from "@/context/SessionContext"; // No longer needed for disabling

const MaterialProfileManager = () => {
  const { userMaterialProfiles, addMaterialProfile, updateMaterialProfile, deleteMaterialProfile } = useSettings();
  // const { isGuest } = useSession(); // No longer used for disabling

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({ id: "", name: "", costPerKg: 0, type: "filament" as "filament" | "resin" });

  const handleAddProfile = async () => {
    if (!currentProfile.name || currentProfile.costPerKg <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
    await addMaterialProfile({
      name: currentProfile.name,
      costPerKg: currentProfile.costPerKg,
      type: currentProfile.type,
    });
    setIsAddDialogOpen(false);
    setCurrentProfile({ id: "", name: "", costPerKg: 0, type: "filament" });
  };

  const handleUpdateProfile = async () => {
    if (!currentProfile.name || currentProfile.costPerKg <= 0 || !currentProfile.id) {
      alert("Please fill in all fields correctly.");
      return;
    }
    await updateMaterialProfile(currentProfile.id, {
      name: currentProfile.name,
      costPerKg: currentProfile.costPerKg,
      type: currentProfile.type,
    });
    setIsEditDialogOpen(false);
    setCurrentProfile({ id: "", name: "", costPerKg: 0, type: "filament" });
  };

  const openEditDialog = (profile: typeof currentProfile) => {
    setCurrentProfile(profile);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Manage Material Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userMaterialProfiles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No custom material profiles added yet.</p>
        ) : (
          <div className="space-y-2">
            {userMaterialProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.costPerKg} ({profile.type === 'filament' ? '€/kg' : '€/L'})</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(profile as typeof currentProfile)}
                    // disabled={isGuest} // Removed guest restriction
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMaterialProfile(profile.id!)}
                    // disabled={isGuest} // Removed guest restriction
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" /* disabled={isGuest} */> {/* Removed guest restriction */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Material Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Material Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="materialName">Material Name</Label>
                <Input
                  id="materialName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPerKg">Cost per Kg/Liter</Label>
                <Input
                  id="costPerKg"
                  type="number"
                  value={currentProfile.costPerKg}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, costPerKg: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materialType">Type</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="materialType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">Filament</SelectItem>
                    <SelectItem value="resin">Resin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProfile}>Add Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Material Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editMaterialName">Material Name</Label>
                <Input
                  id="editMaterialName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCostPerKg">Cost per Kg/Liter</Label>
                <Input
                  id="editCostPerKg"
                  type="number"
                  value={currentProfile.costPerKg}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, costPerKg: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMaterialType">Type</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="editMaterialType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">Filament</SelectItem>
                    <SelectItem value="resin">Resin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MaterialProfileManager;