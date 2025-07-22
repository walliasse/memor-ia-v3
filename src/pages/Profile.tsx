import { useState } from "react";
import { User, Settings, Camera, Edit3, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    bio: "Passionné de voyages et de photographie, j'aime capturer les moments précieux de la vie quotidienne.",
    joinDate: "Janvier 2024",
    memoriesCount: 47
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Sauvegarder les modifications
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profil" />
      
      <div className="flex">
        <ProfileSidebar activeTab="profile" />
        
        {/* Contenu principal */}
        <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 ml-64">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Photo de profil et informations principales */}
            <Card className="bg-gradient-memory shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Photo de profil */}
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-gold rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-primary-foreground" />
                    </div>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-border"
                      variant="ghost"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Informations */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-serif font-semibold text-foreground">
                          {profileData.name}
                        </h2>
                        <p className="text-muted-foreground">{profileData.email}</p>
                      </div>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "default" : "outline"}
                        className={isEditing ? "bg-gradient-gold text-primary-foreground" : ""}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        {isEditing ? "Sauvegarder" : "Modifier"}
                      </Button>
                    </div>

                    {/* Statistiques */}
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Membre depuis {profileData.joinDate}</span>
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium text-foreground">{profileData.memoriesCount}</span> souvenirs
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations détaillées */}
            <Card className="bg-card shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground">
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background/50 border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background/50 border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-background/50 border-border resize-none"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground">
                        Sauvegarder les modifications
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Annuler
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground mb-2">À propos</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {profileData.bio}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistiques détaillées */}
            <Card className="bg-gradient-warm shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground">
                  Activité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">{profileData.memoriesCount}</div>
                    <div className="text-sm text-muted-foreground">Souvenirs</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Ce mois</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Jours actifs</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">23</div>
                    <div className="text-sm text-muted-foreground">Photos</div>
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