import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const StateSelector = ({ selectedState, onStateChange, variant = 'dropdown' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStateSelect = (state) => {
    onStateChange(state);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-surface hover:bg-opacity-80 px-4 py-2 rounded-md text-textPrimary transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">{selectedState}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 w-64 bg-surface rounded-lg shadow-card border border-bg z-20 max-h-64 overflow-y-auto">
            <div className="p-2">
              {states.map(state => (
                <button
                  key={state}
                  onClick={() => handleStateSelect(state)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    state === selectedState
                      ? 'bg-accent text-white'
                      : 'text-textPrimary hover:bg-bg'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StateSelector;