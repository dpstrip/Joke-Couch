# SOLID Architecture Diagrams

## API Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Express Server                           │
│                        (server.ts - SRP)                         │
│                   Composition Root (DIP)                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ├──────────────────────────────────────┐
                            │                                      │
                            ▼                                      ▼
              ┌──────────────────────────┐         ┌──────────────────────────┐
              │   JokeController (SRP)   │         │   Health Check           │
              │  HTTP Request/Response   │         │    Endpoint              │
              └──────────┬───────────────┘         └──────────────────────────┘
                         │
                         │ depends on (DIP)
                         │
                         ▼
              ┌──────────────────────────┐
              │   JokeService (SRP)      │
              │    Business Logic        │
              │    + Validation          │
              └──────────┬───────────────┘
                         │
                         │ depends on IJokeRepository (DIP)
                         │
                         ▼
              ┌──────────────────────────┐
              │  JokeRepository (SRP)    │
              │  implements              │
              │  IJokeRepository (LSP)   │
              │  Data Access Logic       │
              └──────────┬───────────────┘
                         │
                         │ depends on IDatabaseAdapter (DIP)
                         │
                         ▼
              ┌──────────────────────────┐
              │  CouchDBAdapter (SRP)    │
              │  implements              │
              │  IDatabaseAdapter (LSP)  │
              │  Database Operations     │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │      CouchDB             │
              │    (External Service)    │
              └──────────────────────────┘
```

## Web Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Page Components                          │
│                  (Home, EditJoke - SRP, OCP)                    │
│                  UI Orchestration Only                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ uses
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  UI Components (SRP)     │  │   Custom Hooks (SRP)     │
│  - JokeList              │  │   - useJokes             │
│  - RandomJoke            │  │   - useJoke              │
│  - AddJokeForm           │  │   - useRandomJoke        │
│  - JokeCard              │  │                          │
│  Rendering Only          │  │  State Management        │
└────────────┬─────────────┘  └──────────┬───────────────┘
             │                           │
             │                           │ depends on
             │                           │
             └───────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │      Services (ISP)      │
              │  ┌────────────────────┐  │
              │  │ JokeReadService    │  │ implements IJokeReadService
              │  │ (Read Operations)  │  │
              │  └────────────────────┘  │
              │  ┌────────────────────┐  │
              │  │ JokeWriteService   │  │ implements IJokeWriteService
              │  │ (Write Operations) │  │
              │  └────────────────────┘  │
              └──────────┬───────────────┘
                         │
                         │ depends on IHttpClient (DIP)
                         │
                         ▼
              ┌──────────────────────────┐
              │   HttpClient (SRP)       │
              │   implements             │
              │   IHttpClient (LSP)      │
              │   HTTP Operations        │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Next.js API Routes      │
              │  (Proxy to Backend)      │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │   Backend API Server     │
              │   (Express)              │
              └──────────────────────────┘
```

## SOLID Principles in Action

### Single Responsibility Principle (SRP)
```
Each box in the diagrams above has ONE responsibility:
- Controllers: Handle HTTP
- Services: Business Logic
- Repositories: Data Access
- Adapters: Database Operations
- Components: UI Rendering
- Hooks: State Management
```

### Open/Closed Principle (OCP)
```
Can extend by:
✓ Adding new service methods
✓ Adding new endpoints
✓ Adding new components
✓ Changing configuration

Without modifying existing code!
```

### Liskov Substitution Principle (LSP)
```
Interfaces can be substituted:
- IDatabaseAdapter → CouchDBAdapter | MockDBAdapter | PostgresAdapter
- IJokeRepository → JokeRepository | MockJokeRepository
- IHttpClient → HttpClient | MockHttpClient
```

### Interface Segregation Principle (ISP)
```
Separated interfaces by concern:
- IJokeReadService (read operations only)
- IJokeWriteService (write operations only)
- IHealthCheckService (health checks only)

Clients depend only on what they need!
```

### Dependency Inversion Principle (DIP)
```
High-level → Abstractions ← Low-level

JokeService → IJokeRepository ← JokeRepository
JokeRepository → IDatabaseAdapter ← CouchDBAdapter
Component → useJoke hook → JokeReadService → IHttpClient ← HttpClient

Dependencies point to abstractions, not concretions!
```

## Benefits Summary

### Before Refactoring ❌
- Mixed concerns in single files
- Tight coupling to CouchDB
- Hard to test
- Change in one place affects many others
- Difficult to extend

### After Refactoring ✅
- Clear separation of concerns
- Loosely coupled through interfaces
- Easy to test (inject mocks)
- Changes isolated to single layer
- Easy to extend with new features

## Testing Strategy Enabled by SOLID

```
Unit Tests:
├── Services
│   └── Test with mock repositories
├── Repositories  
│   └── Test with mock adapters
├── Controllers
│   └── Test with mock services
└── Components
    └── Test with mock hooks

Integration Tests:
├── API Routes
│   └── Test full request/response cycle
└── End-to-End
    └── Test complete user flows
```
