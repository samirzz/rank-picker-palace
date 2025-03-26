
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

// Initialize ranks with data from database
getAdminRanks().then(loadedRanks => {
  initialRanks.splice(0, initialRanks.length, ...loadedRanks);
});
