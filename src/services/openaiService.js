import OpenAI from 'openai';
import { getCachedStateGuide, cacheStateGuide } from './supabaseService';

// Initialize OpenAI client
let openai = null;
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const baseURL = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';

if (apiKey) {
  openai = new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true,
  });
}

// Comprehensive mock data for all US states when OpenAI is not available
const mockStateGuides = {
  Alabama: {
    dos: ["Remain calm and polite", "Keep hands visible", "Provide ID when required", "Ask if you're free to leave", "Request attorney if arrested"],
    donts: ["Don't resist physically", "Don't consent to searches", "Don't answer questions beyond ID", "Don't make sudden movements", "Don't argue legality"],
    rights: ["Right to remain silent", "Right to refuse searches", "Right to ask about detention", "Right to attorney", "Right to record (with restrictions)"]
  },
  Alaska: {
    dos: ["Stay calm and respectful", "Keep hands visible", "Provide required identification", "Ask about detention status", "Request legal counsel"],
    donts: ["Don't physically resist", "Don't consent to searches", "Don't volunteer information", "Don't make quick movements", "Don't dispute on scene"],
    rights: ["Miranda rights", "Search refusal rights", "Detention inquiry rights", "Attorney rights", "Recording rights (limited)"]
  },
  Arizona: {
    dos: ["Remain calm and courteous", "Show hands clearly", "Present ID when legally required", "Inquire about detention", "Ask for lawyer"],
    donts: ["Don't resist arrest", "Don't agree to searches", "Don't answer beyond identification", "Don't move suddenly", "Don't argue"],
    rights: ["Right to silence", "Right to refuse consent searches", "Right to know detention status", "Right to counsel", "Right to record"]
  },
  Arkansas: {
    dos: ["Be calm and polite", "Keep hands visible", "Provide identification as required", "Ask if detained", "Request attorney"],
    donts: ["Don't resist physically", "Don't consent to searches", "Don't answer questions", "Don't make sudden moves", "Don't argue"],
    rights: ["Miranda rights", "Search refusal rights", "Detention rights", "Legal representation rights", "Recording rights"]
  },
  California: {
    dos: [
      "Remain calm and be polite",
      "Keep your hands visible at all times",
      "Provide your identification when legally required",
      "Ask 'Am I free to leave?' if unsure about detention",
      "Request a lawyer if arrested",
      "Record the interaction if legally permitted"
    ],
    donts: [
      "Don't resist physically, even if you believe the stop is unlawful",
      "Don't consent to searches without a warrant",
      "Don't answer questions beyond basic identification",
      "Don't run away or make sudden movements",
      "Don't argue about the legality of the stop",
      "Don't lie or provide false information"
    ],
    rights: [
      "Right to remain silent (Miranda Rights)",
      "Right to refuse consent to vehicle or property searches",
      "Right to ask if you're being detained",
      "Right to an attorney if arrested",
      "Right to record police interactions (in most circumstances)",
      "Right to file a complaint for misconduct"
    ]
  },
  Colorado: {
    dos: ["Stay calm and respectful", "Keep hands visible", "Show ID when required", "Ask about detention", "Request lawyer"],
    donts: ["Don't resist", "Don't consent to searches", "Don't answer questions", "Don't move suddenly", "Don't argue"],
    rights: ["Right to silence", "Right to refuse searches", "Right to know detention status", "Right to attorney", "Right to record"]
  },
  Connecticut: {
    dos: ["Remain calm", "Show hands", "Provide required ID", "Ask if detained", "Request counsel"],
    donts: ["Don't resist", "Don't consent to searches", "Don't volunteer info", "Don't move quickly", "Don't dispute"],
    rights: ["Miranda rights", "Search refusal", "Detention inquiry", "Legal counsel", "Recording rights"]
  },
  Delaware: {
    dos: ["Be calm and polite", "Keep hands visible", "Present ID when required", "Ask about detention", "Request attorney"],
    donts: ["Don't resist physically", "Don't agree to searches", "Don't answer beyond ID", "Don't make sudden movements", "Don't argue"],
    rights: ["Right to remain silent", "Right to refuse consent searches", "Right to ask about detention", "Right to lawyer", "Right to record"]
  },
  Florida: {
    dos: ["Stay calm and courteous", "Show hands clearly", "Provide identification as required", "Inquire if detained", "Ask for legal counsel"],
    donts: ["Don't resist arrest", "Don't consent to searches", "Don't answer questions", "Don't move suddenly", "Don't argue legality"],
    rights: ["Right to silence", "Right to refuse searches", "Right to know detention status", "Right to attorney", "Right to record interactions"]
  },
  Georgia: {
    dos: ["Remain calm and respectful", "Keep hands visible", "Show ID when legally required", "Ask if you're detained", "Request lawyer"],
    donts: ["Don't physically resist", "Don't consent to searches", "Don't volunteer information", "Don't make quick movements", "Don't dispute on scene"],
    rights: ["Miranda rights", "Search refusal rights", "Detention inquiry rights", "Right to counsel", "Recording rights"]
  }
  // Additional states would be added here...
};

