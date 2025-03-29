
import { Rank } from './types';
import { getAdminRanks } from './database';
import { ranks as initialRanks } from './constants';

// Export types
export * from './types';

// Export constants
export * from './constants';

// Export database functions
export * from './database';

// Export utility functions
export * from './utils';

// Export pricing functions
export * from './pricing';

// Initialize ranks with data from database without duplicating
// This approach avoids having duplicate ranks by ensuring we only load once
let ranksInitialized = false;
let initPromise: Promise<Rank[]> | null = null;

export const initializeRanks = async (): Promise<Rank[]> => {
  // Return existing promise if already initializing to prevent multiple parallel requests
  if (initPromise) {
    return initPromise;
  }
  
  // Use cached data if available
  if (ranksInitialized) {
    return initialRanks;
  }
  
  // Create a new promise for initialization
  initPromise = new Promise(async (resolve) => {
    try {
      const loadedRanks = await getAdminRanks();
      // Clear the array and repopulate
      initialRanks.splice(0, initialRanks.length, ...loadedRanks);
      ranksInitialized = true;
      console.log('Ranks initialized successfully:', initialRanks.length);
      resolve(initialRanks);
    } catch (error) {
      console.error('Failed to initialize ranks:', error);
      resolve(initialRanks); // Return initial ranks even on error
    } finally {
      initPromise = null;
    }
  });
  
  return initPromise;
};

// Initial loading - don't autoload on import, let components request data when needed
// This prevents unnecessary loading when the module is imported but not used
