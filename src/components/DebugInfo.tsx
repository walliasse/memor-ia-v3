import { useEffect, useState } from 'react';

export default function DebugInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Collecter les informations de debug
    const info = {
      userAgent: navigator.userAgent,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      environment: {
        NODE_ENV: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
        BASE_URL: import.meta.env.BASE_URL,
      },
      variables: {
        VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        VITE_OPENAI_API_KEY: !!import.meta.env.VITE_OPENAI_API_KEY,
      },
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    console.log('🔍 Debug Info:', info);
  }, []);

  // Afficher seulement en développement ou si on appuie sur Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible && import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Info</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/70 hover:text-white"
        >
          ×
        </button>
      </div>
      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <p className="text-white/70 text-xs mt-2">
        Appuyez sur Ctrl+Shift+D pour afficher/masquer
      </p>
    </div>
  );
} 