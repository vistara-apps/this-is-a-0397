import React from 'react';
import { X, Check, Shield, Unlock, History, FileText } from 'lucide-react';

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const features = [
    {
      icon: Shield,
      title: 'Unlimited State Guides',
      description: 'Access detailed legal guidelines for all 50 states',
    },
    {
      icon: Unlock,
      title: 'Advanced Script Library',
      description: 'Complete collection of key phrases in English and Spanish',
    },
    {
      icon: History,
      title: 'Unlimited Interaction Logs',
      description: 'Store and manage all your interaction records',
    },
    {
      icon: FileText,
      title: 'Professional Summaries',
      description: 'Generate and share detailed interaction reports',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-bg p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">Upgrade to Premium</h2>
              <p className="text-sm text-textSecondary">Unlock all RightsGuard features</p>
            </div>
            <button
              onClick={onClose}
              className="text-textSecondary hover:text-textPrimary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-4">
              <div className="text-3xl font-bold text-accent">$3.99</div>
              <div className="text-sm text-textSecondary">per month</div>
            </div>
            
            <div className="text-xs text-textSecondary">
              Cancel anytime • 7-day free trial
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-accent/20 p-2 rounded-md flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-textPrimary">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-textSecondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onSubscribe}
              className="w-full btn-primary"
            >
              Start Free Trial
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Continue with Free Version
            </button>
          </div>

          {/* Legal */}
          <div className="text-xs text-textSecondary text-center mt-4 space-y-1">
            <p>By subscribing, you agree to our Terms of Service.</p>
            <p>Subscription automatically renews unless cancelled.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;