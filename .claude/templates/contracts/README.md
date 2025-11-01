# API Contract Templates

Contracts define the API interface between backend and frontend **BEFORE implementation**. Both agents work from the same contract, ensuring perfect integration.

---

## Purpose

**Contracts solve the integration problem:**
- Backend knows exactly what to return
- Frontend knows exactly what to expect
- No mismatched field names
- No missing required data
- Integration works on first try

---

## How to Use

### 1. Create Contract BEFORE Implementation

```bash
# Create contract file
touch tests/contracts/[feature-name].contract.ts
```

### 2. Define Backend API

```typescript
export interface [FeatureName]Contract {
  backend: {
    mutations: {
      [mutationName]: {
        args: { /* ... */ };
        returns: /* ... */;
        errors: [/* ... */];
      };
    };
    queries: {
      [queryName]: {
        args: { /* ... */ };
        returns: { /* ... */ };
        errors: [/* ... */];
      };
    };
  };
  frontend: {
    component: "[ComponentName]";
    uses: [/* fields used */];
    requires: [/* mandatory fields */];
    sends: {/* args sent */};
  };
}
```

### 3. Backend Agent Implements Contract

Backend agent reads contract and implements:
- Exact field names specified
- Exact return types specified
- All error cases listed

### 4. Frontend Agent Implements Contract

Frontend agent reads contract and implements:
- Sends exact args specified
- Expects exact return fields
- Handles all error cases listed

### 5. Verify Integration

Contract ensures both sides match → integration works first time.

---

## Available Templates

### 1. Full-Stack Feature Contract
**File**: `full-stack-feature.contract.ts`
**Use for**: Features requiring both backend API and frontend UI

### 2. Backend-Only Contract
**File**: `backend-only.contract.ts`
**Use for**: API-only features (no frontend yet)

### 3. Frontend-Only Contract
**File**: `frontend-only.contract.ts`
**Use for**: UI-only features (using existing APIs)

---

## Contract Structure

### Full Contract Template

```typescript
/**
 * [Feature Name] Contract
 *
 * Defines API contract between backend and frontend for [feature description].
 *
 * Created: [YYYY-MM-DD]
 * Stories: STORY-[XX] (backend), STORY-[YY] (frontend)
 */

export interface [FeatureName]Contract {
  // ==================
  // BACKEND SPECIFICATION
  // ==================
  backend: {
    // Mutations (write operations)
    mutations?: {
      [mutationName]: {
        // Input arguments
        args: {
          [argName]: "Type description (e.g., Id<'users'>)";
          [optionalArg]?: "Type description (optional)";
        };

        // Return value
        returns: "Return type description (e.g., Id<'groups'>)";
        // OR for complex returns:
        returns: {
          [field]: "Type";
          [field2]: "Type";
        };

        // All possible errors this mutation can throw
        errors: [
          "Error message 1",
          "Error message 2",
          "Error message 3"
        ];
      };
    };

    // Queries (read operations)
    queries?: {
      [queryName]: {
        // Input arguments
        args: {
          [argName]: "Type description";
        };

        // Return value (usually an object or array)
        returns: {
          items: "Array<ObjectType>";
          totalCount: "number";
        };

        // All possible errors
        errors: [
          "Error message 1",
          "Error message 2"
        ];
      };
    };
  };

  // ==================
  // FRONTEND SPECIFICATION
  // ==================
  frontend: {
    // Component that uses this API
    component: "[ComponentName]";

    // Fields the component displays/uses
    uses: [
      "[field1]",
      "[field2]",
      "[field3]"
    ];

    // Mandatory fields (must be in backend response)
    requires: [
      "[mandatoryField1]",
      "[mandatoryField2]"
    ];

    // Arguments the component sends to backend
    sends: {
      [mutationArg]: "Description of what frontend sends";
      [queryArg]: "Description of what frontend sends";
    };
  };
}

// Export contract instance
export const [featureName]Contract: [FeatureName]Contract = {
  backend: {
    mutations: {
      // ... concrete values
    },
    queries: {
      // ... concrete values
    }
  },
  frontend: {
    component: "ConcreteComponentName",
    uses: ["field1", "field2"],
    requires: ["field1"],
    sends: {
      arg1: "value description"
    }
  }
};
```

---

## Examples

### Example 1: Simple CRUD Contract

```typescript
export interface GroupSettingsContract {
  backend: {
    mutations: {
      updateGroupName: {
        args: {
          groupId: "Id<'groups'>";
          name: "string (1-50 chars)";
        };
        returns: "Id<'groups'>";
        errors: [
          "Not authenticated",
          "Insufficient permissions",
          "Name too long"
        ];
      };
    };
    queries: {
      getGroupSettings: {
        args: {
          groupId: "Id<'groups'>";
        };
        returns: {
          name: "string";
          description: "string";
          memberCount: "number";
        };
        errors: [
          "Not authenticated",
          "Group not found"
        ];
      };
    };
  };
  frontend: {
    component: "GroupSettingsPage";
    uses: ["name", "description", "memberCount"];
    requires: ["name"];
    sends: {
      groupId: "Current group ID from URL",
      name: "Updated group name from form input"
    };
  };
}
```

### Example 2: List/Filter Contract

```typescript
export interface MemberListContract {
  backend: {
    queries: {
      listMembers: {
        args: {
          groupId: "Id<'groups'>";
          filter?: "string (search term)";
          limit?: "number (pagination)";
        };
        returns: {
          members: "Array<{ _id, name, email, role, joinedAt }>";
          totalCount: "number";
          hasMore: "boolean";
        };
        errors: [
          "Not authenticated",
          "Not a member"
        ];
      };
    };
  };
  frontend: {
    component: "MemberListComponent";
    uses: ["name", "email", "role", "joinedAt", "totalCount"];
    requires: ["_id", "name", "role"];
    sends: {
      groupId: "Current group ID",
      filter: "Search input value",
      limit: "Number of items per page"
    };
  };
}
```

