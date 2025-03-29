
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

export const initializeRanks = async (): Promise<Rank[]> => {
  if (!ranksInitialized) {
    try {
      const loadedRanks = await getAdminRanks();
      // Clear the array and repopulate
      initialRanks.splice(0, initialRanks.length, ...loadedRanks);
      ranksInitialized = true;
      console.log('Ranks initialized successfully:', initialRanks.length);
    } catch (error) {
      console.error('Failed to initialize ranks:', error);
    }
  }
  return initialRanks;
};

// Initial loading
initializeRanks();
