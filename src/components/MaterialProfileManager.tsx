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

const MaterialProfileManager = () => {
  const { userMaterialProfiles, addMaterialProfile, updateMaterialProfile, deleteMaterialProfile } = useSettings();
  const { isGuest } = useSession();
  const { t } = useTranslation(); // Initialize useTranslation

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({ id: "", name: "", costPerKg: 0, type: "filament" as "filament" | "resin" });

  const handleAddProfile = async () => {
    if (!currentProfile.name || currentProfile.costPerKg <= 0) {
      alert(t('profileManager.fillAllFields'));
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
      alert(t('profileManager.fillAllFields'));
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
        <CardTitle className="text-xl font-bold">{t('materialProfileManager.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userMaterialProfiles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t('materialProfileManager.noProfiles')}</p>
        ) : (
          <div className="space-y-2">
            {userMaterialProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.costPerKg} ({profile.type === 'filament' ? t('materialProfileManager.currencyPerKg') : t('materialProfileManager.currencyPerLiter')})</p>
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
                    onClick={() => deleteMaterialProfile(profile.id!)}
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
              <PlusCircle className="mr-2 h-4 w-4" /> {t('materialProfileManager.addNewProfile')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('materialProfileManager.addNewProfile')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="materialName">{t('materialProfileManager.materialName')}</Label>
                <Input
                  id="materialName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPerKg">{t('materialProfileManager.costPerKgLiter')}</Label>
                <Input
                  id="costPerKg"
                  type="number"
                  value={currentProfile.costPerKg}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, costPerKg: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materialType">{t('materialProfileManager.type')}</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="materialType">
                    <SelectValue placeholder={t('materialProfileManager.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">{t('materialProfileManager.filament')}</SelectItem>
                    <SelectItem value="resin">{t('materialProfileManager.resin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleAddProfile}>{t('materialProfileManager.addProfile')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('materialProfileManager.editProfile')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editMaterialName">{t('materialProfileManager.materialName')}</Label>
                <Input
                  id="editMaterialName"
                  value={currentProfile.name}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCostPerKg">{t('materialProfileManager.costPerKgLiter')}</Label>
                <Input
                  id="editCostPerKg"
                  type="number"
                  value={currentProfile.costPerKg}
                  onChange={(e) => setCurrentProfile({ ...currentProfile, costPerKg: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMaterialType">{t('materialProfileManager.type')}</Label>
                <Select
                  value={currentProfile.type}
                  onValueChange={(value: "filament" | "resin") => setCurrentProfile({ ...currentProfile, type: value })}
                >
                  <SelectTrigger id="editMaterialType">
                    <SelectValue placeholder={t('materialProfileManager.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filament">{t('materialProfileManager.filament')}</SelectItem>
                    <SelectItem value="resin">{t('materialProfileManager.resin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleUpdateProfile}>{t('materialProfileManager.saveChanges')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MaterialProfileManager;