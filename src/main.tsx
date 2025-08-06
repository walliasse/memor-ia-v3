import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 main.tsx - Début de l\'initialisation');

try {
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
}
