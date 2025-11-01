/**
 * [Feature Name] Contract Template
 *
 * INSTRUCTIONS:
 * 1. Copy this file to tests/contracts/[feature-name].contract.ts
 * 2. Replace [FeatureName] with your feature name
 * 3. Define backend mutations and queries
 * 4. Define frontend component requirements
 * 5. Both agents implement from this contract
 *
 * PURPOSE:
 * - Ensures backend and frontend agree on API before implementation
 * - Prevents integration issues (field name mismatches, missing data)
 * - Serves as documentation for the feature
 *
 * WORKFLOW:
 * 1. Write contract FIRST (before any implementation)
 * 2. Backend agent implements mutations/queries from contract
 * 3. Frontend agent implements component from contract
 * 4. Integration works on first try (contract guarantees compatibility)
 */

export interface [FeatureName]Contract {
  // ==========================================
  // BACKEND API SPECIFICATION
  // ==========================================
  backend: {
    /**
     * MUTATIONS (Write Operations)
     *
     * Define all mutations that modify data.
     * For each mutation, specify:
     * - args: Input parameters
     * - returns: What the mutation returns
     * - errors: All possible error messages
     */
    mutations?: {
      // Example mutation
      [mutationName]: {
        /**
         * Input arguments
         * Specify type and any constraints (length, format, etc.)
         */
        args: {
          // Required arguments
          [requiredArg]: "Type description (e.g., Id<'groups'>)";
          [anotherArg]: "Type description (e.g., string, 1-50 chars)";

          // Optional arguments
          [optionalArg]?: "Type description (e.g., string, optional)";
        };

        /**
         * Return value
         * What the mutation returns on success
         */
        returns: "Return type (e.g., Id<'entities'>)";
        // OR for complex returns:
        // returns: {
        //   [field]: "Type";
        //   [field2]: "Type";
        // };

        /**
         * Error cases
         * List ALL possible errors this mutation can throw
         * Frontend will handle each of these
         */
        errors: [
          "Error message 1 (e.g., Not authenticated)",
          "Error message 2 (e.g., Invalid input)",
          "Error message 3 (e.g., Permission denied)"
        ];
      };

      // Add more mutations as needed
      // [anotherMutation]: { ... },
    };

    /**
     * QUERIES (Read Operations)
     *
     * Define all queries that fetch data.
     * For each query, specify:
     * - args: Input parameters
     * - returns: Data structure returned
     * - errors: All possible error messages
     */
    queries?: {
      // Example query
      [queryName]: {
        /**
         * Input arguments
         */
        args: {
          [requiredArg]: "Type description";
          [optionalArg]?: "Type description (e.g., filter, limit)";
        };

        /**
         * Return value
         * Define the exact structure of returned data
         */
        returns: {
          // Example: List with metadata
          items: "Array<{
            _id: Id<'table'>,
            [field1]: string,
            [field2]: number,
            [field3]?: string (optional)
          }>";
          totalCount: "number";
          hasMore: "boolean (pagination)";

          // OR for single entity:
          // [field]: "Type";
        };

        /**
         * Error cases
         */
        errors: [
          "Error message 1",
          "Error message 2"
        ];
      };

      // Add more queries as needed
      // [anotherQuery]: { ... },
    };
  };

  // ==========================================
  // FRONTEND COMPONENT SPECIFICATION
  // ==========================================
  frontend: {
    /**
     * Component name
     * The React component that uses this API
     */
    component: "[ComponentName] (e.g., GroupSettingsPage)";

    /**
     * Fields used by component
     * All fields the component displays or uses in logic
     */
    uses: [
      "[field1]",
      "[field2]",
      "[field3]",
      // ... all fields used
    ];

    /**
     * Required fields
     * Subset of 'uses' that MUST be present in backend response
     * Component will fail without these
     */
    requires: [
      "[mandatoryField1]",
      "[mandatoryField2]",
      // ... fields that must exist
    ];

    /**
     * Arguments sent to backend
     * What the component sends when calling mutations/queries
     */
    sends: {
      [mutationArg]: "Description of where value comes from (e.g., Form input, URL param)";
      [queryArg]: "Description of where value comes from";
      // ... all args the component sends
    };
  };
}

// ==========================================
// CONTRACT INSTANCE
// ==========================================
// Export the actual contract with concrete values
export const [featureName]Contract: [FeatureName]Contract = {
  backend: {
    mutations: {
      // Example: Update group name
      updateGroupName: {
        args: {
          groupId: "Id<'groups'>",
          name: "string (1-50 characters)"
        },
        returns: "Id<'groups'>",
        errors: [
          "Not authenticated",
          "Insufficient permissions",
          "Name too short",
          "Name too long",
          "Group not found"
        ]
      },
      // Add more mutations...
    },

    queries: {
      // Example: Get group data
      getGroupData: {
        args: {
          groupId: "Id<'groups'>"
        },
        returns: {
          _id: "Id<'groups'>",
          name: "string",
          description: "string",
          memberCount: "number",
          createdAt: "number (timestamp)"
        },
        errors: [
          "Not authenticated",
          "Not a member",
          "Group not found"
        ]
      },
      // Add more queries...
    }
  },

  frontend: {
    component: "GroupSettingsPage",
    uses: [
      "_id",
      "name",
      "description",
      "memberCount",
      "createdAt"
    ],
    requires: [
      "_id",
      "name"
    ],
    sends: {
      groupId: "From URL parameter /settings/[groupId]",
      name: "From form input field"
    }
  }
};

/**
 * USAGE EXAMPLES
 *
 * Backend Implementation:
 * ```typescript
 * // convex/groups.ts
 * import { [featureName]Contract } from "@/tests/contracts/[feature].contract";
 *
 * export const updateGroupName = mutation({
 *   args: {
 *     // Use contract to define args
 *     groupId: v.id("groups"),
 *     name: v.string()
 *   },
 *   handler: async (ctx, args) => {
 *     // Implement per contract
 *     // Return what contract specifies
 *     // Throw errors contract lists
 *   }
 * });
 * ```
 *
 * Frontend Implementation:
 * ```typescript
 * // app/settings/page.tsx
 * import { [featureName]Contract } from "@/tests/contracts/[feature].contract";
 *
 * export default function GroupSettingsPage() {
 *   const data = useQuery(api.groups.getGroupData, {
 *     groupId: groupIdFromURL
 *   });
 *
 *   const updateName = useMutation(api.groups.updateGroupName);
 *
 *   // Use fields specified in contract
 *   const { name, description, memberCount } = data;
 *
 *   // Handle errors specified in contract
 *   try {
 *     await updateName({ groupId, name: newName });
 *   } catch (error) {
 *     if (error.message === "Not authenticated") { ... }
 *     if (error.message === "Insufficient permissions") { ... }
 *   }
 * }
 * ```
 */
