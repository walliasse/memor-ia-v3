import { useState, useEffect } from "react";
import { User, Settings, Camera, Edit3, Mail, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useMemories } from "@/hooks/useMemories";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: ""
  });
  
  const { profile, loading, saving, updateProfile } = useProfile();
  const { user, signOut } = useAuth();
  const { memories } = useMemories();
  const navigate = useNavigate();

  // Initialiser le formulaire quand le profil se charge
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await updateProfile({
      name: formData.name.trim() || null,
      bio: formData.bio.trim() || null
    });
    
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate("/");
    }
  };

  const formatJoinDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profil" />
      
      <div className="flex min-h-screen bg-background">
        <ProfileSidebar activeTab="profile" />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
            {loading ? (
              <div className="space-y-6">
                <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <>
                {/* En-tête du profil */}
                <Card className="bg-gradient-memory shadow-warm border-border/50 mb-6">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-gold rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground" />
                        </div>
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background shadow-md"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Informations principales */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                              {profile?.name || "Utilisateur"}
                            </h1>
                            <div className="flex items-center text-muted-foreground mt-1">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{user?.email}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setIsEditing(!isEditing)}
                              variant={isEditing ? "outline" : "default"}
                              className="shrink-0"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              {isEditing ? "Annuler" : "Modifier"}
                            </Button>
                            
                            <Button
                              onClick={handleSignOut}
                              variant="outline"
                              className="shrink-0"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Déconnexion
                            </Button>
                          </div>
                        </div>

                        {/* Statistiques */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                          {profile?.created_at && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Membre depuis {formatJoinDate(profile.created_at)}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-foreground">{memories.length}</span> souvenir{memories.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulaire d'édition */}
                <Card className="bg-card shadow-soft border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg text-foreground">
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Votre nom"
                          className="bg-background/50 border-border focus:bg-background dark:bg-input dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground dark:disabled:bg-muted dark:disabled:text-muted-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted border-border text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                                              <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Parlez-nous de vous..."
                          className="min-h-24 bg-background/50 border-border focus:bg-background resize-none dark:bg-input dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground dark:disabled:bg-muted dark:disabled:text-muted-foreground"
                        />
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleSave}
                          disabled={saving}
                          className="bg-gradient-gold text-primary-foreground hover:opacity-90"
                        >
                          {saving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                          ) : null}
                          Sauvegarder les modifications
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: profile?.name || "",
                              bio: profile?.bio || ""
                            });
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 