// Vérification des variables d'environnement critiques
export function checkEnvironmentVariables() {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const optionalVars = {
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  };

  const missingRequired = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingRequired.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missingRequired);
    throw new Error(`Variables d'environnement manquantes: ${missingRequired.join(', ')}`);
  }

  const missingOptional = Object.entries(optionalVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingOptional.length > 0) {
    console.warn('⚠️ Variables d\'environnement optionnelles manquantes:', missingOptional);
  }

  console.log('✅ Vérification des variables d\'environnement terminée');
  return {
    required: requiredVars,
    optional: optionalVars,
    missingRequired,
    missingOptional
  };
}

// Vérification de la configuration Supabase
export function checkSupabaseConfig() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configuration Supabase manquante');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Configuration Supabase valide');
    return true;
  } catch (error) {
    console.error('❌ Erreur de configuration Supabase:', error);
    return false;
  }
} 