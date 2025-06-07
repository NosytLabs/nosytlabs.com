# JSDoc Templates for NosytLabs

Quick reference templates for standardized JSDoc documentation. Copy and modify these templates for consistent documentation across the codebase.

## File Header Template

```javascript
/**
 * @fileoverview Brief description of the file's purpose
 * 
 * Detailed description of what this module does, its main features,
 * and how it fits into the larger application architecture.
 * 
 * Key features:
 * - Feature 1 description
 * - Feature 2 description
 * - Feature 3 description
 * 
 * @module module-name
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */
```

## Function Template

```javascript
/**
 * Brief description of what the function does
 * 
 * More detailed explanation of the function's behavior,
 * including any important notes about usage or side effects.
 * 
 * @param {type} paramName - Description of the parameter
 * @param {type} [optionalParam] - Description of optional parameter
 * @param {type} [optionalParam=defaultValue] - Optional with default value
 * @returns {type} Description of what is returned
 * @throws {ErrorType} Description of when this error is thrown
 * @example
 * // Basic usage example
 * const result = functionName(param1, param2);
 * 
 * @example
 * // Advanced usage example
 * const result = functionName(param1, { option: true });
 * 
 * @since 1.0.0
 */
function functionName(paramName, optionalParam = defaultValue) {
  // Implementation
}
```

## Async Function Template

```javascript
/**
 * Brief description of the async function
 * 
 * Detailed explanation including what the function waits for
 * and any potential async-related considerations.
 * 
 * @async
 * @param {type} paramName - Description of parameter
 * @returns {Promise<type>} Description of resolved value
 * @throws {Error} Description of when this error is thrown
 * @example
 * // Using async/await
 * const result = await asyncFunction(param);
 * 
 * @example
 * // Using .then()
 * asyncFunction(param).then(result => {
 *   console.log(result);
 * });
 * 
 * @since 1.0.0
 */
async function asyncFunction(paramName) {
  // Implementation
}
```

## Class Template

```javascript
/**
 * Brief description of the class
 * 
 * Detailed explanation of what the class represents,
 * its main responsibilities, and usage patterns.
 * 
 * @class
 * @example
 * // Create instance
 * const instance = new ClassName(config);
 * 
 * // Use methods
 * const result = instance.methodName();
 * 
 * @since 1.0.0
 */
class ClassName {
  /**
   * Creates a new instance of ClassName
   * 
   * @param {object} config - Configuration object
   * @param {string} config.property - Description of property
   * @param {boolean} [config.optional=true] - Optional property
   */
  constructor(config) {
    // Implementation
  }

  /**
   * Brief description of the method
   * 
   * @param {type} param - Parameter description
   * @returns {type} Return value description
   * @example
   * const result = instance.methodName(param);
   */
  methodName(param) {
    // Implementation
  }
}
```

## Astro Component Template

```astro
---
/**
 * ComponentName - Brief description
 * 
 * Detailed description of what the component does,
 * its features, and how to use it effectively.
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 * 
 * @component
 * @example
 * <ComponentName
 *   prop1="value"
 *   prop2={true}
 *   prop3={variable}
 * />
 * 
 * @since 1.0.0
 */

/**
 * Props interface for ComponentName
 * 
 * @typedef {object} Props
 * @property {string} [prop1="default"] - Description of prop1
 * @property {boolean} [prop2=false] - Description of prop2
 * @property {number} prop3 - Required prop description
 */
export interface Props {
  prop1?: string;
  prop2?: boolean;
  prop3: number;
}

const {
  prop1 = "default",
  prop2 = false,
  prop3
} = Astro.props;
---
```

## TypeScript Interface Template

```typescript
/**
 * Brief description of the interface
 * 
 * Detailed explanation of what this interface represents
 * and how it should be used in the application.
 * 
 * @interface
 * @example
 * const config: ConfigInterface = {
 *   property1: "value",
 *   property2: 42
 * };
 * 
 * @since 1.0.0
 */
export interface ConfigInterface {
  /** Description of property1 */
  property1: string;
  
  /** Description of property2 */
  property2: number;
  
  /** Optional property description */
  optionalProperty?: boolean;
}
```

## Type Alias Template

```typescript
/**
 * Brief description of the type
 * 
 * Explanation of what values this type can represent
 * and when to use it.
 * 
 * @typedef {string} TypeName
 * @example
 * const value: TypeName = "valid-value";
 * 
 * @since 1.0.0
 */
export type TypeName = 'option1' | 'option2' | 'option3';
```

## Constant Template

```javascript
/**
 * Brief description of the constant
 * 
 * @constant {type}
 * @default defaultValue
 * @example
 * console.log(CONSTANT_NAME); // "value"
 * 
 * @since 1.0.0
 */
export const CONSTANT_NAME = "value";
```

## Object/Namespace Template

```javascript
/**
 * Brief description of the object/namespace
 * 
 * Detailed explanation of what this object contains
 * and how it's organized.
 * 
 * @namespace
 * @example
 * const value = OBJECT_NAME.property;
 * OBJECT_NAME.method();
 * 
 * @since 1.0.0
 */
export const OBJECT_NAME = {
  /** @type {string} Property description */
  property: "value",
  
  /**
   * Method description
   * 
   * @returns {void}
   */
  method() {
    // Implementation
  }
};
```

## Event Handler Template

```javascript
/**
 * Handles [event type] events for [element/component]
 * 
 * Detailed description of what the handler does,
 * including any side effects or state changes.
 * 
 * @param {Event} event - The event object
 * @param {type} [additionalParam] - Additional parameter if needed
 * @returns {void}
 * @example
 * element.addEventListener('click', handleClick);
 * 
 * @since 1.0.0
 */
function handleClick(event, additionalParam) {
  // Implementation
}
```

## Utility Function Template

```javascript
/**
 * Brief description of utility function
 * 
 * Explanation of the utility's purpose and when to use it.
 * Include any important notes about performance or limitations.
 * 
 * @param {type} input - Input parameter description
 * @returns {type} Output description
 * @throws {TypeError} When input is invalid
 * @example
 * // Basic usage
 * const result = utilityFunction(input);
 * 
 * @example
 * // Edge case handling
 * try {
 *   const result = utilityFunction(invalidInput);
 * } catch (error) {
 *   console.error('Invalid input:', error.message);
 * }
 * 
 * @since 1.0.0
 */
function utilityFunction(input) {
  // Implementation
}
```

## Quick Reference

### Required Tags by Type
- **Functions**: `@param`, `@returns`, `@example`
- **Classes**: `@class`, `@example`
- **Components**: `@component`, `@example`
- **Modules**: `@fileoverview`, `@module`

### Optional but Recommended
- `@throws` - For functions that can throw errors
- `@async` - For async functions
- `@since` - Version when added
- `@author` - Author information
- `@deprecated` - For deprecated code

### Common Types
- `{string}` - String values
- `{number}` - Numeric values
- `{boolean}` - True/false values
- `{object}` - Object types
- `{Array<type>}` - Arrays
- `{Promise<type>}` - Promises
- `{type|null}` - Union types
- `{type[]}` - Array shorthand

### Best Practices
1. Always include a brief description
2. Provide at least one usage example
3. Document all parameters and return values
4. Use proper type annotations
5. Include error conditions with `@throws`
6. Keep descriptions clear and concise
7. Update documentation when code changes
