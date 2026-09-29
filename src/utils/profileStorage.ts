import { CURRENT_USER, UserProfile } from '@/data';

const PROFILE_STORAGE_KEY = 'bitbit_local_profile';

export type ProfileUpdates = Partial<Pick<UserProfile, 'displayName' | 'email' | 'location'>>;

/**
 * Get local profile overrides from localStorage, merging with CURRENT_USER
 */
export const getLocalProfile = (): UserProfile => {
    try {
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) {
            const overrides: ProfileUpdates = JSON.parse(stored);
            return {
                ...CURRENT_USER,
                ...overrides,
            };
        }
    } catch (error) {
        console.error('Error reading local profile:', error);
    }
    return CURRENT_USER;
};

/**
 * Save profile overrides to localStorage
 */
export const saveLocalProfile = (updates: ProfileUpdates): UserProfile => {
    try {
        const current = getLocalProfile();
        const updated: UserProfile = {
            ...current,
            ...updates,
        };
        // Only store the overrides, not the full CURRENT_USER data
        const overrides: ProfileUpdates = {
            displayName: updated.displayName,
            email: updated.email,
            location: updated.location,
        };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(overrides));
        return updated;
    } catch (error) {
        console.error('Error saving local profile:', error);
        throw error;
    }
};

/**
 * Clear local profile overrides (reset to CURRENT_USER)
 */
export const clearLocalProfile = (): void => {
    try {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing local profile:', error);
    }
};
