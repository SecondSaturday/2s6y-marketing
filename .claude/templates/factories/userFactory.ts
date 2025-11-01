/**
 * User Factory - Generate test user data
 *
 * Provides realistic default user data that can be overridden for specific tests.
 */

export interface UserFactoryOptions {
  _id?: string;
  clerkId?: string;
  email?: string;
  name?: string;
  profileImage?: string;
  joinedAt?: number;
}

/**
 * Creates a test user with realistic defaults
 *
 * @param overrides - Optional fields to override defaults
 * @returns User object matching Convex schema
 *
 * @example
 * // Default user
 * const user = createUser();
 *
 * // Custom email
 * const customUser = createUser({ email: "test@example.com" });
 *
 * // Multiple overrides
 * const admin = createUser({
 *   name: "Admin User",
 *   email: "admin@example.com"
 * });
 */
export function createUser(overrides: UserFactoryOptions = {}) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);

  return {
    _id: overrides._id || `user-test-${randomId}`,
    clerkId: overrides.clerkId || `clerk_test_${randomId}`,
    email: overrides.email || `testuser${randomId}@example.com`,
    name: overrides.name || `Test User ${randomId.substring(0, 4)}`,
    profileImage: overrides.profileImage || `https://avatar.vercel.sh/${randomId}.png`,
    joinedAt: overrides.joinedAt || timestamp,
    ...overrides
  };
}

/**
 * Creates multiple test users
 *
 * @param count - Number of users to create
 * @param baseOverrides - Base overrides applied to all users
 * @returns Array of user objects
 *
 * @example
 * // Create 5 test users
 * const users = createUsers(5);
 *
 * // Create 3 users with same domain
 * const orgUsers = createUsers(3, {
 *   email: (i) => `user${i}@company.com`
 * });
 */
export function createUsers(
  count: number,
  baseOverrides: Partial<UserFactoryOptions> = {}
): ReturnType<typeof createUser>[] {
  return Array.from({ length: count }, (_, i) =>
    createUser({
      ...baseOverrides,
      name: baseOverrides.name || `Test User ${i + 1}`
    })
  );
}
