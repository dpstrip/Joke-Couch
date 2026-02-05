// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: adapting CouchDB operations

import { IDatabaseAdapter } from '../interfaces/IDatabaseAdapter';

// SOLID: Dependency Inversion Principle (DIP)
// Concrete implementation of the abstraction
export class CouchDBAdapter implements IDatabaseAdapter {
  constructor(private db: any) {}

  async get(id: string): Promise<any> {
    return this.db.get(id);
  }

  async insert(doc: any): Promise<any> {
    return this.db.insert(doc);
  }

  async list(options?: any): Promise<any> {
    return this.db.list(options);
  }
}
