# 📥 Import des données depuis memor.ia v1

## 🎯 Vue d'ensemble

Cette fonctionnalité permet d'importer les données exportées depuis memor.ia v1 vers la nouvelle version v2 (React + Vite + Supabase).

## 🚀 Comment utiliser l'import

### Étape 1 : Exporter depuis v1
1. Connectez-vous à votre ancienne version de memor.ia
2. Allez dans les paramètres/réglages
3. Utilisez la fonction "Exporter mes données"
4. Téléchargez le fichier JSON généré

### Étape 2 : Importer vers v2
1. Connectez-vous à memor.ia v2
2. Allez dans **Réglages** > **Import depuis memor.ia v1**
3. Glissez-déposez votre fichier JSON ou cliquez pour le sélectionner
4. Cliquez sur "Importer les données"
5. Attendez la fin du processus (barre de progression)

## 🔒 Sécurité

- ✅ **Vérification d'identité** : Seules vos propres données peuvent être importées
- ✅ **Validation stricte** : Chaque enregistrement est validé individuellement
- ✅ **Pas de corruption** : Les erreurs n'affectent pas vos données existantes
- ✅ **Gestion des doublons** : Les souvenirs avec le même ID sont mis à jour

## 📊 Données supportées

### ✅ Importées automatiquement
- **Souvenirs** : Contenu, date, images, tags, embeddings
- **Profil utilisateur** : Nom, prénom, date de naissance, favoris
- **Métadonnées** : Dates de création, identifiants uniques

### ⚠️ Adaptations automatiques
- **Structure v1 → v2** : Conversion automatique des champs
- **Champs manquants** : Valeurs par défaut appliquées
- **Format des dates** : Normalisation automatique

### ❌ Non importées
- **Requêtes IA** : Historique des recherches (optionnel)
- **Feedbacks** : Commentaires utilisateur (optionnel)
- **Images stockées** : Seules les URLs sont conservées

## 🔧 Format des données v1

Le fichier d'export v1 doit avoir cette structure :

```json
{
  "version": "1.0.0",
  "exportDate": "2024-01-15T10:30:00Z",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "tables": {
    "user_profiles": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "first_name": "Jean",
        "last_name": "Dupont",
        "birth_date": "1990-05-15",
        "favorite1": "Paris",
        "favorite2": "Café",
        "favorite3": "Lecture"
      }
    ],
    "souvenirs": [
      {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "memory_date": "2024-01-10",
        "text_content": "Une belle journée au parc...",
        "photo_url": "https://example.com/photo.jpg",
        "tags": ["nature", "détente"],
        "embedding": [0.1, 0.2, ...], // 1536 valeurs
        "created_at": "2024-01-10T15:30:00Z"
      }
    ]
  }
}
```

## 🐛 Gestion d'erreurs

### Erreurs courantes et solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Fichier JSON invalide" | Format incorrect | Vérifiez que le fichier n'est pas corrompu |
| "Ces données appartiennent à un autre utilisateur" | user_id différent | Utilisez vos propres données d'export |
| "Structure de données invalide" | Format v1 non reconnu | Contactez le support |
| "UUID invalide" | Identifiant malformé | Certains enregistrements seront ignorés |

### Logs d'erreur

- **Erreurs par enregistrement** : Affichées en temps réel
- **Limite d'affichage** : 10 erreurs max (+ compteur)
- **Continuation** : Les erreurs n'arrêtent pas l'import global

## 📈 Performance

- **Fichiers supportés** : Jusqu'à 50MB
- **Souvenirs** : Plusieurs milliers sans problème
- **Temps d'import** : ~1 seconde pour 100 souvenirs
- **Mémoire** : Traitement par batch pour optimiser

## 🔄 Idempotence

- **Double import** : Pas de doublons créés
- **Mise à jour** : Les souvenirs existants sont mis à jour
- **Sécurité** : Même résultat si lancé plusieurs fois

## 🧪 Test de l'import

### Fichier de test minimal

```json
{
  "version": "1.0.0",
  "exportDate": "2024-01-15T10:30:00Z",
  "userId": "VOTRE_USER_ID",
  "tables": {
    "user_profiles": [
      {
        "id": "VOTRE_USER_ID",
        "first_name": "Test",
        "last_name": "User"
      }
    ],
    "souvenirs": [
      {
        "id": "test-memory-001",
        "user_id": "VOTRE_USER_ID",
        "memory_date": "2024-01-01",
        "text_content": "Mon premier souvenir de test",
        "created_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez le format** de votre fichier JSON
2. **Consultez les erreurs** affichées pendant l'import
3. **Testez avec un petit fichier** d'abord
4. **Contactez le support** avec le message d'erreur exact

---

## 🎉 Après l'import

Une fois l'import terminé :
- Vos souvenirs apparaissent dans la timeline
- Votre profil est mis à jour
- Vous pouvez supprimer le fichier JSON
- L'ancienne version peut être désinstallée

**Bienvenue dans memor.ia v2 ! 🌟** 