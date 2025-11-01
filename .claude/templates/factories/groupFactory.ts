/**
 * Group Factory - Generate test group data
 *
 * Provides realistic default group data that can be overridden for specific tests.
 */

export interface GroupFactoryOptions {
  _id?: string;
  name?: string;
  description?: string;
  createdAt?: number;
  adminId?: string;
  memberIds?: string[];
  avatar?: string;
  cover?: string;
}

/**
 * Creates a test group with realistic defaults
 *
 * @param overrides - Optional fields to override defaults
 * @returns Group object matching Convex schema
 *
 * @example
 * // Default group
 * const group = createGroup();
 *
 * // Custom name and description
 * const friendsGroup = createGroup({
 *   name: "Best Friends",
 *   description: "Our close friend group"
 * });
 *
 * // Group with specific members
 * const group = createGroup({
 *   adminId: "user-123",
 *   memberIds: ["user-123", "user-456", "user-789"]
 * });
 */
export function createGroup(overrides: GroupFactoryOptions = {}) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const groupNumber = Math.floor(Math.random() * 1000);

  return {
    _id: overrides._id || `group-test-${randomId}`,
    name: overrides.name || `Test Group ${groupNumber}`,
    description: overrides.description || `This is a test group for automated testing. Created at ${new Date(timestamp).toISOString()}`,
    createdAt: overrides.createdAt || timestamp,
    adminId: overrides.adminId || `user-admin-${randomId}`,
    memberIds: overrides.memberIds || [`user-admin-${randomId}`],
    avatar: overrides.avatar || `https://avatar.vercel.sh/group-${randomId}.png`,
    cover: overrides.cover || `https://picsum.photos/seed/${randomId}/1200/400`,
    ...overrides
  };
}

/**
 * Creates a group with multiple members
 *
 * @param memberCount - Number of members (including admin)
 * @param overrides - Optional fields to override defaults
 * @returns Group object with member array
 *
 * @example
 * // Create group with 5 members
 * const group = createGroupWithMembers(5);
 *
 * // Create group with custom name and members
 * const group = createGroupWithMembers(10, {
 *   name: "Large Test Group"
 * });
 */
export function createGroupWithMembers(
  memberCount: number,
  overrides: Partial<GroupFactoryOptions> = {}
): ReturnType<typeof createGroup> {
  const adminId = overrides.adminId || `user-admin-${Math.random().toString(36).substring(7)}`;
  const memberIds = [
    adminId,
    ...Array.from({ length: memberCount - 1 }, (_, i) =>
      `user-member-${i + 1}-${Math.random().toString(36).substring(7)}`
    )
  ];

  return createGroup({
    ...overrides,
    adminId,
    memberIds
  });
}
