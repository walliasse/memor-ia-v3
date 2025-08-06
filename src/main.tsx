import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkEnvironmentVariables } from './lib/envCheck'

console.log('🚀 main.tsx - Début de l\'initialisation');
console.log('🔧 Environment check:', {
  NODE_ENV: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  BASE_URL: import.meta.env.BASE_URL,
});

try {
  // Vérifier les variables d'environnement
  console.log('🔍 Vérification des variables d\'environnement...');
  const envCheck = checkEnvironmentVariables();
  console.log('✅ Variables d\'environnement:', envCheck);
  
  const rootElement = document.getElementById("root");
  console.log('📦 Root element trouvé:', !!rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('🌱 React root créé');
  
  root.render(<App />);
  console.log('✅ App rendu avec succès');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #dc3545; margin-bottom: 20px;">🚨 Erreur d'initialisation</h1>
        <p style="color: #6c757d; margin-bottom: 20px;">
          L'application n'a pas pu démarrer correctement. Cela peut être dû à :
        </p>
        <ul style="color: #6c757d; margin-bottom: 20px; padding-left: 20px;">
          <li>Variables d'environnement manquantes dans Vercel</li>
          <li>Problème de configuration Supabase</li>
          <li>Erreur dans le code JavaScript</li>
        </ul>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #dc3545;">
          <h3 style="margin: 0 0 10px 0; color: #495057;">Détails de l'erreur :</h3>
          <pre style="margin: 0; color: #6c757d; font-size: 12px; overflow-x: auto;">${error}</pre>
        </div>
        <button 
          onclick="window.location.reload()" 
          style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px;"
        >
          Recharger la page
        </button>
      </div>
    </div>
  `;
}
