# SOLID Principles - Testing Examples

This document demonstrates how the SOLID refactoring enables easy testing with examples.

## API Testing Examples

### Testing JokeService with Mock Repository

```typescript
// Mock implementation for testing (LSP - Liskov Substitution Principle)
class MockJokeRepository implements IJokeRepository {
  private jokes: Joke[] = [
    { _id: '1', setup: 'Test setup', punchline: 'Test punchline' }
  ];

  async findAll(): Promise<Joke[]> {
    return this.jokes;
  }

  async findById(id: string): Promise<Joke | null> {
    return this.jokes.find(j => j._id === id) || null;
  }

  async findRandom(): Promise<Joke | null> {
    return this.jokes[0];
  }

  async create(joke: Omit<Joke, '_id' | '_rev'>): Promise<{ id: string; rev: string }> {
    const newJoke = { _id: '2', ...joke };
    this.jokes.push(newJoke);
    return { id: '2', rev: '1-abc' };
  }

  async update(id: string, joke: Partial<Joke>): Promise<{ ok: boolean; id: string; rev: string }> {
    const index = this.jokes.findIndex(j => j._id === id);
    if (index === -1) throw new Error('Joke not found');
    this.jokes[index] = { ...this.jokes[index], ...joke };
    return { ok: true, id, rev: '2-def' };
  }
}

// Test the service (DIP - depends on abstraction)
describe('JokeService', () => {
  let jokeService: JokeService;
  let mockRepository: MockJokeRepository;

  beforeEach(() => {
    mockRepository = new MockJokeRepository();
    jokeService = new JokeService(mockRepository); // Dependency injection!
  });

  test('getAllJokes returns all jokes', async () => {
    const jokes = await jokeService.getAllJokes();
    expect(jokes).toHaveLength(1);
    expect(jokes[0].setup).toBe('Test setup');
  });

  test('createJoke validates input', async () => {
    await expect(
      jokeService.createJoke({ setup: '', punchline: 'test' })
    ).rejects.toThrow('Setup and punchline are required');
  });

  test('createJoke adds timestamp', async () => {
    const result = await jokeService.createJoke({
      setup: 'Why?',
      punchline: 'Because!'
    });
    expect(result.id).toBe('2');
  });
});
```

### Testing JokeController with Mock Service

```typescript
// Mock service for testing controllers
class MockJokeService {
  async getAllJokes(): Promise<Joke[]> {
    return [{ _id: '1', setup: 'Test', punchline: 'Ha!' }];
  }

  async getJokeById(id: string): Promise<Joke | null> {
    if (id === '1') {
      return { _id: '1', setup: 'Test', punchline: 'Ha!' };
    }
    return null;
  }

  async getRandomJoke(): Promise<Joke | null> {
    return { _id: '1', setup: 'Test', punchline: 'Ha!' };
  }

  async createJoke(joke: any): Promise<{ id: string; rev: string }> {
    return { id: '2', rev: '1-abc' };
  }

  async updateJoke(id: string, joke: any): Promise<{ ok: boolean; id: string; rev: string }> {
    if (id === '999') throw new Error('Joke not found');
    return { ok: true, id, rev: '2-def' };
  }
}

describe('JokeController', () => {
  let jokeController: JokeController;
  let mockService: MockJokeService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    mockService = new MockJokeService();
    jokeController = new JokeController(mockService as any);
    
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    
    mockReq = { params: {}, body: {} };
    mockRes = { json: jsonSpy, status: statusSpy };
  });

  test('getAllJokes returns jokes array', async () => {
    await jokeController.getAllJokes(mockReq as Request, mockRes as Response);
    expect(jsonSpy).toHaveBeenCalledWith([
      { _id: '1', setup: 'Test', punchline: 'Ha!' }
    ]);
  });

  test('getJokeById returns 404 when not found', async () => {
    mockReq.params = { id: '999' };
    await jokeController.getJokeById(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(404);
  });

  test('createJoke returns 201 status', async () => {
    mockReq.body = { setup: 'Why?', punchline: 'Because!' };
    await jokeController.createJoke(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(201);
  });
});
```

## Web Testing Examples

### Testing Components with Mock Hooks

```typescript
// Mock the custom hook (SRP - hooks handle state separately)
jest.mock('@/hooks/useJokes', () => ({
  useJokes: jest.fn()
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { JokeList } from '@/components/JokeList';
import { useJokes } from '@/hooks/useJokes';

describe('JokeList Component', () => {
  test('displays loading state', () => {
    (useJokes as jest.Mock).mockReturnValue({
      jokes: [],
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    render(<JokeList />);
    expect(screen.getByText('Loading jokes...')).toBeInTheDocument();
  });

  test('displays error state with retry button', () => {
    const mockRefetch = jest.fn();
    (useJokes as jest.Mock).mockReturnValue({
      jokes: [],
      loading: false,
      error: 'Failed to fetch jokes',
      refetch: mockRefetch
    });

    render(<JokeList />);
    expect(screen.getByText(/Failed to fetch jokes/)).toBeInTheDocument();
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    expect(mockRefetch).toHaveBeenCalled();
  });

  test('displays jokes when loaded', () => {
    (useJokes as jest.Mock).mockReturnValue({
      jokes: [
        { _id: '1', setup: 'Why did the chicken cross the road?', punchline: 'To get to the other side!' }
      ],
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    render(<JokeList />);
    expect(screen.getByText('All Jokes (1)')).toBeInTheDocument();
    expect(screen.getByText(/Why did the chicken/)).toBeInTheDocument();
  });
});
```

