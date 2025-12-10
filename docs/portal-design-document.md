# File Management Portal - Design Document

## Project Overview

A secure, web-based file management portal that replicates Neocities functionality while providing enhanced security and extensibility for personal use. Built as a React application with potential for future tool suite expansion.

## Core Requirements

### Functional Requirements
1. **File Operations**
   - Create, read, update, delete files
   - Directory management (create, rename, delete)
   - Multi-file upload support
   - Direct in-browser editing for HTML, JSON, TXT files
   - File renaming and moving between directories

2. **Security**
   - Password-protected access (client-side gate)
   - Encrypted password storage
   - Session management
   - No server-level authentication required

3. **Synchronization**
   - Batch operations queue
   - End-of-session reconciliation with server
   - Conflict resolution for simultaneous edits
   - Rollback capability for failed operations

4. **Accessibility**
   - Responsive design for mobile and desktop
   - Accessible from anywhere via internet
   - Works across modern browsers

## System Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand or Redux Toolkit
- **UI Library**: Tailwind CSS + Shadcn/ui components
- **Editor**: Monaco Editor (VS Code editor)
- **File Upload**: react-dropzone
- **Icons**: Lucide React
- **Routing**: React Router v6

### Backend Requirements
- **API**: RESTful or GraphQL endpoint
- **Storage**: File system with organized directory structure
- **Authentication**: JWT tokens for session management
- **File Operations**: Node.js fs module or similar

### Data Flow Architecture
```
User Interface → React Components → State Management
                      ↓
                 API Service Layer
                      ↓
                Backend API → File System
```

## Component Structure

### 1. Authentication Layer
```
<AuthGate>
  - PasswordInput
  - RememberMe option
  - Encryption handler
</AuthGate>
```

### 2. Main Application Shell
```
<AppShell>
  - Header (user info, logout, sync status)
  - Sidebar (file tree navigation)
  - MainContent (editor/viewer area)
  - StatusBar (operations queue, sync status)
</AppShell>
```

### 3. File Explorer Component
```
<FileExplorer>
  - TreeView (hierarchical directory structure)
  - ContextMenu (right-click operations)
  - DragAndDrop (file/folder moving)
  - SearchBar (file search functionality)
</FileExplorer>
```

### 4. Editor Component
```
<FileEditor>
  - MonacoEditor (syntax highlighting)
  - TabManager (multiple files open)
  - SaveIndicator (unsaved changes)
  - PreviewPane (HTML preview)
</FileEditor>
```

### 5. File Operations Panel
```
<FileOperations>
  - UploadZone (drag & drop area)
  - NewFileDialog
  - BulkOperations (select multiple)
  - OperationsQueue (pending changes)
</FileOperations>
```

## Feature Specifications

### File Management Features

#### Create Operations
- New file with template options
- New folder with naming validation
- Bulk file creation from templates
- Import from URL

#### Read Operations
- File content viewing
- Image preview with zoom
- PDF viewer integration
- Code syntax highlighting
- Markdown preview

#### Update Operations
- In-line editing for text files
- Visual HTML editor option
- JSON validator and formatter
- Auto-save drafts
- Version history (local)

#### Delete Operations
- Soft delete (trash bin)
- Permanent delete confirmation
- Bulk delete operations
- Empty trash functionality

### Editor Features
- **Multi-tab editing**: Open multiple files simultaneously
- **Syntax highlighting**: HTML, CSS, JS, JSON, MD
- **Auto-completion**: HTML tags, CSS properties
- **Find & Replace**: Global and file-specific
- **Code folding**: Collapse/expand code blocks
- **Theme selection**: Light/dark mode

### Synchronization System

#### Queue Management
```javascript
interface OperationQueue {
  pending: Operation[];
  completed: Operation[];
  failed: Operation[];
  
  methods: {
    addOperation(op: Operation): void;
    processQueue(): Promise<void>;
    retryFailed(): Promise<void>;
    clearQueue(): void;
  }
}
```

#### Conflict Resolution
- Last-write-wins strategy
- Manual merge option for conflicts
- Backup before overwrite
- Detailed conflict logs

## Security Implementation

### Password Protection
```javascript
// Client-side encryption using Web Crypto API
interface SecurityLayer {
  hashPassword(password: string): Promise<string>;
  encryptData(data: any, key: string): Promise<string>;
  decryptData(encrypted: string, key: string): Promise<any>;
  validateSession(): boolean;
}
```

### Session Management
- 30-minute idle timeout
- Refresh token mechanism
- Secure cookie storage
- Activity monitoring

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Header Bar                                     │
│  [Logo] [Path Breadcrumb]    [Sync] [Settings] │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  Sidebar    │     Main Content Area            │
│             │                                   │
│  [File Tree]│     [Editor/Viewer]              │
│             │                                   │
│  [Actions]  │     [Tabs for open files]        │
│             │                                   │
├─────────────┴───────────────────────────────────┤
│  Status Bar                                     │
│  [Queue: 3] [Saved] [Line 45, Col 12]         │
└─────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- Mobile: < 640px (single column, collapsible sidebar)
- Tablet: 640px - 1024px (adjustable split view)
- Desktop: > 1024px (full feature layout)

