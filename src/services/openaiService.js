// Mock OpenAI service for demo purposes
// In a real app, you would use the OpenAI API with proper API keys

const mockStateGuides = {
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
  }
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data for demo
  return mockStateGuides[state] || mockStateGuides.California;
};

export const generateKeyPhrases = async (language) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data for demo
  return mockKeyPhrases[language] || mockKeyPhrases.en;
};

// Real OpenAI implementation would look like this:
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generateStateGuide = async (state) => {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: "You are a legal expert providing state-specific guidance for police interactions."
      },
      {
        role: "user",
        content: `Generate a comprehensive guide for ${state} including dos, don'ts, and key rights during police interactions. Return as JSON with arrays for 'dos', 'donts', and 'rights'.`
      }
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};

export const generateKeyPhrases = async (language) => {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: "You are a legal expert providing key phrases for police interactions."
      },
      {
        role: "user",
        content: `Generate key phrases in ${language === 'en' ? 'English' : 'Spanish'} for different police interaction scenarios. Return as JSON array with objects containing 'scenario' and 'phrases' array.`
      }
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};
*/