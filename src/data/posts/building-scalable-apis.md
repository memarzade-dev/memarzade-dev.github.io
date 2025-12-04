# Building Scalable APIs with Node.js and Express

Learn how to build production-ready, scalable APIs with proper architecture, security, and performance optimization techniques.

## Architecture Overview

A well-designed API follows clear architectural principles:

```
┌─────────────────────────────────────────┐
│         API Gateway / Load Balancer     │
└─────────────────┬───────────────────────┘
                  │
     ┌────────────┴────────────┐
     │                         │
┌────▼─────┐            ┌─────▼────┐
│  API     │            │  API     │
│  Server  │            │  Server  │
└────┬─────┘            └─────┬────┘
     │                        │
     └────────┬───────────────┘
              │
     ┌────────▼────────┐
     │   Cache Layer   │
     │   (Redis)       │
     └────────┬────────┘
              │
     ┌────────▼────────┐
     │   Database      │
     │   (PostgreSQL)  │
     └─────────────────┘
```

## Project Structure

```typescript
src/
├── config/
│   ├── database.ts
│   ├── redis.ts
│   └── environment.ts
├── controllers/
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── errorHandler.middleware.ts
├── models/
│   ├── User.model.ts
│   └── Post.model.ts
├── routes/
│   ├── auth.routes.ts
│   └── user.routes.ts
├── services/
│   ├── auth.service.ts
│   └── user.service.ts
├── utils/
│   ├── logger.ts
│   ├── validation.ts
│   └── jwt.ts
├── types/
│   └── index.ts
└── app.ts
```

## Setting Up the Project

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express typescript @types/express
npm install dotenv cors helmet compression
npm install mongoose redis @types/redis
npm install jsonwebtoken bcrypt
npm install express-validator express-rate-limit
npm install winston morgan

# Install dev dependencies
npm install -D @types/node @types/jsonwebtoken @types/bcrypt
npm install -D @types/cors @types/compression
npm install -D nodemon ts-node
npm install -D jest @types/jest supertest @types/supertest
```

[!tip]
Always use TypeScript for large-scale projects. The type safety will save you countless hours of debugging!

## Core Application Setup

```typescript
// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/environment';
import { errorHandler } from './middleware/errorHandler.middleware';
import { logger } from './utils/logger';
import routes from './routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: config.allowedOrigins,
      credentials: true
    }));
    
    // Compression
    this.app.use(compression());
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));
  }

  private initializeRoutes(): void {
    this.app.use('/api/v1', routes);
    
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  }
}

export default App;
```

## Authentication & Authorization

### JWT Token Implementation

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtAccessExpiration,
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiration,
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
  }
}
```

### Authentication Middleware

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = JWTService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
};
```

## Request Validation

```typescript
// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/AppError';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : undefined,
      message: err.msg,
    }));

    throw new AppError('Validation failed', 400, extractedErrors);
  };
};
```

### Usage Example

```typescript
// src/routes/user.routes.ts
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post(
  '/users',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ]),
  UserController.create
);

router.get(
  '/users/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid user ID'),
  ]),
  UserController.getById
);

router.get(
  '/users',
  validate([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ]),
  UserController.list
);

export default router;
```

## Rate Limiting

```typescript
// src/middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rate-limit:',
    }),
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different limiters for different endpoints
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts',
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
});
```

## Error Handling

```typescript
// src/utils/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors: any[] = [],
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// src/middleware/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`${err.statusCode} - ${err.message}`, {
      error: err,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Unhandled errors
  logger.error('Unhandled error', {
    error: err,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

[!warning]
Never expose stack traces or sensitive error information in production!

## Database Layer

```typescript
// src/services/user.service.ts
import { User, IUser } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { redis } from '../config/redis';

export class UserService {
  private readonly CACHE_TTL = 3600; // 1 hour

  async findById(id: string): Promise<IUser> {
    // Check cache first
    const cacheKey = `user:${id}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // Query database
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Cache the result
    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(user));

    return user;
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = await User.create(data);
    return user.toObject();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Invalidate cache
    await redis.del(`user:${id}`);

    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Invalidate cache
    await redis.del(`user:${id}`);
  }

  async list(options: {
    page: number;
    limit: number;
    filters?: any;
  }): Promise<{ users: IUser[]; total: number; pages: number }> {
    const { page = 1, limit = 10, filters = {} } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filters),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
```

## Performance Optimization

### Database Indexing

```typescript
// src/models/User.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Index for fast lookups
    },
    name: {
      type: String,
      required: true,
      index: true, // Index for search
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true, // Index for filtering
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for common queries
UserSchema.index({ email: 1, role: 1 });

export const User = model<IUser>('User', UserSchema);
```

### Query Performance Metrics

| Operation | Without Index | With Index | Improvement |
|-----------|--------------|------------|-------------|
| Find by email | 150ms | 2ms | 98.7% faster |
| Find by role | 200ms | 5ms | 97.5% faster |
| Compound query | 300ms | 8ms | 97.3% faster |
| Sort + limit | 500ms | 15ms | 97% faster |

## Caching Strategy

```typescript
// src/utils/cache.ts
import { redis } from '../config/redis';

export class Cache {
  static async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  static async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
  }

  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  static async deletePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  static async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    await this.set(key, value, ttl);
    return value;
  }
}
```

## Testing

```typescript
// src/__tests__/user.service.test.ts
import { UserService } from '../services/user.service';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';

jest.mock('../models/User.model');
jest.mock('../config/redis');

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById('123');

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error when user not found', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('123')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };

      const mockCreatedUser = {
        ...userData,
        _id: '123',
        toObject: jest.fn().mockReturnValue({ ...userData, _id: '123' }),
      };

      (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await service.create(userData);

      expect(result).toHaveProperty('_id');
      expect(User.create).toHaveBeenCalledWith(userData);
    });
  });
});
```

## Monitoring & Logging

```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export { logger };
```

## Deployment Checklist

✅ **Security:**
- [ ] Environment variables properly configured
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled

✅ **Performance:**
- [ ] Database indexes created
- [ ] Caching implemented
- [ ] Response compression enabled
- [ ] Connection pooling configured
- [ ] Query optimization done

✅ **Monitoring:**
- [ ] Logging configured
- [ ] Error tracking (Sentry/similar)
- [ ] Performance monitoring (New Relic/similar)
- [ ] Health check endpoint
- [ ] Metrics collection

## Conclusion

Building scalable APIs requires careful attention to architecture, security, and performance. Follow these patterns and best practices to create production-ready APIs.

> "The best API is one that doesn't require documentation to understand, but is thoroughly documented anyway."

### Next Steps

1. Implement comprehensive testing (unit, integration, e2e)
2. Set up CI/CD pipeline
3. Add API documentation (Swagger/OpenAPI)
4. Implement request tracing
5. Set up automated backups

---

**Further Reading:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)
