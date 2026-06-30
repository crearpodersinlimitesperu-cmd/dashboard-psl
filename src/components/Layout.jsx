import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base text-textMain">
      <header className="bg-panel border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple text-transparent bg-clip-text">
                CREAR PODER SIN LÍMITES
              </div>
              <span className="text-sm text-gray-400 border-l border-gray-700 pl-3">
                Dashboard de Fer
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">Fer Aragón</div>
                <div className="text-xs text-gray-400">CEO</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-accent-blue/20">
                FA
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {children}
      </main>
    </div>
  );
}
