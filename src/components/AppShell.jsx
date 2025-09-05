import React, { useState } from 'react';
import { Shield, Book, MessageSquare, Clock, Menu, X, Plus } from 'lucide-react';

const AppShell = ({ children, currentView, onViewChange, onQuickLog }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'guides', label: 'Rights Guide', icon: Book },
    { id: 'scripts', label: 'Key Phrases', icon: MessageSquare },
    { id: 'logs', label: 'Logs', icon: Clock },
  ];

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile Header */}
      <div className="lg:hidden bg-surface border-b border-bg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            <span className="font-bold text-textPrimary">RightsGuard</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onQuickLog}
              className="bg-accent text-white p-2 rounded-md"
              aria-label="Quick Record"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-textPrimary p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-bg">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-accent text-white'
                      : 'text-textPrimary hover:bg-bg'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-surface min-h-screen border-r border-bg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-accent" />
              <div>
                <h1 className="font-bold text-textPrimary">RightsGuard</h1>
                <p className="text-xs text-textSecondary">Know Your Rights</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                      currentView === item.id
                        ? 'bg-accent text-white'
                        : 'text-textPrimary hover:bg-bg'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-bg">
              <button
                onClick={onQuickLog}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Quick Record
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:overflow-hidden">
          <div className="lg:h-screen lg:overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Quick Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <button
          onClick={onQuickLog}
          className="bg-accent text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
          aria-label="Quick Record"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default AppShell;