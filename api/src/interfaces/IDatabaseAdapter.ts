// SOLID: Interface Segregation Principle (ISP)
// Small, focused interface for database operations
// SOLID: Dependency Inversion Principle (DIP)
// High-level modules depend on abstractions, not concrete implementations

export interface IDatabaseAdapter {
  get(id: string): Promise<any>;
  insert(doc: any): Promise<any>;
  list(options?: any): Promise<any>;
}
