# Mastering TypeScript: Advanced Patterns and Best Practices

TypeScript has become the de facto standard for building large-scale JavaScript applications. This comprehensive guide covers advanced patterns, best practices, and real-world examples to help you master TypeScript.

## Why TypeScript Matters

TypeScript adds static typing to JavaScript, catching errors at compile-time and improving developer productivity. But it's much more than just types!

### Type Safety Benefits

```typescript
// Without TypeScript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// This will crash at runtime!
calculateTotal([{ name: 'Book' }]); // ❌ No price property

// With TypeScript
interface Item {
  name: string;
  price: number;
  quantity: number;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// TypeScript catches this error!
calculateTotal([{ name: 'Book' }]); // ✅ Compile-time error
```

[!tip]
TypeScript can catch approximately 15% of bugs before they reach production according to industry studies!

## Advanced Type Patterns

### Utility Types Mastery

TypeScript provides powerful utility types for common transformations:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<PartialUser>;

// Pick specific properties
type UserSummary = Pick<User, 'id' | 'name' | 'email'>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Make properties readonly
type ReadonlyUser = Readonly<User>;

// Create a record type
type UserRoles = Record<string, User>;
```

### Conditional Types

Build complex type logic with conditional types:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Practical example: Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: '1', name: 'John' };
}

type User = ReturnType<typeof getUser>; // { id: string; name: string; }
```

### Mapped Types

Transform existing types into new ones:

```typescript
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  api: {
    url: string;
    timeout: number;
  };
  features: {
    darkMode: boolean;
  };
}

type PartialConfig = DeepPartial<Config>;
// All nested properties are now optional!
```

## Generic Patterns

### Generic Constraints

```typescript
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Works with any type that has an id
const users = [{ id: '1', name: 'John' }];
const products = [{ id: '1', name: 'Book', price: 20 }];

findById(users, '1');
findById(products, '1');
```

### Generic Factory Pattern

```typescript
class Repository<T extends HasId> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }
  
  update(id: string, updates: Partial<T>): T | undefined {
    const item = this.findById(id);
    if (item) {
      Object.assign(item, updates);
    }
    return item;
  }
  
  delete(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Use with any entity
const userRepo = new Repository<User>();
const productRepo = new Repository<Product>();
```

## Type Guards and Narrowing

### Custom Type Guards

```typescript
interface Dog {
  type: 'dog';
  bark(): void;
}

interface Cat {
  type: 'cat';
  meow(): void;
}

type Animal = Dog | Cat;

// Type guard function
function isDog(animal: Animal): animal is Dog {
  return animal.type === 'dog';
}

function handleAnimal(animal: Animal) {
  if (isDog(animal)) {
    animal.bark(); // ✅ TypeScript knows it's a Dog
  } else {
    animal.meow(); // ✅ TypeScript knows it's a Cat
  }
}
```

### Discriminated Unions

```typescript
interface SuccessResponse {
  status: 'success';
  data: any;
}

interface ErrorResponse {
  status: 'error';
  error: string;
}

interface LoadingResponse {
  status: 'loading';
}

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      console.log(response.data); // ✅ data is available
      break;
    case 'error':
      console.log(response.error); // ✅ error is available
      break;
    case 'loading':
      console.log('Loading...'); // ✅ no extra properties
      break;
  }
}
```

[!note]
Discriminated unions are one of the most powerful features in TypeScript for modeling state!

## Advanced Patterns

### Builder Pattern

```typescript
class QueryBuilder<T> {
  private conditions: Array<(item: T) => boolean> = [];
  
  where(predicate: (item: T) => boolean): this {
    this.conditions.push(predicate);
    return this;
  }
  
  execute(data: T[]): T[] {
    return data.filter(item => 
      this.conditions.every(condition => condition(item))
    );
  }
}

// Usage
const results = new QueryBuilder<User>()
  .where(user => user.role === 'admin')
  .where(user => user.email.includes('@company.com'))
  .execute(users);
```

### Decorator Pattern (with experimental decorators)

```typescript
function Logger(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @Logger
  add(a: number, b: number): number {
    return a + b;
  }
}
```

## Type-Safe API Client

```typescript
interface Endpoints {
  '/users': {
    GET: { response: User[] };
    POST: { body: Omit<User, 'id'>; response: User };
  };
  '/users/:id': {
    GET: { response: User };
    PUT: { body: Partial<User>; response: User };
    DELETE: { response: void };
  };
}

class ApiClient {
  async request<
    Path extends keyof Endpoints,
    Method extends keyof Endpoints[Path]
  >(
    path: Path,
    method: Method,
    ...args: Endpoints[Path][Method] extends { body: infer B }
      ? [body: B]
      : []
  ): Promise<Endpoints[Path][Method] extends { response: infer R } ? R : never> {
    // Implementation
    const response = await fetch(path, {
      method: method as string,
      body: args[0] ? JSON.stringify(args[0]) : undefined,
    });
    return response.json();
  }
}

// Fully type-safe usage!
const client = new ApiClient();

const users = await client.request('/users', 'GET'); // User[]
const user = await client.request('/users/:id', 'GET'); // User
const newUser = await client.request('/users', 'POST', { 
  name: 'John', 
  email: 'john@example.com' 
}); // User
```

