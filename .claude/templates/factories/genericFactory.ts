/**
 * Generic Entity Factory Template
 *
 * INSTRUCTIONS:
 * 1. Copy this file to tests/factories/[entityName]Factory.ts
 * 2. Replace [EntityName] with your entity name (e.g., "User", "Group", "Contribution")
 * 3. Replace [entity] with lowercase entity name (e.g., "user", "group", "contribution")
 * 4. Update fields to match your Convex schema
 * 5. Export from tests/factories/index.ts
 *
 * EXAMPLE:
 * - Copy to: tests/factories/contributionFactory.ts
 * - Replace [EntityName] → Contribution
 * - Replace [entity] → contribution
 * - Add fields: userId, groupId, month, prompt1, etc.
 */

/**
 * Factory Options Interface
 * Define all fields from your Convex schema as optional
 */
export interface [EntityName]FactoryOptions {
  // Primary key
  _id?: string;

  // Required fields (provide defaults in factory)
  [requiredField1]?: string;
  [requiredField2]?: number;

  // Optional fields (can be undefined)
  [optionalField1]?: string;
  [optionalField2]?: number;

  // Timestamps
  createdAt?: number;
  updatedAt?: number;

  // Foreign keys
  [relatedId]?: string; // e.g., userId, groupId

  // Arrays
  [arrayField]?: string[];

  // Nested objects
  [objectField]?: {
    [nestedField]: string;
  };

  // Enums/Literals
  [statusField]?: "active" | "inactive" | "pending";
}

/**
 * Creates a test [entity] with realistic defaults
 *
 * @param overrides - Optional fields to override defaults
 * @returns [EntityName] object matching Convex schema
 *
 * @example
 * // Default [entity]
 * const entity = create[EntityName]();
 *
 * // Custom field
 * const customEntity = create[EntityName]({ [field]: "custom-value" });
 *
 * // Multiple overrides
 * const fullCustom = create[EntityName]({
 *   [requiredField1]: "value1",
 *   [requiredField2]: 123
 * });
 */
export function create[EntityName](
  overrides: [EntityName]FactoryOptions = {}
) {
  // Generate deterministic random values
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const randomNumber = Math.floor(Math.random() * 1000);

  return {
    // Primary key
    _id: overrides._id || `[entity]-test-${randomId}`,

    // Required fields with realistic defaults
    [requiredField1]: overrides.[requiredField1] || `test-[field]-${randomId}`,
    [requiredField2]: overrides.[requiredField2] || randomNumber,

    // Optional fields (undefined by default, can be overridden)
    [optionalField1]: overrides.[optionalField1],
    [optionalField2]: overrides.[optionalField2],

    // Timestamps
    createdAt: overrides.createdAt || timestamp,
    updatedAt: overrides.updatedAt || timestamp,

    // Foreign keys
    [relatedId]: overrides.[relatedId] || `related-test-${randomId}`,

    // Arrays (empty by default or provide sample data)
    [arrayField]: overrides.[arrayField] || [],
    // OR with default items:
    // [arrayField]: overrides.[arrayField] || [`default-item-${randomId}`],

    // Nested objects
    [objectField]: overrides.[objectField] || {
      [nestedField]: `nested-value-${randomId}`,
    },

    // Enums/Literals (provide sensible default)
    [statusField]: overrides.[statusField] || "active",

    // Spread overrides last to allow full customization
    ...overrides,
  };
}

/**
 * Creates multiple test [entities]
 *
 * @param count - Number of entities to create
 * @param baseOverrides - Base overrides applied to all entities
 * @returns Array of [entity] objects
 *
 * @example
 * // Create 5 test [entities]
 * const entities = create[EntityName]s(5);
 *
 * // Create 3 [entities] with shared field
 * const related = create[EntityName]s(3, {
 *   [relatedId]: "shared-id"
 * });
 */
export function create[EntityName]s(
  count: number,
  baseOverrides: Partial<[EntityName]FactoryOptions> = {}
): ReturnType<typeof create[EntityName]>[] {
  return Array.from({ length: count }, (_, i) =>
    create[EntityName]({
      ...baseOverrides,
      // Ensure unique identifiers (override if provided)
      [uniqueField]:
        baseOverrides.[uniqueField] || `[entity]-${i + 1}-${Math.random().toString(36).substring(7)}`,
    })
  );
}

/**
 * Helper: Generate random ID
 * (Use this for generating related entity IDs)
 */
function generateId(): string {
  return Math.random().toString(36).substring(7);
}

/**
 * ADDITIONAL HELPERS (Optional)
 *
 * Add domain-specific factory methods here.
 * Examples:
 * - createActive[EntityName]() - Always creates active entity
 * - create[EntityName]WithRelated() - Creates entity with related data
 * - create[EntityName]ForGroup() - Creates entity for specific group
 */

/**
 * Example: Creates an active [entity]
 */
export function createActive[EntityName](
  overrides: [EntityName]FactoryOptions = {}
) {
  return create[EntityName]({
    ...overrides,
    [statusField]: "active",
  });
}

/**
 * Example: Creates [entity] with related data
 */
export function create[EntityName]WithRelated(
  relatedEntityId: string,
  overrides: [EntityName]FactoryOptions = {}
) {
  return create[EntityName]({
    ...overrides,
    [relatedId]: relatedEntityId,
  });
}

/**
 * EXAMPLE USAGE IN TESTS:
 *
 * import { create[EntityName], create[EntityName]s } from './factories/[entity]Factory';
 *
 * it("tests [entity] creation", async () => {
 *   // Default factory
 *   const entity = create[EntityName]();
 *   expect(entity._id).toBeTruthy();
 *
 *   // Custom values
 *   const custom = create[EntityName]({
 *     [requiredField1]: "custom-value"
 *   });
 *   expect(custom.[requiredField1]).toBe("custom-value");
 *
 *   // Batch creation
 *   const entities = create[EntityName]s(10);
 *   expect(entities).toHaveLength(10);
 * });
 */
