import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Initialize client only if environment variables are available
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Mock data for development when Supabase is not configured
const mockUsers = new Map();
const mockLogs = new Map();
let mockUserId = 'mock-user-1';

// User Management
export const signUp = async (email, password) => {
  if (!supabase) {
    // Mock implementation
    const user = {
      id: `mock-user-${Date.now()}`,
      email,
      subscriptionStatus: 'free',
      preferredLanguage: 'en',
      created_at: new Date().toISOString()
    };
    mockUsers.set(user.id, user);
    mockUserId = user.id;
    return { user, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      // Create user profile
      await createUserProfile(data.user.id, {
        email,
        subscriptionStatus: 'free',
        preferredLanguage: 'en'
      });
    }

    return { user: data.user, error };
  } catch (error) {
    return { user: null, error };
  }
};

export const signIn = async (email, password) => {
  if (!supabase) {
    // Mock implementation
    const user = Array.from(mockUsers.values()).find(u => u.email === email);
    if (user) {
      mockUserId = user.id;
      return { user, error: null };
    }
    return { user: null, error: { message: 'User not found' } };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  } catch (error) {
    return { user: null, error };
  }
};

export const signOut = async () => {
  if (!supabase) {
    mockUserId = null;
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  if (!supabase) {
    return mockUsers.get(mockUserId) || null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const profile = await getUserProfile(user.id);
      return { ...user, ...profile };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// User Profile Management
export const createUserProfile = async (userId, profileData) => {
  if (!supabase) {
    mockUsers.set(userId, { id: userId, ...profileData });
    return { data: profileData, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ user_id: userId, ...profileData }])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserProfile = async (userId) => {
  if (!supabase) {
    return mockUsers.get(userId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId, updates) => {
  if (!supabase) {
    const user = mockUsers.get(userId);
    if (user) {
      const updated = { ...user, ...updates };
      mockUsers.set(userId, updated);
      return { data: updated, error: null };
    }
    return { data: null, error: { message: 'User not found' } };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Interaction Logs Management
export const createInteractionLog = async (userId, logData) => {
  if (!supabase) {
    const log = {
      id: `log-${Date.now()}`,
      user_id: userId,
      ...logData,
      created_at: new Date().toISOString()
    };
    
    if (!mockLogs.has(userId)) {
      mockLogs.set(userId, []);
    }
    mockLogs.get(userId).push(log);
    return { data: log, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('interaction_logs')
      .insert([{ user_id: userId, ...logData }])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserInteractionLogs = async (userId) => {
  if (!supabase) {
    return mockLogs.get(userId) || [];
  }

  try {
    const { data, error } = await supabase
      .from('interaction_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching interaction logs:', error);
    return [];
  }
};

export const updateInteractionLog = async (logId, updates) => {
  if (!supabase) {
    // Find and update in mock data
    for (const [userId, logs] of mockLogs.entries()) {
      const logIndex = logs.findIndex(log => log.id === logId);
      if (logIndex !== -1) {
        logs[logIndex] = { ...logs[logIndex], ...updates };
        return { data: logs[logIndex], error: null };
      }
    }
    return { data: null, error: { message: 'Log not found' } };
  }

  try {
    const { data, error } = await supabase
      .from('interaction_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteInteractionLog = async (logId) => {
  if (!supabase) {
    // Find and delete from mock data
    for (const [userId, logs] of mockLogs.entries()) {
      const logIndex = logs.findIndex(log => log.id === logId);
      if (logIndex !== -1) {
        logs.splice(logIndex, 1);
        return { error: null };
      }
    }
    return { error: { message: 'Log not found' } };
  }

  try {
    const { error } = await supabase
      .from('interaction_logs')
      .delete()
      .eq('id', logId);
    
    return { error };
  } catch (error) {
    return { error };
  }
};

// State Guides Cache Management
export const getCachedStateGuide = async (state) => {
  if (!supabase) {
    return null; // Let OpenAI service handle mock data
  }

  try {
    const { data, error } = await supabase
      .from('state_guides')
      .select('*')
      .eq('state_name', state)
      .single();
    
    if (error) return null;
    return data;
  } catch (error) {
    return null;
  }
};

export const cacheStateGuide = async (state, guideData) => {
  if (!supabase) {
    return { data: null, error: null }; // Skip caching in mock mode
  }

  try {
    const { data, error } = await supabase
      .from('state_guides')
      .upsert([{
        state_name: state,
        dos_and_donts: guideData.dos,
        donts: guideData.donts,
        legal_info: guideData.rights,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Subscription Management
export const updateSubscriptionStatus = async (userId, status) => {
  return updateUserProfile(userId, { subscriptionStatus: status });
};

export const getSubscriptionStatus = async (userId) => {
  const profile = await getUserProfile(userId);
  return profile?.subscriptionStatus || 'free';
};

// Database Schema Creation (for reference)
export const createTables = async () => {
  if (!supabase) {
    console.log('Supabase not configured - using mock data');
    return;
  }

  // This would typically be done via Supabase dashboard or migrations
  console.log('Database tables should be created via Supabase dashboard');
};

export default supabase;
