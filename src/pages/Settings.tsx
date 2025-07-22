import { useState } from "react";
import { Bell, Shield, Download, Trash2, LogOut, AlertTriangle, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useMemories } from "@/hooks/useMemories";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: false,
    autoSave: true,
    language: "fr",
    exportFormat: "json"
  });

  const { signOut } = useAuth();
  const { memories } = useMemories();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Paramètre mis à jour",
      description: `${key} a été modifié.`,
    });
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate("/");
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      memories: memories,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memor-ia-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Vos données ont été téléchargées.",
    });
  };

  const handleDeleteAccount = async () => {
    // Pour l'instant, on fait juste une déconnexion
    // Dans un vrai projet, il faudrait appeler une API pour supprimer le compte
    toast({
      title: "Fonctionnalité à venir",
      description: "La suppression de compte sera disponible prochainement.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Réglages" />
      
      <div className="flex">
        <ProfileSidebar activeTab="settings" />
        
        {/* Contenu principal */}
        <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 ml-64">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Notifications */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications" className="text-base font-medium">
                      Notifications push
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications pour les rappels et mises à jour
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-reminders" className="text-base font-medium">
                      Rappels par email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des rappels hebdomadaires pour écrire vos souvenirs
                    </p>
                  </div>
                  <Switch
                    id="email-reminders"
                    checked={settings.emailReminders}
                    onCheckedChange={(checked) => handleSettingChange('emailReminders', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Apparence */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-primary" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="text-base font-medium">
                      Mode sombre
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Basculer vers un thème sombre pour vos yeux
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => {
                      toggleTheme();
                      toast({
                        title: "Thème mis à jour",
                        description: `Mode ${checked ? 'sombre' : 'clair'} activé.`,
                      });
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Langue</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Confidentialité */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Confidentialité et sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save" className="text-base font-medium">
                      Sauvegarde automatique
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarder automatiquement vos souvenirs en cours d'écriture
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Modifier le mot de passe
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger mes données
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Export et sauvegarde */}
            <Card className="bg-gradient-warm shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Download className="h-5 w-5 mr-2 text-primary" />
                  Export et sauvegarde
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Format d'export</Label>
                  <Select value={settings.exportFormat} onValueChange={(value) => handleSettingChange('exportFormat', value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="txt">Texte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-gold text-primary-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter mes souvenirs
                  </Button>
                  <Button variant="outline">
                    Créer une sauvegarde
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Zone dangereuse */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-destructive flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Zone dangereuse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Supprimer mon compte</h3>
                  <p className="text-sm text-muted-foreground">
                    Cette action est irréversible. Tous vos souvenirs ({memories.length}) seront définitivement supprimés.
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Tous vos {memories.length} souvenirs seront définitivement supprimés.
                        Voulez-vous d'abord exporter vos données ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Oui, supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 