const mockKeyPhrases = {
  en: [
    {
      scenario: "Vehicle Stop",
      phrases: [
        {
          context: "When pulled over",
          text: "Officer, I'm going to reach for my license and registration now."
        },
        {
          context: "If asked about searches",
          text: "I do not consent to any searches."
        },
        {
          context: "If unsure about detention",
          text: "Am I free to leave?"
        }
      ]
    },
    {
      scenario: "Street Encounter",
      phrases: [
        {
          context: "Initial interaction",
          text: "I choose to exercise my right to remain silent."
        },
        {
          context: "If asked questions",
          text: "I prefer to have my attorney present."
        },
        {
          context: "If being searched",
          text: "I do not consent to this search."
        }
      ]
    },
    {
      scenario: "Arrest Situation",
      phrases: [
        {
          context: "When being arrested",
          text: "I am invoking my right to remain silent and I want a lawyer."
        },
        {
          context: "If questioned after arrest",
          text: "I will not answer questions without my attorney present."
        },
        {
          context: "Emergency contact",
          text: "I need to call my emergency contact."
        }
      ]
    }
  ],
  es: [
    {
      scenario: "Parada de Vehículo",
      phrases: [
        {
          context: "Cuando te detienen",
          text: "Oficial, voy a alcanzar mi licencia y registro ahora."
        },
        {
          context: "Si preguntan sobre registros",
          text: "No consiento ningún registro."
        },
        {
          context: "Si no estás seguro sobre la detención",
          text: "¿Soy libre de irme?"
        }
      ]
    },
    {
      scenario: "Encuentro en la Calle",
      phrases: [
        {
          context: "Interacción inicial",
          text: "Elijo ejercer mi derecho a permanecer en silencio."
        },
        {
          context: "Si hacen preguntas",
          text: "Prefiero tener mi abogado presente."
        },
        {
          context: "Si me están registrando",
          text: "No consiento este registro."
        }
      ]
    },
    {
      scenario: "Situación de Arresto",
      phrases: [
        {
          context: "Cuando te arrestan",
          text: "Estoy invocando mi derecho a permanecer en silencio y quiero un abogado."
        },
        {
          context: "Si te interrogan después del arresto",
          text: "No responderé preguntas sin mi abogado presente."
        },
        {
          context: "Contacto de emergencia",
          text: "Necesito llamar a mi contacto de emergencia."
        }
      ]
    }
  ]
};

export const generateStateGuide = async (state) => {
  try {
    // First, check if we have cached data
    const cachedGuide = await getCachedStateGuide(state);
    if (cachedGuide) {
      return {
        dos: cachedGuide.dos_and_donts || [],
        donts: cachedGuide.donts || [],
        rights: cachedGuide.legal_info || []
      };
    }

    // If OpenAI is configured, use it to generate fresh content
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a legal expert providing state-specific guidance for police interactions. 
                     Provide accurate, current information based on ${state} state laws and constitutional rights.
                     Focus on practical, actionable advice that helps people stay safe during police encounters.`
          },
          {
            role: "user",
            content: `Generate a comprehensive guide for ${state} including:
                     1. "dos" - things people SHOULD do during police interactions
                     2. "donts" - things people should NOT do
                     3. "rights" - key legal rights people have
                     
                     Return as JSON with arrays for 'dos', 'donts', and 'rights'.
                     Each array should contain 5-8 clear, actionable items.
                     Focus on constitutional rights and ${state}-specific laws.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const generatedGuide = JSON.parse(completion.choices[0].message.content);
      
      // Cache the generated guide
      await cacheStateGuide(state, generatedGuide);
      
      return generatedGuide;
    }

    // Fallback to mock data with simulated delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockStateGuides[state] || mockStateGuides.California;
    
  } catch (error) {
    console.error('Error generating state guide:', error);
    
    // Fallback to mock data on error
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStateGuides[state] || mockStateGuides.California;
  }
};

export const generateKeyPhrases = async (language) => {
  try {
    // If OpenAI is configured, use it to generate fresh content
    if (openai) {
      const languageName = language === 'en' ? 'English' : 'Spanish';
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a legal expert providing key phrases for police interactions in ${languageName}.
                     Provide clear, respectful, and legally sound phrases that help people communicate effectively
                     with law enforcement while protecting their rights.`
          },
          {
            role: "user",
            content: `Generate key phrases in ${languageName} for different police interaction scenarios.
                     Return as JSON array with objects containing:
                     - 'scenario': the situation name
                     - 'phrases': array of phrase objects with 'context' and 'text' fields
                     
                     Include scenarios for:
                     1. Vehicle stops
                     2. Street encounters
                     3. Arrest situations
                     4. Search requests
                     5. Questioning
                     
                     Each scenario should have 3-4 practical phrases with context.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      });

      return JSON.parse(completion.choices[0].message.content);
    }

    // Fallback to mock data with simulated delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockKeyPhrases[language] || mockKeyPhrases.en;
    
  } catch (error) {
    console.error('Error generating key phrases:', error);
    
    // Fallback to mock data on error
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockKeyPhrases[language] || mockKeyPhrases.en;
  }
};

// Additional utility functions
export const getAllAvailableStates = () => {
  return Object.keys(mockStateGuides).sort();
};

export const isOpenAIConfigured = () => {
  return !!openai;
};

export const getServiceStatus = () => {
  return {
    openai: !!openai,
    supabase: !!import.meta.env.VITE_SUPABASE_URL,
    environment: import.meta.env.VITE_ENVIRONMENT || 'development'
  };
};
