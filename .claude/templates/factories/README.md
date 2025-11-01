# Test Data Factories - Templates

These are **reference templates**. Actual factories live in project root `tests/factories/`.

## Purpose

Factories provide **deterministic, reusable test data** that can be customized for specific test scenarios. They eliminate hardcoded test data and make tests more readable and maintainable.

---

## How to Use

### 1. Copy Template to Project

```bash
# Copy template to your project
cp .claude/templates/factories/genericFactory.ts tests/factories/[entityName]Factory.ts
```

### 2. Customize for Your Data Model

```typescript
// Edit tests/factories/[entityName]Factory.ts
export interface [EntityName]FactoryOptions {
  _id?: string;
  [field1]?: type;
  [field2]?: type;
  // ... your fields
}

export function create[EntityName](overrides = {}) {
  return {
    _id: overrides._id || generateId(),
    [field1]: overrides.[field1] || "default value",
    [field2]: overrides.[field2] || Date.now(),
    ...overrides
  };
}
```

### 3. Export from Index

```typescript
// tests/factories/index.ts
export * from './[entityName]Factory';
```

### 4. Use in Tests

```typescript
import { create[EntityName] } from './factories/[entityName]Factory';

it("tests something", async () => {
  // Default factory data
  const entity = create[EntityName]();

  // Customized factory data
  const customEntity = create[EntityName]({
    [field1]: "custom value",
    [field2]: 12345
  });
});
```

---

## Available Templates

### 1. Generic Entity Factory
**File**: `genericFactory.ts`
**Use for**: Any database entity/table

### 2. User Factory (Reference)
**File**: `userFactory.ts` (copied from project)
**Use for**: User-related test data

### 3. Group Factory (Reference)
**File**: `groupFactory.ts` (copied from project)
**Use for**: Group-related test data

---

## Factory Pattern

### Basic Structure

```typescript
/**
 * [EntityName] Factory - Generate test [entity] data
 *
 * Provides realistic default data that can be overridden for specific tests.
 */

export interface [EntityName]FactoryOptions {
  // All fields optional (can override any field)
  _id?: string;
  [field1]?: type;
  [field2]?: type;
  [optionalField]?: type;
}

/**
 * Creates a test [entity] with realistic defaults
 *
 * @param overrides - Optional fields to override defaults
 * @returns [EntityName] object matching Convex schema
 *
 * @example
 * // Default entity
 * const entity = create[EntityName]();
 *
 * // Custom field
 * const customEntity = create[EntityName]({ [field1]: "custom" });
 *
 * // Multiple overrides
 * const fullCustom = create[EntityName]({
 *   [field1]: "value1",
 *   [field2]: "value2"
 * });
 */
export function create[EntityName](
  overrides: [EntityName]FactoryOptions = {}
) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);

  return {
    // Generate deterministic defaults
    _id: overrides._id || `[entity]-test-${randomId}`,
    [field1]: overrides.[field1] || `default-${randomId}`,
    [field2]: overrides.[field2] || timestamp,

    // Optional fields
    [optionalField]: overrides.[optionalField],

    // Spread overrides last (allows full customization)
    ...overrides
  };
}
```

### Batch Creation Helper

```typescript
/**
 * Creates multiple test [entities]
 *
 * @param count - Number of entities to create
 * @param baseOverrides - Base overrides applied to all entities
 * @returns Array of [entity] objects
 *
 * @example
 * // Create 5 test entities
 * const entities = create[EntityName]s(5);
 *
 * // Create 3 entities with same field
 * const related = create[EntityName]s(3, {
 *   [commonField]: "shared-value"
 * });
 */
export function create[EntityName]s(
  count: number,
  baseOverrides: Partial<[EntityName]FactoryOptions> = {}
): ReturnType<typeof create[EntityName]>[] {
  return Array.from({ length: count }, (_, i) =>
    create[EntityName]({
      ...baseOverrides,
      // Ensure unique identifiers
      [uniqueField]: baseOverrides.[uniqueField] || `${baseOverrides.[uniqueField] || 'entity'}-${i + 1}`
    })
  );
}
```

---

## Best Practices

### 1. Deterministic Defaults
Use **predictable values** for easy debugging:
```typescript
// ✅ GOOD - Predictable
const user = createUser(); // Always generates valid email, name, etc.

// ❌ BAD - Random
const user = { email: Math.random() + "@example.com" }; // Unpredictable
```

### 2. Override Flexibility
Allow **any field to be overridden**:
```typescript
// ✅ GOOD - Flexible
const admin = createUser({ role: "admin" });
const customEmail = createUser({ email: "test@example.com" });

// ❌ BAD - Rigid
const user = createUser(); // Can't customize
```

