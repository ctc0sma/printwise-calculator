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
import { useSession } from "@/context/SessionContext"; // Re-import useSession

const PrinterProfileManager = () => {
  const { userPrinterProfiles, addPrinterProfile, updatePrinterProfile, deletePrinterProfile } = useSettings();
  const { isGuest } = useSession(); // Use isGuest for disabling

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({ id: "", name: "", powerWatts: 0, type: "filament" as "filament" | "resin" | "both" });

  const handleAddProfile = async () => {
    if (!currentProfile.name || currentProfile.powerWatts <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
    await addPrinterProfile({
      name: currentProfile.name,
      powerWatts: currentProfile.powerWatts,
      type: currentProfile.type,
    });
    setIsAddDialogOpen(false);
    setCurrentProfile({ id: "", name: "", powerWatts: 0, type: "filament" });
  };

  const handleUpdateProfile = async () => {
    if (!currentProfile.name || currentProfile.powerWatts <= 0 || !currentProfile.id) {
      alert("Please fill in all fields correctly.");
      return;
      }
    await updatePrinterProfile(currentProfile.id, {
      name: currentProfile.name,
      powerWatts: currentProfile.powerWatts,
      type: currentProfile.type,
    });
    setIsEditDialogOpen(false);
    setCurrentProfile({ id: "", name: "", powerWatts: 0, type: "filament" });
  };

  const openEditDialog = (profile: typeof currentProfile) => {
    setCurrentProfile(profile);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Manage Printer Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userPrinterProfiles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No custom printer profiles added yet.</p>
        ) : (
          <div className="space-y-2">
            {userPrinterProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.powerWatts}W - {profile.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(profile as typeof currentProfile)}
                    disabled={isGuest} // Re-enabled guest restriction
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deletePrinterProfile(profile.id!)}
                    disabled={isGuest} // Re-enabled guest restriction
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
            <Button className="w-full" disabled={isGuest}> {/* Re-enabled guest restriction */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Printer Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Printer Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="printerName">Printer Name</Label>
                <Input
                  id="printerName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="powerWatts">Power (Watts)</Label>
                <Input
                  id="powerWatts"
                  type="number"
                  value={currentProfile.powerWatts}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, powerWatts: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="printerType">Type</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin" | "both") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="printerType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">Filament</SelectItem>
                    <SelectItem value="resin">Resin</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
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
              <DialogTitle>Edit Printer Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPrinterName">Printer Name</Label>
                <Input
                  id="editPrinterName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPowerWatts">Power (Watts)</Label>
                <Input
                  id="editPowerWatts"
                  type="number"
                  value={currentProfile.powerWatts}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, powerWatts: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPrinterType">Type</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin" | "both") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="editPrinterType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">Filament</SelectItem>
                    <SelectItem value="resin">Resin</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
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

export default PrinterProfileManager;