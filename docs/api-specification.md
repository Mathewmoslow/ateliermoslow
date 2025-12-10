# File Portal API Specification

## API Overview

RESTful API endpoints for the file management portal with JWT authentication and comprehensive file operations.

## Base Configuration

```yaml
base_url: https://api.yoursite.com/v1
content_type: application/json
authentication: Bearer JWT
rate_limit: 100 requests/minute
max_file_size: 104857600  # 100MB
```

## Authentication Endpoints

### POST /auth/login
Authenticate user and receive JWT token

**Request:**
```json
{
  "password": "encrypted_password_hash"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshToken": "refresh_token_string"
}
```

### POST /auth/refresh
Refresh expired token

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "expiresIn": 3600
}
```

### POST /auth/logout
Invalidate current session

**Request:**
```json
{
  "token": "current_jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## File Operations

### GET /files/list
List directory contents

**Query Parameters:**
- `path` (string): Directory path (default: "/")
- `recursive` (boolean): Include subdirectories
- `hidden` (boolean): Show hidden files
- `sort` (string): Sort by "name", "size", "modified"
- `order` (string): "asc" or "desc"

**Response:**
```json
{
  "success": true,
  "path": "/home/sites",
  "items": [
    {
      "name": "index.html",
      "type": "file",
      "path": "/home/sites/index.html",
      "size": 2048,
      "modified": "2024-01-15T10:30:00Z",
      "permissions": "rw-r--r--",
      "mimeType": "text/html"
    },
    {
      "name": "assets",
      "type": "directory",
      "path": "/home/sites/assets",
      "itemCount": 15,
      "modified": "2024-01-14T15:20:00Z",
      "permissions": "rwxr-xr-x"
    }
  ],
  "totalItems": 25,
  "totalSize": 524288
}
```

### GET /files/read
Read file contents

**Query Parameters:**
- `path` (string, required): File path
- `encoding` (string): "utf8", "base64", "hex"
- `range` (string): Byte range for partial content

**Response:**
```json
{
  "success": true,
  "file": {
    "path": "/home/sites/index.html",
    "name": "index.html",
    "content": "<!DOCTYPE html>...",
    "size": 2048,
    "mimeType": "text/html",
    "encoding": "utf8",
    "checksum": "md5_hash_here"
  }
}
```

### POST /files/create
Create new file

**Request:**
```json
{
  "path": "/home/sites/new-file.js",
  "content": "console.log('Hello World');",
  "encoding": "utf8",
  "overwrite": false
}
```

**Response:**
```json
{
  "success": true,
  "file": {
    "path": "/home/sites/new-file.js",
    "size": 28,
    "created": "2024-01-15T11:00:00Z",
    "checksum": "md5_hash_here"
  }
}
```

### PUT /files/update
Update existing file

**Request:**
```json
{
  "path": "/home/sites/index.html",
  "content": "<!DOCTYPE html>...",
  "encoding": "utf8",
  "checksum": "original_md5_hash",
  "createBackup": true
}
```

**Response:**
```json
{
  "success": true,
  "file": {
    "path": "/home/sites/index.html",
    "size": 2148,
    "modified": "2024-01-15T11:05:00Z",
    "checksum": "new_md5_hash",
    "backup": "/home/sites/.backups/index.html.bak"
  }
}
```

### DELETE /files/delete
Delete file or directory

**Request:**
```json
{
  "path": "/home/sites/old-file.txt",
  "permanent": false,
  "recursive": false
}
```

**Response:**
```json
{
  "success": true,
  "deleted": {
    "path": "/home/sites/old-file.txt",
    "trashedAt": "/home/sites/.trash/old-file.txt",
    "deletedAt": "2024-01-15T11:10:00Z"
  }
}
```

### POST /files/move
Move or rename file/directory

**Request:**
```json
{
  "source": "/home/sites/old-name.html",
  "destination": "/home/sites/new-name.html",
  "overwrite": false
}
```

**Response:**
```json
{
  "success": true,
  "moved": {
    "from": "/home/sites/old-name.html",
    "to": "/home/sites/new-name.html",
    "movedAt": "2024-01-15T11:15:00Z"
  }
}
```

### POST /files/copy
Copy file or directory

**Request:**
```json
{
  "source": "/home/sites/template.html",
  "destination": "/home/sites/page.html",
  "overwrite": false,
  "recursive": true
}
```

**Response:**
```json
{
  "success": true,
  "copied": {
    "from": "/home/sites/template.html",
    "to": "/home/sites/page.html",
    "copiedAt": "2024-01-15T11:20:00Z",
    "size": 2048
  }
}
```

## Directory Operations

### POST /dirs/create
Create new directory

**Request:**
```json
{
  "path": "/home/sites/new-folder",
  "recursive": true,
  "permissions": "755"
}
```

**Response:**
```json
{
  "success": true,
  "directory": {
    "path": "/home/sites/new-folder",
    "created": "2024-01-15T11:25:00Z",
    "permissions": "rwxr-xr-x"
  }
}
```

### GET /dirs/tree
Get directory tree structure

**Query Parameters:**
- `path` (string): Root path
- `depth` (integer): Max depth level
- `includeFiles` (boolean): Include files in tree
- `includeHidden` (boolean): Include hidden items

**Response:**
```json
{
  "success": true,
  "tree": {
    "name": "sites",
    "type": "directory",
    "path": "/home/sites",
    "children": [
      {
        "name": "assets",
        "type": "directory",
        "path": "/home/sites/assets",
        "children": [
          {
            "name": "css",
            "type": "directory",
            "path": "/home/sites/assets/css",
            "children": []
          }
        ]
      },
      {
        "name": "index.html",
        "type": "file",
        "path": "/home/sites/index.html",
        "size": 2048
      }
    ]
  }
}
```

## Upload Operations

### POST /upload/file
Upload single file

**Request:** (multipart/form-data)
```
Content-Type: multipart/form-data
file: [binary data]
path: /home/sites/uploads/
overwrite: false
```

**Response:**
```json
{
  "success": true,
  "uploaded": {
    "filename": "document.pdf",
    "path": "/home/sites/uploads/document.pdf",
    "size": 524288,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-15T11:30:00Z"
  }
}
```

### POST /upload/multiple
Upload multiple files

**Request:** (multipart/form-data)
```
Content-Type: multipart/form-data
files[]: [binary data]
files[]: [binary data]
path: /home/sites/uploads/
```

**Response:**
```json
{
  "success": true,
  "uploaded": [
    {
      "filename": "image1.jpg",
      "path": "/home/sites/uploads/image1.jpg",
      "size": 102400,
      "status": "success"
    },
    {
      "filename": "image2.jpg",
      "path": "/home/sites/uploads/image2.jpg",
      "size": 204800,
      "status": "success"
    }
  ],
  "totalFiles": 2,
  "totalSize": 307200
}
```

### POST /upload/chunk
Upload file in chunks

**Request:**
```json
{
  "sessionId": "upload_session_123",
  "chunkIndex": 0,
  "totalChunks": 10,
  "filename": "large-file.zip",
  "data": "base64_encoded_chunk_data"
}
```

**Response:**
```json
{
  "success": true,
  "chunk": {
    "sessionId": "upload_session_123",
    "received": 1,
    "total": 10,
    "progress": 10
  }
}
```

## Batch Operations

### POST /batch/sync
Synchronize multiple operations

**Request:**
```json
{
  "operations": [
    {
      "id": "op_1",
      "type": "create",
      "path": "/home/sites/new.html",
      "content": "<!DOCTYPE html>..."
    },
    {
      "id": "op_2",
      "type": "update",
      "path": "/home/sites/existing.css",
      "content": "body { margin: 0; }"
    },
    {
      "id": "op_3",
      "type": "delete",
      "path": "/home/sites/old.txt"
    }
  ],
  "transaction": true
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "op_1",
      "status": "success",
      "message": "File created"
    },
    {
      "id": "op_2",
      "status": "success",
      "message": "File updated"
    },
    {
      "id": "op_3",
      "status": "error",
      "error": "File not found"
    }
  ],
  "successful": 2,
  "failed": 1,
  "syncedAt": "2024-01-15T11:35:00Z"
}
```

### POST /batch/delete
Delete multiple files

**Request:**
```json
{
  "paths": [
    "/home/sites/file1.txt",
    "/home/sites/file2.txt",
    "/home/sites/folder/"
  ],
  "permanent": false
}
```

**Response:**
```json
{
  "success": true,
  "deleted": 3,
  "failed": 0,
  "results": [
    {
      "path": "/home/sites/file1.txt",
      "status": "deleted"
    },
    {
      "path": "/home/sites/file2.txt",
      "status": "deleted"
    },
    {
      "path": "/home/sites/folder/",
      "status": "deleted"
    }
  ]
}
```

## Search Operations

### GET /search/files
Search for files and directories

**Query Parameters:**
- `query` (string, required): Search term
- `path` (string): Search root path
- `type` (string): "file", "directory", or "all"
- `extensions` (string): Comma-separated file extensions
- `sizeMin` (integer): Minimum file size in bytes
- `sizeMax` (integer): Maximum file size in bytes
- `modifiedAfter` (string): ISO date string
- `modifiedBefore` (string): ISO date string
- `limit` (integer): Max results (default: 50)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "name": "index.html",
      "path": "/home/sites/index.html",
      "type": "file",
      "size": 2048,
      "modified": "2024-01-15T10:30:00Z",
      "matches": [
        {
          "line": 10,
          "text": "Welcome to index page"
        }
      ]
    }
  ],
  "totalResults": 15,
  "searchTime": 125
}
```

## Metadata Operations

### GET /metadata/info
Get detailed file/directory metadata

**Query Parameters:**
- `path` (string, required): File or directory path

**Response:**
```json
{
  "success": true,
  "metadata": {
    "path": "/home/sites/index.html",
    "name": "index.html",
    "type": "file",
    "size": 2048,
    "created": "2024-01-01T00:00:00Z",
    "modified": "2024-01-15T10:30:00Z",
    "accessed": "2024-01-15T11:00:00Z",
    "permissions": "rw-r--r--",
    "owner": "user",
    "group": "www-data",
    "mimeType": "text/html",
    "encoding": "UTF-8",
    "checksum": {
      "md5": "5d41402abc4b2a76b9719d911017c592",
      "sha256": "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
    }
  }
}
```

### POST /metadata/update
Update file/directory metadata

**Request:**
```json
{
  "path": "/home/sites/index.html",
  "permissions": "644",
  "modified": "2024-01-15T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "updated": {
    "path": "/home/sites/index.html",
    "permissions": "rw-r--r--",
    "modified": "2024-01-15T12:00:00Z"
  }
}
```

## System Operations

### GET /system/status
Get system and storage status

**Response:**
```json
{
  "success": true,
  "status": {
    "storage": {
      "used": 1073741824,
      "available": 9126805504,
      "total": 10200547328,
      "percentage": 10.5
    },
    "files": {
      "count": 1250,
      "directories": 125,
      "totalSize": 524288000
    },
    "limits": {
      "maxFileSize": 104857600,
      "maxFiles": 100000,
      "maxStorage": 10737418240
    },
    "server": {
      "uptime": 864000,
      "version": "1.0.0",
      "node": "18.12.0"
    }
  }
}
```

### GET /system/activity
Get recent activity log

**Query Parameters:**
- `limit` (integer): Number of entries
- `offset` (integer): Skip entries
- `type` (string): Filter by operation type

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": "act_123",
      "type": "create",
      "path": "/home/sites/new.html",
      "timestamp": "2024-01-15T11:45:00Z",
      "size": 2048,
      "ip": "192.168.1.1"
    },
    {
      "id": "act_124",
      "type": "update",
      "path": "/home/sites/style.css",
      "timestamp": "2024-01-15T11:46:00Z",
      "size": 4096,
      "ip": "192.168.1.1"
    }
  ],
  "total": 250
}
```

