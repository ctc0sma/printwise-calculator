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
import { useSession } from "@/context/SessionContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

const PrinterProfileManager = () => {
  const { userPrinterProfiles, addPrinterProfile, updatePrinterProfile, deletePrinterProfile } = useSettings();
  const { isGuest } = useSession();
  const { t } = useTranslation(); // Initialize useTranslation

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({ id: "", name: "", powerWatts: 0, type: "filament" as "filament" | "resin" | "both" });

  const handleAddProfile = async () => {
    if (!currentProfile.name || currentProfile.powerWatts <= 0) {
      alert(t('profileManager.fillAllFields'));
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
      alert(t('profileManager.fillAllFields'));
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
        <CardTitle className="text-xl font-bold">{t('printerProfileManager.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userPrinterProfiles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t('printerProfileManager.noProfiles')}</p>
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
                    disabled={isGuest}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deletePrinterProfile(profile.id!)}
                    disabled={isGuest}
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
            <Button className="w-full" disabled={isGuest}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('printerProfileManager.addNewProfile')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('printerProfileManager.addNewProfile')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="printerName">{t('printerProfileManager.printerName')}</Label>
                <Input
                  id="printerName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="powerWatts">{t('printerProfileManager.powerWatts')}</Label>
                <Input
                  id="powerWatts"
                  type="number"
                  value={currentProfile.powerWatts}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, powerWatts: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="printerType">{t('printerProfileManager.type')}</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin" | "both") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="printerType">
                    <SelectValue placeholder={t('printerProfileManager.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">{t('printerProfileManager.filament')}</SelectItem>
                    <SelectItem value="resin">{t('printerProfileManager.resin')}</SelectItem>
                    <SelectItem value="both">{t('printerProfileManager.both')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleAddProfile}>{t('printerProfileManager.addProfile')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('printerProfileManager.editProfile')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPrinterName">{t('printerProfileManager.printerName')}</Label>
                <Input
                  id="editPrinterName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPowerWatts">{t('printerProfileManager.powerWatts')}</Label>
                <Input
                  id="editPowerWatts"
                  type="number"
                  value={currentProfile.powerWatts}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, powerWatts: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPrinterType">{t('printerProfileManager.type')}</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin" | "both") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="editPrinterType">
                    <SelectValue placeholder={t('printerProfileManager.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">{t('printerProfileManager.filament')}</SelectItem>
                    <SelectItem value="resin">{t('printerProfileManager.resin')}</SelectItem>
                    <SelectItem value="both">{t('printerProfileManager.both')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleUpdateProfile}>{t('printerProfileManager.saveChanges')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PrinterProfileManager;