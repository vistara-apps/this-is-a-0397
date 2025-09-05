import React, { useState } from 'react';
import { Lock, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const LegalCard = ({ variant, title, content, isPremium = false, onPremiumAccess }) => {
  const [copiedPhrase, setCopiedPhrase] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPhrase(id);
      setTimeout(() => setCopiedPhrase(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (variant === 'stateGuide' && content) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
        
        {isPremium && (
          <div className="flex items-center gap-3 mb-4 p-4 bg-accent/10 border border-accent/20 rounded-md">
            <Lock className="w-5 h-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm text-textPrimary">Premium feature</p>
              <p className="text-xs text-textSecondary">Upgrade for unlimited state guides</p>
            </div>
            <button onClick={onPremiumAccess} className="btn-primary text-sm px-4 py-2">
              Upgrade
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Do's Section */}
          <div>
            <button
              onClick={() => toggleSection('dos')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-md font-semibold text-green-400">✅ What You Should Do</h4>
              {expandedSections.dos ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {(expandedSections.dos || !isPremium) && (
              <ul className="mt-3 space-y-2 text-sm text-textSecondary">
                {content.dos?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Don'ts Section */}
          <div>
            <button
              onClick={() => toggleSection('donts')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-md font-semibold text-red-400">❌ What You Should NOT Do</h4>
              {expandedSections.donts ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {(expandedSections.donts || !isPremium) && (
              <ul className="mt-3 space-y-2 text-sm text-textSecondary">
                {content.donts?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Key Rights Section */}
          <div>
            <button
              onClick={() => toggleSection('rights')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="text-md font-semibold text-accent">🛡️ Your Key Rights</h4>
              {expandedSections.rights ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {(expandedSections.rights || !isPremium) && (
              <ul className="mt-3 space-y-2 text-sm text-textSecondary">
                {content.rights?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'script' && content) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">{content.scenario}</h3>
          {isPremium && <Lock className="w-5 h-5 text-accent" />}
        </div>

        {isPremium ? (
          <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-md">
            <Lock className="w-5 h-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm text-textPrimary">Premium script</p>
              <p className="text-xs text-textSecondary">Upgrade for all phrase scripts</p>
            </div>
            <button onClick={onPremiumAccess} className="btn-primary text-sm px-4 py-2">
              Upgrade
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {content.phrases?.map((phrase, index) => (
              <div key={index} className="bg-bg rounded-md p-4 border border-surface">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-textPrimary mb-1">
                      {phrase.context}
                    </p>
                    <p className="text-textSecondary">{phrase.text}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(phrase.text, `${content.scenario}-${index}`)}
                    className="text-textSecondary hover:text-accent transition-colors p-2"
                  >
                    {copiedPhrase === `${content.scenario}-${index}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default LegalCard;