import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, MapPin, Globe, Clock, Share2, AlertTriangle } from 'lucide-react';
import AppShell from './components/AppShell';
import StateSelector from './components/StateSelector';
import LanguageSelector from './components/LanguageSelector';
import LegalCard from './components/LegalCard';
import LogButton from './components/LogButton';
import ShareButton from './components/ShareButton';
import SubscriptionModal from './components/SubscriptionModal';
import { generateStateGuide, generateKeyPhrases } from './services/openaiService';
import { getCurrentLocation } from './services/locationService';

function App() {
  const [currentView, setCurrentView] = useState('guides');
  const [selectedState, setSelectedState] = useState('California');
  const [language, setLanguage] = useState('en');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [interactionLogs, setInteractionLogs] = useState([]);
  const [stateGuides, setStateGuides] = useState({});
  const [keyPhrases, setKeyPhrases] = useState({});
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Initialize with user's location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        // You would typically use a geocoding service to determine state from coordinates
        // For demo purposes, we'll keep California as default
      } catch (error) {
        console.log('Location access denied or unavailable');
      }
    };
    
    initializeLocation();
  }, []);

  // Load state guide when state changes
  useEffect(() => {
    const loadStateGuide = async () => {
      if (!stateGuides[selectedState]) {
        setLoading(true);
        try {
          const guide = await generateStateGuide(selectedState);
          setStateGuides(prev => ({ ...prev, [selectedState]: guide }));
        } catch (error) {
          console.error('Failed to load state guide:', error);
        }
        setLoading(false);
      }
    };

    loadStateGuide();
  }, [selectedState, stateGuides]);

  // Load key phrases when needed
  useEffect(() => {
    const loadKeyPhrases = async () => {
      if (currentView === 'scripts' && !keyPhrases[language]) {
        setLoading(true);
        try {
          const phrases = await generateKeyPhrases(language);
          setKeyPhrases(prev => ({ ...prev, [language]: phrases }));
        } catch (error) {
          console.error('Failed to load key phrases:', error);
        }
        setLoading(false);
      }
    };

    loadKeyPhrases();
  }, [currentView, language, keyPhrases]);

  const handleQuickLog = () => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date(),
      location: userLocation,
      notes: '',
      isShared: false
    };
    setInteractionLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateLog = (logId, updates) => {
    setInteractionLogs(prev => 
      prev.map(log => log.id === logId ? { ...log, ...updates } : log)
    );
  };

  const handleFeatureAccess = (feature) => {
    if (!isSubscribed && feature === 'premium') {
      setShowSubscriptionModal(true);
      return false;
    }
    return true;
  };

  return (
    <AppShell
      currentView={currentView}
      onViewChange={setCurrentView}
      onQuickLog={handleQuickLog}
    >
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-2xl font-bold text-primary">RightsGuard</h1>
              <p className="text-sm text-textSecondary">Know Your Rights, Stay Safe</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
            <StateSelector
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
          </div>
        </div>

        {/* Subscription Status */}
        {!isSubscribed && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-accent" />
                <span className="text-sm text-textPrimary">
                  Free tier - Limited access to basic features
                </span>
              </div>
              <button 
                onClick={() => setShowSubscriptionModal(true)}
                className="btn-primary text-sm px-4 py-2"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* Content based on current view */}
        {currentView === 'guides' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">
              {selectedState} Legal Guidelines
            </h2>
            
            {loading ? (
              <div className="card animate-pulse">
                <div className="h-4 bg-surface rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-surface rounded w-5/6"></div>
              </div>
            ) : (
              <LegalCard
                variant="stateGuide"
                title="Your Rights During Police Interactions"
                content={stateGuides[selectedState]}
                isPremium={!isSubscribed}
                onPremiumAccess={() => handleFeatureAccess('premium')}
              />
            )}
          </div>
        )}

        {currentView === 'scripts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">
              Key Phrase Scripts ({language === 'en' ? 'English' : 'Spanish'})
            </h2>
            
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-surface rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-surface rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {keyPhrases[language]?.map((script, index) => (
                  <LegalCard
                    key={index}
                    variant="script"
                    title={script.scenario}
                    content={script}
                    isPremium={!isSubscribed && index > 1}
                    onPremiumAccess={() => handleFeatureAccess('premium')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Interaction Logs</h2>
              <LogButton
                variant="quickRecord"
                onLog={handleQuickLog}
              />
            </div>
            
            {interactionLogs.length === 0 ? (
              <div className="card text-center py-12">
                <Clock className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                <p className="text-textSecondary">No interactions logged yet</p>
                <p className="text-sm text-textSecondary mt-2">
                  Use the Quick Record button to log an interaction
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {interactionLogs.map(log => (
                  <div key={log.id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-medium text-textPrimary">
                          {log.timestamp.toLocaleString()}
                        </p>
                        {log.location && (
                          <p className="text-sm text-textSecondary flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {log.location.latitude.toFixed(4)}, {log.location.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                      <ShareButton
                        variant="interactionSummary"
                        log={log}
                        isPremium={!isSubscribed}
                        onPremiumAccess={() => handleFeatureAccess('premium')}
                      />
                    </div>
                    
                    <textarea
                      value={log.notes}
                      onChange={(e) => handleUpdateLog(log.id, { notes: e.target.value })}
                      placeholder="Add notes about this interaction..."
                      className="input w-full min-h-[100px] resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            setIsSubscribed(true);
            setShowSubscriptionModal(false);
          }}
        />
      )}
    </AppShell>
  );
}

export default App;