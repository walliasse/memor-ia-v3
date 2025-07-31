import { useState } from "react";
import { Bell, Shield, Download, Trash2, LogOut, AlertTriangle, Palette, Upload, Search, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";
import ImportDataForm from "@/components/ImportDataForm";
import { useAuth } from "@/hooks/useAuth";
import { useMemories } from "@/hooks/useMemories";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: false,
    autoSave: true,
    language: "fr",
    exportFormat: "json"
  });
  const [loading, setLoading] = useState(false);

  const { user, signOut } = useAuth();
  const { memories, indexAllMemories } = useMemories();
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

  const handleIndexMemories = async () => {
    setLoading(true);
    try {
      const result = await indexAllMemories();
      if (result.success) {
        toast({
          title: "Indexation terminée",
          description: `${result.count} souvenirs ont été indexés pour la recherche Travel.`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReindexMemories = async () => {
    setLoading(true);
    try {
      // D'abord, nettoyer tous les embeddings existants
      const { data: allMemories, error: fetchError } = await supabase
        .from('memories')
        .select('id')
        .eq('user_id', user?.id);

      if (fetchError) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les souvenirs.",
          variant: "destructive"
        });
        return;
      }

      // Supprimer tous les embeddings existants
      const { error: updateError } = await supabase
        .from('memories')
        .update({ embedding: null } as any)
        .eq('user_id', user?.id);

      if (updateError) {
        toast({
          title: "Erreur",
          description: "Impossible de nettoyer les embeddings.",
          variant: "destructive"
        });
        return;
      }

      // Réindexer tous les souvenirs
      const result = await indexAllMemories();
      if (result.success) {
        toast({
          title: "Nettoyage et réindexation terminés",
          description: `${result.count} souvenirs ont été nettoyés et réindexés.`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Réglages" showBack={true} />
      
      <div className="flex">
        <ProfileSidebar activeTab="settings" />
        
        {/* Contenu principal */}
        <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 ml-64">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Intelligence Artificielle - Travel */}
            <Card className="bg-gradient-memory shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Intelligence Artificielle - Travel
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gérez l'indexation de vos souvenirs pour la recherche intelligente
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleIndexMemories}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Indexation..." : "Indexer tous les souvenirs"}
                  </Button>
                  <Button 
                    onClick={handleReindexMemories}
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    {loading ? "Nettoyage..." : "Nettoyer et réindexer"}
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p className="font-medium mb-1">ℹ️ À propos de Travel :</p>
                  <p>Travel utilise des embeddings OpenAI pour analyser le contenu de vos souvenirs et vous permettre de les rechercher en langage naturel. L'indexation génère des représentations vectorielles de vos souvenirs pour une recherche plus intelligente.</p>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications sur votre appareil
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des rappels par email pour écrire
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailReminders}
                    onCheckedChange={(checked) => handleSettingChange("emailReminders", checked)}
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">
                      Basculer entre le mode clair et sombre
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Langue</Label>
                    <p className="text-sm text-muted-foreground">
                      Choisir la langue de l'interface
                    </p>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange("language", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Données */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarder automatiquement vos brouillons
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Format d'export</Label>
                    <p className="text-sm text-muted-foreground">
                      Choisir le format pour l'export de données
                    </p>
                  </div>
                  <Select
                    value={settings.exportFormat}
                    onValueChange={(value) => handleSettingChange("exportFormat", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleExportData} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter mes données
                  </Button>
                  <ImportDataForm />
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleSignOut} variant="outline" className="flex-1">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Attention
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      La suppression de compte est définitive et ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 