## State Management Schema

```typescript
interface AppState {
  auth: {
    isAuthenticated: boolean;
    sessionToken: string;
    expiresAt: Date;
  };
  
  files: {
    tree: FileNode[];
    openFiles: File[];
    activeFile: string;
    unsavedChanges: Map<string, string>;
  };
  
  operations: {
    queue: Operation[];
    syncStatus: 'idle' | 'syncing' | 'error';
    lastSync: Date;
  };
  
  ui: {
    sidebarWidth: number;
    theme: 'light' | 'dark';
    editorSettings: EditorConfig;
  };
}
```

## API Endpoints Design

### File Operations
- `GET /api/files/list` - List directory contents
- `GET /api/files/read/:path` - Read file content
- `POST /api/files/create` - Create new file
- `PUT /api/files/update/:path` - Update file
- `DELETE /api/files/delete/:path` - Delete file
- `POST /api/files/move` - Move/rename file

### Directory Operations
- `POST /api/dirs/create` - Create directory
- `DELETE /api/dirs/delete/:path` - Delete directory
- `POST /api/dirs/rename` - Rename directory

### Batch Operations
- `POST /api/batch/sync` - Sync all changes
- `POST /api/batch/upload` - Multiple file upload
- `POST /api/batch/delete` - Bulk delete

## Extension Points

### Plugin Architecture
```typescript
interface PortalPlugin {
  name: string;
  version: string;
  
  hooks: {
    onFileOpen?: (file: File) => void;
    onFileSave?: (file: File) => void;
    onToolbarRender?: () => ReactElement;
  };
  
  tools?: Tool[];
  fileHandlers?: FileHandler[];
}
```

### Future Tool Integration
- **Markdown Editor**: Enhanced MD editing with preview
- **Image Editor**: Basic image manipulation
- **Code Formatter**: Prettier integration
- **Git Integration**: Version control
- **Terminal**: Web-based terminal
- **Database Viewer**: SQLite browser
- **API Tester**: Postman-like functionality

## Implementation Phases

### Phase 1: Core Foundation (Week 1-2)
- [ ] Setup React project with TypeScript
- [ ] Implement authentication gate
- [ ] Create basic file tree component
- [ ] Setup Monaco editor integration
- [ ] Basic CRUD operations

### Phase 2: Enhanced Features (Week 3-4)
- [ ] Multi-tab support
- [ ] Drag-and-drop functionality
- [ ] Search and filter
- [ ] Context menus
- [ ] Keyboard shortcuts

### Phase 3: Synchronization (Week 5)
- [ ] Queue management system
- [ ] Batch operations
- [ ] Conflict resolution
- [ ] Progress indicators
- [ ] Error handling

### Phase 4: Polish & Security (Week 6)
- [ ] Responsive design
- [ ] Theme customization
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing & debugging

### Phase 5: Extensions (Future)
- [ ] Plugin system
- [ ] Additional tools
- [ ] Advanced features
- [ ] Mobile app consideration

## Performance Considerations

### Optimization Strategies
- Virtual scrolling for large file lists
- Lazy loading of file contents
- Code splitting for editor components
- Service worker for offline capability
- IndexedDB for local caching

### Benchmarks
- File tree: Handle 10,000+ files
- Editor: Open 20+ tabs simultaneously
- Upload: 100MB+ file support
- Search: < 100ms for 1000 files

## Testing Strategy

### Unit Testing
- Component logic
- State management
- Utility functions
- API integration

### Integration Testing
- File operations workflow
- Authentication flow
- Synchronization process
- Error scenarios

### E2E Testing
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance testing

## Deployment Considerations

### Hosting Options
- **Static hosting**: Vercel, Netlify
- **VPS**: DigitalOcean, Linode
- **Container**: Docker deployment
- **CDN**: CloudFlare integration

### Environment Variables
```env
REACT_APP_API_URL=https://api.yoursite.com
REACT_APP_ENCRYPTION_KEY=your-secret-key
REACT_APP_SESSION_TIMEOUT=1800
REACT_APP_MAX_FILE_SIZE=104857600
```

## Success Metrics

- **Performance**: Page load < 2s, operation response < 500ms
- **Reliability**: 99.9% uptime, zero data loss
- **Usability**: Intuitive interface, minimal learning curve
- **Security**: No unauthorized access, encrypted data
- **Extensibility**: Easy plugin integration, modular architecture

## Risk Mitigation

### Technical Risks
- **Large file handling**: Streaming uploads, chunking
- **Browser limitations**: Fallback mechanisms
- **Network issues**: Offline mode, retry logic

### Security Risks
- **XSS attacks**: Content sanitization
- **CSRF**: Token validation
- **Data exposure**: Encryption at rest

### Operational Risks
- **Data loss**: Regular backups, versioning
- **Sync conflicts**: Clear resolution UI
- **Performance degradation**: Monitoring, optimization

## Conclusion

This portal will provide a robust, secure, and extensible file management solution that matches and exceeds Neocities functionality while maintaining simplicity and ease of use. The modular architecture ensures future expansion possibilities while the React foundation provides a modern, responsive user experience.
