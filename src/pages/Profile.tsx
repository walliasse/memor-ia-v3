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
import { useMemories } from "@/contexts/MemoriesContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    birth_date: ""
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
        bio: profile.bio || "",
        birth_date: profile.birth_date || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await updateProfile({
      name: formData.name.trim() || null,
      bio: formData.bio.trim() || null,
      birth_date: formData.birth_date || null
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
    <div className="min-h-screen bg-background pt-20">
      <Header title="Profil" showBack={true} />
      
      <div className="flex min-h-screen bg-background">
        <ProfileSidebar activeTab="profile" />
        
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            {loading ? (
              <div className="space-y-6">
                <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <>
                {/* En-tête du profil */}
                <Card className="bg-gradient-memory shadow-warm border-border/50 mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-primary-foreground" />
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
                      <div className="space-y-2">
                        <h1 className="text-2xl font-serif font-bold text-foreground">
                          {profile?.name || "Utilisateur"}
                        </h1>
                        <div className="flex items-center justify-center text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="text-sm">{user?.email}</span>
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
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

                      {/* Actions */}
                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant={isEditing ? "outline" : "default"}
                          className="flex-1"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {isEditing ? "Annuler" : "Modifier"}
                        </Button>
                        
                        <Button
                          onClick={handleSignOut}
                          variant="outline"
                          className="flex-1"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                                {/* Formulaire d'édition */}
                <Card className="bg-card shadow-soft border-border/50">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Nom complet"
                        className="bg-background/50 border-border focus:bg-background"
                      />
                    </div>

                                         <div className="space-y-2">
                       <Input
                         id="email"
                         type="email"
                         value={user?.email || ""}
                         disabled
                         className="bg-muted border-border text-muted-foreground"
                         placeholder="Email"
                       />
                     </div>

                     <div className="space-y-2">
                       <Input
                         id="birth_date"
                         type="date"
                         value={formData.birth_date}
                         onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                         disabled={!isEditing}
                         className="bg-background/50 border-border focus:bg-background"
                         max={new Date().toISOString().split('T')[0]}
                       />
                       <Label htmlFor="birth_date" className="text-sm text-muted-foreground">
                         Date de naissance
                       </Label>
                     </div>

                     <div className="space-y-2">
                       <Textarea
                         id="bio"
                         value={formData.bio}
                         onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                         disabled={!isEditing}
                         placeholder="Biographie..."
                         className="min-h-20 bg-background/50 border-border focus:bg-background resize-none"
                       />
                     </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 bg-gradient-gold text-primary-foreground hover:opacity-90"
                        >
                          {saving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                          ) : null}
                          Sauvegarder
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                                                     onClick={() => {
                             setIsEditing(false);
                             setFormData({
                               name: profile?.name || "",
                               bio: profile?.bio || "",
                               birth_date: profile?.birth_date || ""
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