### Example 3: Complex Nested Data Contract

```typescript
export interface GroupInviteContract {
  backend: {
    mutations: {
      createInvite: {
        args: {
          groupId: "Id<'groups'>";
          email: "string (valid email format)";
        };
        returns: {
          inviteId: "Id<'invites'>";
          inviteCode: "string (UUID)";
          expiresAt: "number (timestamp)";
        };
        errors: [
          "Not authenticated",
          "Not admin",
          "Invalid email",
          "User already member",
          "User is blocked"
        ];
      };
    };
    queries: {
      listInvites: {
        args: {
          groupId: "Id<'groups'>";
        };
        returns: {
          invites: "Array<{
            _id: Id<'invites'>,
            email: string,
            inviteCode: string,
            status: 'pending' | 'accepted' | 'expired',
            createdAt: number,
            expiresAt: number,
            inviterName: string
          }>";
        };
        errors: [
          "Not authenticated",
          "Not admin"
        ];
      };
    };
  };
  frontend: {
    component: "InviteManagementModal";
    uses: [
      "email",
      "inviteCode",
      "status",
      "createdAt",
      "expiresAt",
      "inviterName"
    ];
    requires: [
      "_id",
      "email",
      "status",
      "inviteCode"
    ];
    sends: {
      groupId: "Current group ID",
      email: "Email input from invite form"
    };
  };
}
```

---

## Best Practices

### 1. Define Contracts FIRST
```
✅ CORRECT FLOW:
  1. Create contract
  2. Backend implements from contract
  3. Frontend implements from contract
  4. Integration works

❌ WRONG FLOW:
  1. Backend builds API
  2. Frontend guesses what backend returns
  3. Integration fails (field name mismatch)
  4. Back-and-forth debugging
```

### 2. Be Specific About Types
```typescript
// ✅ GOOD - Specific
args: {
  email: "string (valid email format, max 100 chars)";
  role: "'admin' | 'member' (literal type)";
  groupId: "Id<'groups'> (Convex ID type)";
}

// ❌ BAD - Vague
args: {
  email: "string";
  role: "string";
  groupId: "string";
}
```

### 3. List ALL Error Cases
```typescript
// ✅ GOOD - Complete error list
errors: [
  "Not authenticated",
  "Not admin",
  "Invalid email format",
  "User already member",
  "User is blocked",
  "Group not found"
]

// ❌ BAD - Incomplete
errors: ["Error"]
```

### 4. Specify Required vs Optional
```typescript
// ✅ GOOD - Clear optionality
frontend: {
  uses: ["name", "email", "avatar"], // All fields used
  requires: ["name", "email"], // Only these are mandatory
}

// ❌ BAD - Unclear
frontend: {
  uses: ["name", "email", "avatar"], // Are all required?
}
```

### 5. Document Edge Cases
```typescript
// ✅ GOOD - Edge cases documented
args: {
  limit: "number (default: 50, max: 100, min: 1)";
  filter: "string (optional, empty string = no filter)";
}

// ❌ BAD - No edge case info
args: {
  limit: "number";
  filter: "string";
}
```

---

## Verification Checklist

After implementing from contract:

### Backend Verification
- [ ] All mutations implemented
- [ ] All queries implemented
- [ ] Return types match contract exactly
- [ ] All error cases throw correct messages
- [ ] Field names match contract

### Frontend Verification
- [ ] Component sends correct args
- [ ] Component expects correct return fields
- [ ] Component handles all contract errors
- [ ] All required fields are used
- [ ] No assumptions about non-required fields

### Integration Test
- [ ] Backend returns what frontend expects
- [ ] Frontend sends what backend expects
- [ ] Error handling works end-to-end
- [ ] Field names match perfectly

---

## Common Pitfalls

### Pitfall 1: Field Name Mismatch
```typescript
// Contract says:
returns: { memberCount: "number" }

// Backend returns:
{ count: 123 } // ❌ Wrong field name

// Frontend expects:
data.memberCount // ❌ Undefined!

// Solution: Follow contract exactly
{ memberCount: 123 } // ✅
```

### Pitfall 2: Missing Error Case
```typescript
// Contract lists:
errors: ["Not authenticated", "Not admin"]

// Backend throws:
throw new Error("Insufficient permissions") // ❌ Not in contract!

// Frontend doesn't handle this error
// Solution: Throw only errors listed in contract
```

### Pitfall 3: Optional Field Assumptions
```typescript
// Contract:
requires: ["name"] // Only name is required

// Frontend assumes:
const avatar = data.avatar.url; // ❌ avatar might be undefined!

// Solution: Check optional fields
const avatar = data.avatar?.url || "default.png"; // ✅
```

---

## Migration from No Contract

### Before (No Contract)
```typescript
// Backend (guessing what frontend needs)
return { name, count, users };

// Frontend (guessing what backend returns)
const memberCount = data.count; // Hope this field exists!
```

### After (With Contract)
```typescript
// Contract defines interface
interface Contract {
  backend: {
    queries: {
      getData: {
        returns: { name: "string", memberCount: "number", users: "array" }
      }
    }
  }
}

// Backend implements contract
return { name, memberCount, users }; // Exact field names

// Frontend uses contract
const count = data.memberCount; // Guaranteed to exist
```

---

**Last Updated**: 2025-10-11
**Framework Version**: UEDS 1.0