## Error Responses

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "The requested file does not exist",
    "details": {
      "path": "/home/sites/missing.html"
    }
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### Error Codes
- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid token
- `AUTH_EXPIRED`: Token expired
- `PERMISSION_DENIED`: Insufficient permissions
- `FILE_NOT_FOUND`: File doesn't exist
- `FILE_EXISTS`: File already exists
- `DIR_NOT_EMPTY`: Directory not empty
- `INVALID_PATH`: Invalid file path
- `INVALID_NAME`: Invalid file/directory name
- `SIZE_LIMIT`: File size exceeds limit
- `STORAGE_FULL`: Storage quota exceeded
- `OPERATION_FAILED`: Operation failed
- `CONFLICT`: Version conflict
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## WebSocket Events

### Connection
```javascript
ws://api.yoursite.com/v1/events
Authorization: Bearer <token>
```

### Events

**File Changed:**
```json
{
  "event": "file.changed",
  "data": {
    "path": "/home/sites/index.html",
    "type": "update",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

**Sync Progress:**
```json
{
  "event": "sync.progress",
  "data": {
    "sessionId": "sync_123",
    "current": 5,
    "total": 10,
    "percentage": 50
  }
}
```

**Error:**
```json
{
  "event": "error",
  "data": {
    "code": "CONNECTION_LOST",
    "message": "Connection to server lost"
  }
}
```

## Rate Limiting

- Default: 100 requests per minute
- Upload: 10 requests per minute
- Download: 50 requests per minute
- Batch: 5 requests per minute

Headers:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Reset timestamp

## Security Headers

All responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
```

## CORS Configuration

```
Access-Control-Allow-Origin: https://yoursite.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```
