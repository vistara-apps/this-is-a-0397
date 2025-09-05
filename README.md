# RightsGuard

**Know Your Rights, Stay Safe.**

RightsGuard is a comprehensive web application that provides instant access to state-specific legal rights and interaction scripts for individuals interacting with law enforcement. Built with React, Tailwind CSS, and powered by OpenAI and Supabase.

## 🚀 Features

### Core Features
- **State-Specific Legal Guidelines**: Tailored dos, don'ts, and rights for all 50 US states
- **Multi-Language Key Phrase Scripts**: Pre-written phrases in English and Spanish for common interaction scenarios
- **Discreet Interaction Logging**: Quick, silent logging with timestamp and location tracking
- **Shareable Interaction Summaries**: Generate PDF and text summaries for documentation

### Premium Features
- **Unlimited State Access**: Access legal guidelines for all states
- **Advanced Logging History**: Persistent storage of interaction logs
- **PDF Generation**: Professional interaction summary reports
- **Enhanced Scripts**: Extended phrase libraries and scenarios

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Real-time)
- **AI**: OpenAI GPT-3.5 Turbo for content generation
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Deployment**: Docker-ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (for production)
- OpenAI API key (optional, falls back to mock data)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-0397.git
cd this-is-a-0397
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# OpenAI Configuration (Optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1

# Supabase Configuration (Optional)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=RightsGuard
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

### 4. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🗄 Database Setup (Production)

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env`
3. Run the database schema in Supabase SQL editor:

```bash
# Copy the contents of docs/database-schema.sql
# Paste and run in Supabase SQL editor
```

The schema includes:
- User profiles and authentication
- Interaction logs with location data
- State guides caching
- Row Level Security (RLS) policies
- Automatic triggers and functions

## 🔑 API Configuration

### OpenAI Setup (Optional)

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to your `.env` file
3. The app will use AI-generated content when available, otherwise falls back to comprehensive mock data

### Mock Data Mode

The app works fully without external APIs:
- Comprehensive state guides for 10+ states
- Multi-language phrase libraries
- Local storage for interaction logs
- All core functionality available

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── AuthModal.jsx   # User authentication
│   ├── LegalCard.jsx   # Legal content display
│   ├── LogButton.jsx   # Quick logging
│   ├── ShareButton.jsx # Sharing functionality
│   └── ...
├── services/           # Business logic
│   ├── openaiService.js    # AI content generation
│   ├── supabaseService.js  # Database operations
│   ├── locationService.js  # Geolocation handling
│   └── pdfService.js       # PDF generation
├── App.jsx            # Main app component
├── main.jsx          # App entry point
└── index.css         # Global styles

docs/
├── database-schema.sql # Complete database setup
└── api-documentation.md # API reference

public/               # Static assets
```

## 🎨 Design System

RightsGuard uses a carefully crafted design system:

- **Colors**: Dark theme with blue accent (`hsl(220, 100%, 50%)`)
- **Typography**: Clean, readable font hierarchy
- **Layout**: 12-column fluid grid with 24px gutters
- **Components**: Modular, reusable UI components
- **Motion**: Smooth transitions with cubic-bezier easing

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Authentication**: Secure user management via Supabase
- **Data Privacy**: Users can only access their own data
- **Location Privacy**: Optional location tracking with user consent
- **Secure PDF Generation**: Client-side PDF creation

## 📱 User Flows

### 1. Initial Onboarding
- Location permission request
- State selection (auto-detected or manual)
- Language preference (English/Spanish)
- Subscription tier selection

### 2. Using Key Phrase Scripts
- Navigate to Scripts section
- Select interaction scenario
- View context-appropriate phrases
- Copy or share phrases

### 3. Logging an Interaction
- Tap Quick Record button
- Automatic timestamp and location capture
- Add notes post-interaction
- Generate shareable summary

### 4. Sharing Interaction Summary
- Select logged interaction
- Choose sharing format (PDF/Text)
- Share via native sharing or download

## 🚀 Deployment

### Docker Deployment
```bash
# Build the image
docker build -t rightsguard .

# Run the container
docker run -p 3000:80 rightsguard
```

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Business Model

- **Free Tier**: Basic state guide access, limited logging
- **Premium ($3.99/month)**: 
  - Unlimited state guides
  - Advanced interaction logging
  - PDF generation
  - Extended phrase libraries
  - Priority support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Legal Disclaimer

RightsGuard provides general information about legal rights and is not a substitute for professional legal advice. The information provided may not be current or complete. For specific legal situations, consult with a qualified attorney in your jurisdiction.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit via GitHub Discussions
- **Email**: support@rightsguard.app (when available)

## 🗺 Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Voice-activated features
- [ ] Integration with legal aid organizations
- [ ] Multi-language expansion (French, Portuguese)
- [ ] Advanced analytics dashboard
- [ ] Community-contributed content

---

**Built with ❤️ for civil rights and public safety**
