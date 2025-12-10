# File Portal - Technical Implementation Guide

## Project Structure

```
file-portal/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── editor/      # Editor components
│   │   │   ├── explorer/    # File explorer components
│   │   │   ├── modals/      # Modal components
│   │   │   └── shared/      # Shared/common components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── store/           # State management (Zustand)
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── styles/          # Global styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuration files
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                    # Shared types/utilities
│   └── types/
│
├── docker-compose.yml        # Docker configuration
├── .env.example              # Environment variables template
└── README.md
```

## Frontend Setup

### 1. Initialize React Project

```bash
# Create Vite React project with TypeScript
npm create vite@latest file-portal-client -- --template react-ts
cd file-portal-client

# Install dependencies
npm install
```

### 2. Install Required Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@monaco-editor/react": "^4.6.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "react-dropzone": "^14.2.3",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwindcss": "^3.3.6",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "sonner": "^1.2.4",
    "crypto-js": "^4.2.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 3. Core Component Implementation

```typescript
// src/store/fileStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  modified?: Date;
  children?: FileNode[];
}

interface FileStore {
  // State
  fileTree: FileNode[];
  openFiles: Map<string, string>;
  activeFile: string | null;
  unsavedFiles: Set<string>;
  
  // Actions
  loadFileTree: () => Promise<void>;
  openFile: (path: string) => Promise<void>;
  closeFile: (path: string) => void;
  saveFile: (path: string, content: string) => Promise<void>;
  createFile: (path: string, content?: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
}

export const useFileStore = create<FileStore>()(
  devtools(
    persist(
      (set, get) => ({
        fileTree: [],
        openFiles: new Map(),
        activeFile: null,
        unsavedFiles: new Set(),
        
        loadFileTree: async () => {
          // Implementation
        },
        
        openFile: async (path) => {
          // Implementation
        },
        
        // ... other actions
      }),
      {
        name: 'file-storage',
      }
    )
  )
);
```

```typescript
// src/components/editor/MonacoEditor.tsx
import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useFileStore } from '@/store/fileStore';

interface MonacoEditorProps {
  file: string;
  content: string;
  onChange: (value: string) => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  file,
  content,
  onChange,
}) => {
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
    });
    
    // Add keyboard shortcuts
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        // Save file
        console.log('Save triggered');
      }
    );
  };
  
  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      py: 'python',
      sql: 'sql',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
    };
    return languageMap[ext || ''] || 'plaintext';
  };
  
  return (
    <Editor
      height="100%"
      defaultLanguage={getLanguage(file)}
      language={getLanguage(file)}
      value={content}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
        wordWrap: 'on',
      }}
    />
  );
};
```

### 4. API Service Layer

```typescript
// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import { toast } from 'sonner';

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
    });
    
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Authentication
  async login(password: string): Promise<void> {
    const response = await this.client.post('/auth/login', {
      password: this.hashPassword(password),
    });
    this.token = response.data.token;
    localStorage.setItem('token', this.token);
  }
  
  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    this.token = null;
    localStorage.removeItem('token');
  }
  
  // File operations
  async listFiles(path = '/'): Promise<FileNode[]> {
    const response = await this.client.get('/files/list', {
      params: { path },
    });
    return response.data.items;
  }
  
  async readFile(path: string): Promise<string> {
    const response = await this.client.get('/files/read', {
      params: { path },
    });
    return response.data.file.content;
  }
  
  async createFile(path: string, content = ''): Promise<void> {
    await this.client.post('/files/create', {
      path,
      content,
    });
  }
  
  async updateFile(path: string, content: string): Promise<void> {
    await this.client.put('/files/update', {
      path,
      content,
    });
  }
  
  async deleteFile(path: string): Promise<void> {
    await this.client.delete('/files/delete', {
      data: { path },
    });
  }
  
  async uploadFile(file: File, path: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    await this.client.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Upload progress: ${progress}%`);
      },
    });
  }
  
  // Batch operations
  async syncOperations(operations: Operation[]): Promise<void> {
    await this.client.post('/batch/sync', {
      operations,
      transaction: true,
    });
  }
  
  // Utilities
  private hashPassword(password: string): string {
    // Use Web Crypto API or crypto-js
    return password; // Implement actual hashing
  }
  
  private async refreshToken(): Promise<void> {
    // Implement token refresh logic
  }
}

