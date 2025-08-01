# Configuration du Storage Supabase pour les Images

## 🎯 **Objectif**
Configurer le bucket de storage Supabase pour permettre l'upload et l'affichage des images dans les souvenirs.

## 📋 **Étapes de Configuration**

### **1. Accéder à l'éditeur SQL de Supabase**
1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor** dans le menu de gauche
3. Cliquez sur **New Query**

### **2. Exécuter le script de configuration**
Copiez et collez le contenu du fichier `storage-setup.sql` dans l'éditeur SQL, puis cliquez sur **Run**.

### **3. Vérifier la configuration**
1. Allez dans **Storage** dans le menu de gauche
2. Vous devriez voir un bucket nommé `memories`
3. Le bucket doit être marqué comme **Public**

## 🔧 **Ce que fait le script**

### **Bucket Configuration**
- **Nom** : `memories`
- **Public** : `true` (accessible sans authentification)
- **Taille max** : 5MB par fichier
- **Types autorisés** : JPEG, PNG, GIF, WebP

### **Politiques RLS (Row Level Security)**
- **SELECT** : Les utilisateurs peuvent voir leurs propres images
- **INSERT** : Les utilisateurs peuvent uploader leurs propres images
- **UPDATE** : Les utilisateurs peuvent modifier leurs propres images
- **DELETE** : Les utilisateurs peuvent supprimer leurs propres images

## 🚀 **Structure des fichiers**
Les images sont organisées par utilisateur :
```
memories/
├── user-id-1/
│   ├── timestamp1.jpg
│   └── timestamp2.png
└── user-id-2/
    ├── timestamp3.gif
    └── timestamp4.webp
```

## ✅ **Test de la configuration**

1. **Créer un souvenir avec image** dans l'application
2. **Vérifier l'upload** dans le bucket `memories` de Supabase
3. **Vérifier l'affichage** dans la liste des souvenirs
4. **Vérifier l'affichage** dans les détails du souvenir

## 🛠️ **Dépannage**

### **Erreur "Bucket not found"**
- Vérifiez que le script `storage-setup.sql` a été exécuté
- Vérifiez que le bucket `memories` existe dans Storage

### **Erreur "Access denied"**
- Vérifiez que les politiques RLS sont correctement configurées
- Vérifiez que l'utilisateur est authentifié

### **Image ne s'affiche pas**
- Vérifiez que l'URL de l'image est correcte dans la base de données
- Vérifiez que le bucket est public
- Vérifiez les permissions du fichier dans Storage

## 📝 **Notes importantes**

- Les images sont automatiquement supprimées quand un souvenir est supprimé
- Les URLs des images sont publiques mais organisées par utilisateur
- La taille maximale est limitée à 5MB par image
- Seuls les formats d'image courants sont acceptés 