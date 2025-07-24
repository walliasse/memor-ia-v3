// import-users.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// ⚠️ Renseigne ici l'URL et la clé service_role de ton projet Supabase v2
const SUPABASE_URL = 'https://caxndzgrszlxzyxqyjyz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNheG5kemdyc3pseHp5eHF5anl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIxMTE2NSwiZXhwIjoyMDY4Nzg3MTY1fQ.m_7MTdQNW1xU61iI75bbzhw2a_OpH8b0qElsIB-GUOs';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Charge le fichier d'utilisateurs exporté (format JSON array)
const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

async function migrateUsers() {
  for (const user of users) {
    try {
      // Création de l'utilisateur
      const { data, error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        email_confirm: true,
        user_metadata: user.raw_user_meta_data || {},
        created_at: user.created_at
      });

      if (error) {
        console.error(`❌ Erreur pour ${user.email}:`, error.message);
      } else {
        console.log(`✅ Utilisateur importé: ${user.email}`);
      }
    } catch (err) {
      console.error(`❌ Exception pour ${user.email}:`, err.message);
    }
  }
  console.log('🎉 Import terminé !');
}

migrateUsers();