[!warning]
Template literal types can be computationally expensive. Use them judiciously in large codebases.

## Performance Optimization

### Type Complexity Analysis

TypeScript's type checker has complexity limits. Here's how to optimize:

| Pattern | Complexity | Recommendation |
|---------|-----------|----------------|
| Simple types | O(1) | ✅ Always use |
| Generic types | O(n) | ✅ Use freely |
| Mapped types | O(n²) | ⚠️ Use carefully |
| Recursive types | O(n³) | ⚠️ Limit depth |
| Template literals | O(2ⁿ) | ❌ Avoid deep nesting |

### Type Inference Optimization

```typescript
// ❌ Slow - TypeScript has to infer everything
const config = {
  api: {
    endpoints: {
      users: { path: '/users', method: 'GET' },
      posts: { path: '/posts', method: 'GET' }
    }
  }
} as const;

// ✅ Fast - Explicit type annotation
interface Config {
  api: {
    endpoints: Record<string, { path: string; method: string }>;
  };
}

const config: Config = {
  api: {
    endpoints: {
      users: { path: '/users', method: 'GET' },
      posts: { path: '/posts', method: 'GET' }
    }
  }
};
```

## Testing with TypeScript

```typescript
import { describe, it, expect } from 'vitest';

describe('UserService', () => {
  it('should create a user', async () => {
    const service = new UserService();
    const userData: Omit<User, 'id' | 'createdAt'> = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secure123',
      role: 'user'
    };
    
    const user = await service.createUser(userData);
    
    expect(user).toMatchObject({
      name: userData.name,
      email: userData.email,
      role: userData.role
    });
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});
```

## Type-Level Programming

TypeScript's type system is Turing complete! Here are some advanced examples:

### Type-Level Math

```typescript
type Length<T extends any[]> = T['length'];

type Push<T extends any[], V> = [...T, V];

type Reverse<T extends any[]> = T extends [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : [];

type Concat<A extends any[], B extends any[]> = [...A, ...B];

// Example usage
type A = [1, 2, 3];
type B = [4, 5];
type C = Concat<A, B>; // [1, 2, 3, 4, 5]
type D = Reverse<A>; // [3, 2, 1]
```

### String Manipulation at Type Level

```typescript
type Uppercase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Capitalize<First>}${Uppercase<Rest>}`
  : S;

type CamelToSnake<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `_${Lowercase<First>}${CamelToSnake<Rest>}`
    : `${First}${CamelToSnake<Rest>}`
  : S;

type Test = CamelToSnake<'userId'>; // 'user_id'
```

## Best Practices Checklist

✅ **Do's:**
- Use strict mode (`strict: true` in tsconfig.json)
- Prefer interfaces for object shapes
- Use type aliases for unions and complex types
- Leverage utility types instead of writing your own
- Use `unknown` instead of `any` when type is truly unknown
- Enable `noImplicitAny` and `strictNullChecks`

❌ **Don'ts:**
- Don't use `any` unless absolutely necessary
- Don't disable strict checks to make errors go away
- Don't create overly complex type hierarchies
- Don't ignore TypeScript errors
- Don't use `@ts-ignore` without a comment explaining why

## Real-World Example: Form Validation

```typescript
type Validator<T> = (value: T) => string | undefined;

class FormField<T> {
  constructor(
    private value: T,
    private validators: Validator<T>[] = []
  ) {}
  
  validate(): string[] {
    return this.validators
      .map(validator => validator(this.value))
      .filter((error): error is string => error !== undefined);
  }
  
  getValue(): T {
    return this.value;
  }
  
  setValue(value: T): void {
    this.value = value;
  }
}

class Form<T extends Record<string, any>> {
  private fields: { [K in keyof T]: FormField<T[K]> };
  
  constructor(initialValues: T) {
    this.fields = Object.entries(initialValues).reduce((acc, [key, value]) => {
      acc[key as keyof T] = new FormField(value);
      return acc;
    }, {} as any);
  }
  
  validate(): Record<keyof T, string[]> {
    return Object.entries(this.fields).reduce((acc, [key, field]) => {
      acc[key as keyof T] = (field as FormField<any>).validate();
      return acc;
    }, {} as any);
  }
  
  getValues(): T {
    return Object.entries(this.fields).reduce((acc, [key, field]) => {
      acc[key as keyof T] = (field as FormField<any>).getValue();
      return acc;
    }, {} as any);
  }
}
```

## Conclusion

TypeScript is a powerful tool that can dramatically improve code quality and developer experience. By mastering advanced patterns and following best practices, you can build type-safe, maintainable applications.

> "TypeScript is not just JavaScript with types - it's a powerful type system that enables new ways of thinking about code." - Anders Hejlsberg

### Key Takeaways

- 🎯 Use TypeScript's type system to catch bugs early
- 🔧 Leverage utility types and generic patterns
- 🛡️ Implement type guards for runtime safety
- 🚀 Optimize type complexity for better performance
- 📚 Study advanced patterns to level up your skills

---

**Resources:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Effective TypeScript](https://effectivetypescript.com/)
