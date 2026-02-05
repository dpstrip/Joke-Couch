// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: handling HTTP requests/responses for jokes

import { Request, Response } from 'express';
import { JokeService } from '../services/JokeService';

// SOLID: Dependency Inversion Principle (DIP)
// Depends on JokeService abstraction
export class JokeController {
  constructor(private jokeService: JokeService) {}

  // SOLID: Open/Closed Principle (OCP)
  // Can add new endpoints without modifying existing ones
  
  async getAllJokes(req: Request, res: Response): Promise<void> {
    try {
      const jokes = await this.jokeService.getAllJokes();
      res.json(jokes);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch jokes', 
        details: String(error) 
      });
    }
  }

  async getJokeById(req: Request, res: Response): Promise<void> {
    try {
      const joke = await this.jokeService.getJokeById(req.params.id);
      if (!joke) {
        res.status(404).json({ error: 'Joke not found' });
        return;
      }
      res.json(joke);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch joke', 
        details: String(error) 
      });
    }
  }

  async getRandomJoke(req: Request, res: Response): Promise<void> {
    try {
      const joke = await this.jokeService.getRandomJoke();
      if (!joke) {
        res.status(404).json({ error: 'No jokes available' });
        return;
      }
      res.json(joke);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch random joke', 
        details: String(error) 
      });
    }
  }

  async createJoke(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.jokeService.createJoke(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to create joke', 
        details: String(error) 
      });
    }
  }

  async updateJoke(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.jokeService.updateJoke(req.params.id, req.body);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Joke not found') {
        res.status(404).json({ error: 'Joke not found' });
        return;
      }
      res.status(500).json({ 
        error: 'Failed to update joke', 
        details: String(error) 
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({ ok: true });
  }
}