export const api = new ApiService();
```

## Backend Setup

### 1. Initialize Node.js Project

```bash
# Create server directory
mkdir file-portal-server
cd file-portal-server

# Initialize npm
npm init -y

# Install dependencies
npm install express cors helmet morgan compression
npm install jsonwebtoken bcrypt
npm install multer chokidar
npm install dotenv
npm install ws

# Dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/jsonwebtoken @types/bcrypt
npm install -D @types/multer @types/ws
npm install -D nodemon ts-node
npm install -D eslint prettier
```

### 2. Express Server Implementation

```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { WebSocketServer } from 'ws';
import { config } from './config';
import { authRouter } from './routes/auth';
import { filesRouter } from './routes/files';
import { uploadRouter } from './routes/upload';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

const app = express();
const PORT = config.port || 3001;

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/files', authenticateToken, filesRouter);
app.use('/api/upload', authenticateToken, uploadRouter);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    // Handle messages
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});
```

```typescript
// src/controllers/fileController.ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export class FileController {
  private basePath: string;
  
  constructor(basePath: string) {
    this.basePath = basePath;
  }
  
  async listFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const dirPath = path.join(
        this.basePath,
        req.query.path as string || '/'
      );
      
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      const files = await Promise.all(
        items.map(async (item) => {
          const itemPath = path.join(dirPath, item.name);
          const stats = await fs.stat(itemPath);
          
          return {
            name: item.name,
            type: item.isDirectory() ? 'directory' : 'file',
            path: path.relative(this.basePath, itemPath),
            size: stats.size,
            modified: stats.mtime,
          };
        })
      );
      
      res.json({
        success: true,
        path: req.query.path,
        items: files,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async readFile(req: Request, res: Response, next: NextFunction) {
    try {
      const filePath = path.join(this.basePath, req.query.path as string);
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      
      res.json({
        success: true,
        file: {
          path: req.query.path,
          name: path.basename(filePath),
          content,
          size: stats.size,
          checksum: this.generateChecksum(content),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  async createFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { path: filePath, content = '', overwrite = false } = req.body;
      const fullPath = path.join(this.basePath, filePath);
      
      // Check if file exists
      if (!overwrite) {
        try {
          await fs.access(fullPath);
          return res.status(409).json({
            success: false,
            error: {
              code: 'FILE_EXISTS',
              message: 'File already exists',
            },
          });
        } catch {
          // File doesn't exist, continue
        }
      }
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      
      // Write file
      await fs.writeFile(fullPath, content);
      
      res.json({
        success: true,
        file: {
          path: filePath,
          size: Buffer.byteLength(content),
          created: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  private generateChecksum(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }
}
```

## Security Implementation

### 1. Password Protection

```typescript
// src/utils/crypto.ts
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class CryptoService {
  private secretKey: string;
  private jwtSecret: string;
  
  constructor() {
    this.secretKey = process.env.ENCRYPTION_KEY || 'default-key';
    this.jwtSecret = process.env.JWT_SECRET || 'jwt-secret';
  }
  
  // Client-side password hashing
  hashPassword(password: string): string {
    return crypto
      .createHash('sha256')
      .update(password + this.secretKey)
      .digest('hex');
  }
  
  // Server-side password verification
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  // JWT token generation
  generateToken(userId: string): string {
    return jwt.sign(
      { userId, timestamp: Date.now() },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }
  
  // JWT token verification
  verifyToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
  
  // File encryption (optional)
  encryptFile(content: Buffer): Buffer {
    const cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
    return Buffer.concat([cipher.update(content), cipher.final()]);
  }
  
  // File decryption (optional)
  decryptFile(encrypted: Buffer): Buffer {
    const decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }
}
```

### 2. Middleware Implementation

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { CryptoService } from '../utils/crypto';

const crypto = new CryptoService();

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }
  
  try {
    const decoded = crypto.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTH_INVALID',
        message: 'Invalid or expired token',
      },
    });
  }
};
```

## Synchronization System

### 1. Queue Management

```typescript
// src/services/syncQueue.ts
interface Operation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'move' | 'copy';
  path: string;
  data?: any;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export class SyncQueue {
  private queue: Operation[] = [];
  private processing = false;
  
  add(operation: Omit<Operation, 'id' | 'timestamp' | 'status'>): void {
    this.queue.push({
      ...operation,
      id: this.generateId(),
      timestamp: new Date(),
      status: 'pending',
    });
  }
  
  async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const operation = this.queue.find(op => op.status === 'pending');
      if (!operation) break;
      
      operation.status = 'processing';
      
      try {
        await this.executeOperation(operation);
        operation.status = 'completed';
      } catch (error) {
        operation.status = 'failed';
        operation.error = error.message;
      }
    }
    
    this.processing = false;
  }
  
  private async executeOperation(operation: Operation): Promise<void> {
    switch (operation.type) {
      case 'create':
        await this.handleCreate(operation);
        break;
      case 'update':
        await this.handleUpdate(operation);
        break;
      case 'delete':
        await this.handleDelete(operation);
        break;
      case 'move':
        await this.handleMove(operation);
        break;
      case 'copy':
        await this.handleCopy(operation);
        break;
    }
  }
  
  private generateId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Operation handlers...
  private async handleCreate(operation: Operation): Promise<void> {
    // Implementation
  }
  
  private async handleUpdate(operation: Operation): Promise<void> {
    // Implementation
  }
  
  private async handleDelete(operation: Operation): Promise<void> {
    // Implementation
  }
  
  private async handleMove(operation: Operation): Promise<void> {
    // Implementation
  }
  
  private async handleCopy(operation: Operation): Promise<void> {
    // Implementation
  }
}
```

### 2. Conflict Resolution

```typescript
// src/services/conflictResolver.ts
interface ConflictStrategy {
  type: 'lastWriteWins' | 'manual' | 'backup';
}

export class ConflictResolver {
  private strategy: ConflictStrategy;
  
  constructor(strategy: ConflictStrategy = { type: 'lastWriteWins' }) {
    this.strategy = strategy;
  }
  
  async resolve(
    localFile: FileInfo,
    remoteFile: FileInfo
  ): Promise<Resolution> {
    switch (this.strategy.type) {
      case 'lastWriteWins':
        return this.lastWriteWins(localFile, remoteFile);
      case 'manual':
        return this.manualResolve(localFile, remoteFile);
      case 'backup':
        return this.backupAndReplace(localFile, remoteFile);
    }
  }
  
  private lastWriteWins(
    localFile: FileInfo,
    remoteFile: FileInfo
  ): Resolution {
    if (localFile.modified > remoteFile.modified) {
      return {
        action: 'useLocal',
        file: localFile,
      };
    }
    return {
      action: 'useRemote',
      file: remoteFile,
    };
  }
  
  private async manualResolve(
    localFile: FileInfo,
    remoteFile: FileInfo
  ): Promise<Resolution> {
    // Prompt user for resolution
    return {
      action: 'manual',
      localFile,
      remoteFile,
    };
  }
  
  private async backupAndReplace(
    localFile: FileInfo,
    remoteFile: FileInfo
  ): Promise<Resolution> {
    // Create backup of local file
    const backupPath = `${localFile.path}.backup`;
    await this.createBackup(localFile, backupPath);
    
    return {
      action: 'useRemote',
      file: remoteFile,
      backup: backupPath,
    };
  }
  
  private async createBackup(file: FileInfo, backupPath: string): Promise<void> {
    // Implementation
  }
}
```

## Deployment Configuration

### 1. Docker Setup

```dockerfile
# Dockerfile for client
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Dockerfile for server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server
    environment:
      - VITE_API_URL=http://server:3001/api
  
  server:
    build: ./server
    ports:
      - "3001:3001"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - FILE_BASE_PATH=/app/data
```

### 2. Environment Configuration

```bash
# .env.example

# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-encryption-key-change-this
PASSWORD_HASH=your-bcrypt-password-hash
SESSION_TIMEOUT=1800000

# File System
FILE_BASE_PATH=/home/sites
MAX_FILE_SIZE=104857600
ALLOWED_EXTENSIONS=html,css,js,jsx,ts,tsx,json,md,txt,pdf,png,jpg,gif

# CORS
CORS_ORIGIN=https://yoursite.com

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name yoursite.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yoursite.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yoursite.crt;
    ssl_certificate_key /etc/ssl/private/yoursite.key;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Client app
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Testing Strategy

### 1. Unit Tests

```typescript
// tests/fileController.test.ts
import { FileController } from '../src/controllers/fileController';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('FileController', () => {
  let controller: FileController;
  
  beforeEach(() => {
    controller = new FileController('/test/base');
  });
  
  describe('listFiles', () => {
    it('should list files in directory', async () => {
      const mockFiles = [
        { name: 'file1.txt', isDirectory: () => false },
        { name: 'folder', isDirectory: () => true },
      ];
      
      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.stat as jest.Mock).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
      });
      
      const req = { query: { path: '/' } };
      const res = { json: jest.fn() };
      const next = jest.fn();
      
      await controller.listFiles(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        path: '/',
        items: expect.any(Array),
      });
    });
  });
});
```

### 2. Integration Tests

```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import app from '../src/app';

describe('API Integration Tests', () => {
  let token: string;
  
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test-password' });
    
    token = response.body.token;
  });
  
  describe('File Operations', () => {
    test('Create file', async () => {
      const response = await request(app)
        .post('/api/files/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          path: '/test.txt',
          content: 'Hello World',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('Read file', async () => {
      const response = await request(app)
        .get('/api/files/read')
        .set('Authorization', `Bearer ${token}`)
        .query({ path: '/test.txt' });
      
      expect(response.status).toBe(200);
      expect(response.body.file.content).toBe('Hello World');
    });
  });
});
```

## Performance Optimization

### 1. Frontend Optimizations

```typescript
// Lazy loading components
const FileExplorer = lazy(() => import('./components/FileExplorer'));
const MonacoEditor = lazy(() => import('./components/MonacoEditor'));

// Virtual scrolling for file lists
import { FixedSizeList } from 'react-window';

const VirtualFileList = ({ files }) => (
  <FixedSizeList
    height={600}
    itemCount={files.length}
    itemSize={35}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <FileItem file={files[index]} />
      </div>
    )}
  </FixedSizeList>
);

// Debounced search
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const useSearch = (searchFn: Function, delay = 300) => {
  return useMemo(
    () => debounce(searchFn, delay),
    [searchFn, delay]
  );
};
```

### 2. Backend Optimizations

```typescript
// File caching
import NodeCache from 'node-cache';

class FileCache {
  private cache: NodeCache;
  
  constructor(ttl = 300) {
    this.cache = new NodeCache({ stdTTL: ttl });
  }
  
  async getFile(path: string): Promise<string | undefined> {
    const cached = this.cache.get<string>(path);
    if (cached) return cached;
    
    const content = await fs.readFile(path, 'utf-8');
    this.cache.set(path, content);
    return content;
  }
  
  invalidate(path: string): void {
    this.cache.del(path);
  }
}

// Stream large files
import { pipeline } from 'stream/promises';

async function streamFile(req: Request, res: Response) {
  const filePath = path.join(basePath, req.query.path);
  const stream = fs.createReadStream(filePath);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  await pipeline(stream, res);
}
```

## Monitoring & Logging

```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'file-portal' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

## Conclusion

This implementation guide provides a complete foundation for building your file management portal. The architecture is designed to be:

- **Secure**: Multiple layers of authentication and encryption
- **Scalable**: Modular design allows for easy expansion
- **Performant**: Optimizations for large file operations
- **Maintainable**: Clean code structure with TypeScript
- **Extensible**: Plugin architecture for future tools

Next steps:
1. Set up the development environment
2. Implement core functionality
3. Add security measures
4. Test thoroughly
5. Deploy with Docker
6. Monitor and optimize

The system can be extended with additional features like version control, collaborative editing, and advanced search capabilities as needed.