### Testing Services with Mock HttpClient

```typescript
// Mock HTTP client (DIP - service depends on abstraction)
class MockHttpClient implements IHttpClient {
  private mockData: any;

  setMockResponse(data: any) {
    this.mockData = data;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.mockData as T;
  }
}

describe('JokeReadService', () => {
  let mockHttpClient: MockHttpClient;
  let jokeReadService: JokeReadService;

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    jokeReadService = new JokeReadService(mockHttpClient);
  });

  test('getJokes calls correct endpoint', async () => {
    const mockJokes = [
      { _id: '1', setup: 'Test', punchline: 'Ha!' }
    ];
    mockHttpClient.setMockResponse(mockJokes);

    const jokes = await jokeReadService.getJokes();
    expect(jokes).toEqual(mockJokes);
  });

  test('getRandomJoke returns a joke', async () => {
    const mockJoke = { _id: '1', setup: 'Test', punchline: 'Ha!' };
    mockHttpClient.setMockResponse(mockJoke);

    const joke = await jokeReadService.getRandomJoke();
    expect(joke).toEqual(mockJoke);
  });

  test('getJoke retrieves by id', async () => {
    const mockJoke = { _id: '1', setup: 'Test', punchline: 'Ha!' };
    mockHttpClient.setMockResponse(mockJoke);

    const joke = await jokeReadService.getJoke('1');
    expect(joke._id).toBe('1');
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useJokes } from '@/hooks/useJokes';
import { jokeReadService } from '@/services';

// Mock the service (ISP - hook depends on specific service interface)
jest.mock('@/services', () => ({
  jokeReadService: {
    getJokes: jest.fn()
  }
}));

describe('useJokes Hook', () => {
  test('fetches jokes on mount', async () => {
    const mockJokes = [
      { _id: '1', setup: 'Test', punchline: 'Ha!' }
    ];
    (jokeReadService.getJokes as jest.Mock).mockResolvedValue(mockJokes);

    const { result } = renderHook(() => useJokes());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.jokes).toEqual(mockJokes);
    expect(result.current.error).toBeNull();
  });

  test('handles error state', async () => {
    (jokeReadService.getJokes as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useJokes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch jokes. Please try again.');
    expect(result.current.jokes).toEqual([]);
  });

  test('refetch reloads jokes', async () => {
    const mockJokes = [{ _id: '1', setup: 'Test', punchline: 'Ha!' }];
    (jokeReadService.getJokes as jest.Mock).mockResolvedValue(mockJokes);

    const { result } = renderHook(() => useJokes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    await result.current.refetch();

    expect(jokeReadService.getJokes).toHaveBeenCalledTimes(2);
  });
});
```

## Integration Testing

### API Integration Test

```typescript
describe('Joke API Integration', () => {
  let app: express.Application;
  let mockDb: any;

  beforeAll(async () => {
    // Create mock database
    mockDb = {
      get: jest.fn(),
      insert: jest.fn(),
      list: jest.fn()
    };

    // Build the app with mock dependencies (DIP in action!)
    const dbAdapter = new CouchDBAdapter(mockDb);
    const jokeRepository = new JokeRepository(dbAdapter);
    const jokeService = new JokeService(jokeRepository);
    const jokeController = new JokeController(jokeService);

    app = express();
    app.use(express.json());
    setupRoutes(app, jokeController);
  });

  test('GET /jokes returns all jokes', async () => {
    mockDb.list.mockResolvedValue({
      rows: [
        { doc: { _id: '1', setup: 'Test', punchline: 'Ha!' } }
      ]
    });

    const response = await request(app).get('/jokes');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].setup).toBe('Test');
  });

  test('POST /jokes creates a joke', async () => {
    mockDb.insert.mockResolvedValue({ id: '2', rev: '1-abc' });

    const response = await request(app)
      .post('/jokes')
      .send({ setup: 'Why?', punchline: 'Because!' });
    
    expect(response.status).toBe(201);
    expect(response.body.id).toBe('2');
  });
});
```

## Benefits of SOLID for Testing

### 1. **Easy Mocking** (DIP)
- All dependencies are interfaces
- Can inject mock implementations
- No need to mock complex external systems

### 2. **Isolated Testing** (SRP)
- Each unit has one responsibility
- Tests are focused and fast
- Changes don't affect unrelated tests

### 3. **Flexible Test Doubles** (LSP)
- Can substitute any implementation of an interface
- Use mocks, stubs, spies, or fakes as needed
- Real and test implementations are interchangeable

### 4. **Targeted Testing** (ISP)
- Test only what's needed
- Smaller interfaces mean simpler mocks
- Less setup code in tests

### 5. **Extensible Tests** (OCP)
- Add new test cases without changing existing ones
- Extend mock implementations easily
- Tests evolve with the code

---

## Test Coverage Goals

With the SOLID architecture, aim for:
- **Unit Tests**: 80%+ coverage
  - All services
  - All repositories
  - All controllers
  - All components
  - All custom hooks

- **Integration Tests**: Key user flows
  - CRUD operations
  - Error handling
  - Authentication (if added)

- **E2E Tests**: Critical paths
  - Create and view jokes
  - Edit existing jokes
  - Error scenarios

The SOLID architecture makes achieving these goals practical and maintainable!