### 3. Type Safety
Use **TypeScript interfaces** for autocomplete:
```typescript
// ✅ GOOD - Typed
export interface UserFactoryOptions {
  email?: string;
  name?: string;
}
export function createUser(overrides: UserFactoryOptions = {}) { ... }

// ❌ BAD - No types
export function createUser(overrides: any = {}) { ... }
```

### 4. Realistic Data
Generate **realistic test data**:
```typescript
// ✅ GOOD - Realistic
email: `testuser${randomId}@example.com`
name: `Test User ${randomId.substring(0, 4)}`
createdAt: Date.now()

// ❌ BAD - Unrealistic
email: "email"
name: "name"
createdAt: 0
```

### 5. ID Generation
Use **unique IDs** for each factory call:
```typescript
// ✅ GOOD - Unique
const randomId = Math.random().toString(36).substring(7);
_id: `user-test-${randomId}`

// ❌ BAD - Duplicate IDs
_id: "user-test-1" // Same ID every time
```

### 6. Related Data
Support **creating related entities**:
```typescript
// ✅ GOOD - Related data
export function createGroupWithMembers(memberCount: number) {
  const adminId = `user-admin-${generateId()}`;
  const memberIds = [adminId, ...generateMemberIds(memberCount - 1)];
  return createGroup({ adminId, memberIds });
}

// ❌ BAD - No relationship support
export function createGroup() { ... } // Can't specify members
```

---

## Common Patterns

### Pattern 1: Timestamps

```typescript
export function createEntity(overrides = {}) {
  const timestamp = Date.now();

  return {
    createdAt: overrides.createdAt || timestamp,
    updatedAt: overrides.updatedAt || timestamp,
    ...overrides
  };
}
```

### Pattern 2: Enums/Literals

```typescript
export function createEntity(overrides = {}) {
  return {
    status: overrides.status || "active", // Default to "active"
    role: overrides.role || "member", // Default to "member"
    ...overrides
  };
}
```

### Pattern 3: Arrays

```typescript
export function createEntity(overrides = {}) {
  return {
    tags: overrides.tags || [], // Default empty array
    items: overrides.items || ["default-item-1"], // Default with 1 item
    ...overrides
  };
}
```

### Pattern 4: Nested Objects

```typescript
export function createEntity(overrides = {}) {
  return {
    metadata: overrides.metadata || {
      source: "test",
      version: 1,
    },
    ...overrides
  };
}
```

### Pattern 5: Computed Fields

```typescript
export function createUser(overrides = {}) {
  const name = overrides.name || `Test User ${generateId()}`;

  return {
    name,
    // Compute email from name if not provided
    email: overrides.email || `${name.toLowerCase().replace(' ', '.')}@example.com`,
    ...overrides
  };
}
```

---

## Testing the Factory

```typescript
// tests/factories/[entity]Factory.test.ts

import { describe, it, expect } from 'vitest';
import { create[EntityName] } from './[entity]Factory';

describe('[EntityName] Factory', () => {
  it('creates entity with default values', () => {
    const entity = create[EntityName]();

    expect(entity._id).toBeTruthy();
    expect(entity.[field1]).toBeTruthy();
    expect(entity.createdAt).toBeGreaterThan(0);
  });

  it('overrides default values', () => {
    const entity = create[EntityName]({
      [field1]: "custom-value"
    });

    expect(entity.[field1]).toBe("custom-value");
  });

  it('creates unique entities', () => {
    const entity1 = create[EntityName]();
    const entity2 = create[EntityName]();

    expect(entity1._id).not.toBe(entity2._id);
  });
});
```

---

## Migration from Hardcoded Data

### Before (Hardcoded)
```typescript
it("tests something", async () => {
  const user = {
    _id: "user-test-1",
    email: "test@example.com",
    name: "Test User",
    createdAt: 1234567890
  };
  // ... test code
});
```

### After (Factory)
```typescript
import { createUser } from './factories/userFactory';

it("tests something", async () => {
  const user = createUser(); // Default values
  // ... test code
});

it("tests custom scenario", async () => {
  const user = createUser({ email: "custom@example.com" }); // Override
  // ... test code
});
```

---

## Examples from Project

See these files for real-world examples:
- `tests/factories/userFactory.ts` - User data
- `tests/factories/groupFactory.ts` - Group data with members
- `tests/factories/contributionFactory.ts` - Complex nested data
- `tests/factories/newsletterFactory.ts` - Date-based data

---

**Last Updated**: 2025-10-11
**Framework Version**: UEDS 1.0
