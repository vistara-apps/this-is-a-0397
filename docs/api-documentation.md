# RightsGuard API Documentation

This document outlines the API structure and service integrations for the RightsGuard application.

## Table of Contents

1. [Service Architecture](#service-architecture)
2. [OpenAI Service](#openai-service)
3. [Supabase Service](#supabase-service)
4. [Location Service](#location-service)
5. [PDF Service](#pdf-service)
6. [Error Handling](#error-handling)
7. [Environment Configuration](#environment-configuration)

## Service Architecture

RightsGuard follows a service-oriented architecture with the following layers:

```
Frontend (React) → Services → External APIs
                 ↓
              Local Storage (Fallback)
```

### Service Dependencies

- **OpenAI Service**: Content generation (optional)
- **Supabase Service**: Authentication and database (optional)
- **Location Service**: Geolocation API (browser native)
- **PDF Service**: Client-side PDF generation

## OpenAI Service

### Overview
Generates state-specific legal content and key phrases using OpenAI's GPT-3.5 Turbo model.

### Configuration
```javascript
// Environment variables
VITE_OPENAI_API_KEY=your_api_key
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
```

### Methods

#### `generateStateGuide(state)`
Generates comprehensive legal guidelines for a specific state.

**Parameters:**
- `state` (string): US state name (e.g., "California")

**Returns:**
```javascript
{
  dos: string[],      // Things to do
  donts: string[],    // Things to avoid
  rights: string[]    // Legal rights
}
```

**Example:**
```javascript
const guide = await generateStateGuide('California');
console.log(guide.dos); // ["Remain calm and be polite", ...]
```

#### `generateKeyPhrases(language)`
Generates interaction phrases for different scenarios.

**Parameters:**
- `language` (string): 'en' for English, 'es' for Spanish

**Returns:**
```javascript
[
  {
    scenario: string,
    phrases: [
      {
        context: string,
        text: string
      }
    ]
  }
]
```

**Example:**
```javascript
const phrases = await generateKeyPhrases('en');
console.log(phrases[0].scenario); // "Vehicle Stop"
```

#### `getAllAvailableStates()`
Returns list of all supported states.

**Returns:**
```javascript
string[] // ["Alabama", "Alaska", "Arizona", ...]
```

#### `isOpenAIConfigured()`
Checks if OpenAI API is properly configured.

**Returns:**
```javascript
boolean
```

#### `getServiceStatus()`
Returns status of all services.

**Returns:**
```javascript
{
  openai: boolean,
  supabase: boolean,
  environment: string
}
```

### Fallback Behavior
When OpenAI is not configured, the service falls back to comprehensive mock data covering 10+ states with full legal information.

## Supabase Service

### Overview
Handles user authentication, data persistence, and caching using Supabase as Backend-as-a-Service.

### Configuration
```javascript
// Environment variables
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Authentication Methods

#### `signUp(email, password)`
Creates a new user account.

**Parameters:**
- `email` (string): User email address
- `password` (string): User password

**Returns:**
```javascript
{
  user: User | null,
  error: Error | null
}
```

#### `signIn(email, password)`
Authenticates existing user.

**Parameters:**
- `email` (string): User email address
- `password` (string): User password

**Returns:**
```javascript
{
  user: User | null,
  error: Error | null
}
```

#### `signOut()`
Signs out current user.

**Returns:**
```javascript
{
  error: Error | null
}
```

#### `getCurrentUser()`
Gets current authenticated user with profile data.

**Returns:**
```javascript
User | null
```

### User Profile Methods

#### `createUserProfile(userId, profileData)`
Creates user profile after signup.

**Parameters:**
- `userId` (string): User ID from auth
- `profileData` (object): Profile information

#### `getUserProfile(userId)`
Retrieves user profile data.

#### `updateUserProfile(userId, updates)`
Updates user profile information.

### Interaction Logs Methods

#### `createInteractionLog(userId, logData)`
Creates new interaction log entry.

**Parameters:**
- `userId` (string): User ID
- `logData` (object): Log information

```javascript
{
  timestamp: Date,
  location: {
    latitude: number,
    longitude: number
  },
  notes: string,
  duration?: string
}
```

#### `getUserInteractionLogs(userId)`
Retrieves all logs for a user.

#### `updateInteractionLog(logId, updates)`
Updates existing log entry.

#### `deleteInteractionLog(logId)`
Deletes a log entry.

### Caching Methods

#### `getCachedStateGuide(state)`
Retrieves cached state guide from database.

#### `cacheStateGuide(state, guideData)`
Stores state guide in cache for faster access.

### Subscription Methods

#### `updateSubscriptionStatus(userId, status)`
Updates user subscription status.

#### `getSubscriptionStatus(userId)`
Gets current subscription status.

### Fallback Behavior
When Supabase is not configured, all methods use in-memory mock data with full functionality for development and testing.

## Location Service

### Overview
Handles geolocation using the browser's native Geolocation API.

### Methods

#### `getCurrentLocation()`
Gets user's current location.

**Returns:**
```javascript
Promise<{
  latitude: number,
  longitude: number,
  timestamp: Date
}>
```

**Example:**
```javascript
try {
  const location = await getCurrentLocation();
  console.log(`Lat: ${location.latitude}, Lng: ${location.longitude}`);
} catch (error) {
  console.log('Location access denied');
}
```

#### `watchLocation(onLocationUpdate, onError)`
Continuously monitors location changes.

**Parameters:**
- `onLocationUpdate` (function): Callback for location updates
- `onError` (function): Callback for errors

**Returns:**
```javascript
number // Watch ID for clearing
```

#### `clearLocationWatch(watchId)`
Stops location monitoring.

**Parameters:**
- `watchId` (number): ID returned from watchLocation

### Configuration Options
```javascript
{
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000
}
```

### Error Handling
The service handles various geolocation errors:
- Permission denied
- Position unavailable
- Timeout
- Unknown errors

## PDF Service

### Overview
Generates PDF documents for interaction summaries using jsPDF.

### Methods

#### `generateInteractionSummaryPDF(log, userInfo)`
Creates a formatted PDF summary.

**Parameters:**
- `log` (object): Interaction log data
- `userInfo` (object): Optional user information

**Returns:**
```javascript
Promise<jsPDF> // PDF document object
```

#### `downloadInteractionSummary(log, filename)`
Generates and downloads PDF summary.

**Parameters:**
- `log` (object): Interaction log data
- `filename` (string): Optional custom filename

#### `shareInteractionSummary(log)`
Generates PDF and shares using Web Share API or download fallback.

**Returns:**
```javascript
Promise<{
  success: boolean,
  method: 'native' | 'download'
}>
```

#### `generateTextSummary(log)`
Creates plain text summary.

**Returns:**
```javascript
string // Formatted text summary
```

#### `copyTextSummary(log)`
Copies text summary to clipboard.

**Returns:**
```javascript
Promise<{
  success: boolean,
  method: 'clipboard' | 'fallback'
}>
```

### PDF Structure
Generated PDFs include:
- Header with RightsGuard branding
- Interaction details (date, time, location)
- User notes
- Legal disclaimer
- Page numbers and footers

## Error Handling

### Service Error Patterns
All services follow consistent error handling:

```javascript
try {
  const result = await serviceMethod();
  return { data: result, error: null };
} catch (error) {
  console.error('Service error:', error);
  return { data: null, error };
}
```

### Common Error Types
- **Network errors**: API unavailable
- **Authentication errors**: Invalid credentials
- **Permission errors**: Location access denied
- **Validation errors**: Invalid input data
- **Rate limiting**: API quota exceeded

### Fallback Strategies
1. **Mock data**: When external APIs fail
2. **Local storage**: When database is unavailable
3. **Graceful degradation**: Core features remain functional
4. **User feedback**: Clear error messages

## Environment Configuration

### Development
```env
VITE_ENVIRONMENT=development
VITE_OPENAI_API_KEY=optional
VITE_SUPABASE_URL=optional
VITE_SUPABASE_ANON_KEY=optional
```

### Production
```env
VITE_ENVIRONMENT=production
VITE_OPENAI_API_KEY=required_for_ai_features
VITE_SUPABASE_URL=required_for_persistence
VITE_SUPABASE_ANON_KEY=required_for_persistence
```

### Configuration Validation
Services automatically detect configuration and adapt:

```javascript
const status = getServiceStatus();
if (!status.openai) {
  console.log('Using mock data for content generation');
}
if (!status.supabase) {
  console.log('Using local storage for data persistence');
}
```

## Rate Limiting and Quotas

### OpenAI API
- **Rate limit**: 3 requests per minute (free tier)
- **Token limit**: 4,000 tokens per request
- **Monthly quota**: Varies by plan

### Supabase
- **Database**: 500MB (free tier)
- **Auth users**: 50,000 (free tier)
- **API requests**: 2 million per month

### Mitigation Strategies
- **Caching**: Store generated content
- **Debouncing**: Limit API calls
- **Fallback data**: Comprehensive mock content
- **User feedback**: Clear quota messages

## Security Considerations

### API Keys
- Never expose API keys in client code
- Use environment variables
- Implement server-side proxy for production

### Data Privacy
- Row Level Security (RLS) in Supabase
- User data isolation
- Optional location tracking
- Local PDF generation

### Authentication
- Secure password requirements
- Email verification
- Session management
- Automatic logout

## Testing

### Service Testing
```javascript
// Mock service responses
jest.mock('../services/openaiService', () => ({
  generateStateGuide: jest.fn().mockResolvedValue(mockGuide),
  generateKeyPhrases: jest.fn().mockResolvedValue(mockPhrases)
}));
```

### Integration Testing
- Test API connectivity
- Validate fallback behavior
- Check error handling
- Verify data persistence

### End-to-End Testing
- User authentication flow
- Content generation
- PDF creation
- Sharing functionality

---

This documentation covers the complete API structure for RightsGuard. For implementation details, refer to the source code in the `/src/services/` directory.
