// SOLID: Single Responsibility Principle (SRP)
// This file's responsibility is to configure and start the Express server
// Business logic is delegated to services, data access to repositories

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db';
import swaggerUi from 'swagger-ui-express';
import openapi from './openapi.json';
import { CouchDBAdapter } from './adapters/CouchDBAdapter';
import { JokeRepository } from './repositories/JokeRepository';
import { JokeService } from './services/JokeService';
import { JokeController } from './controllers/JokeController';

dotenv.config();

// SOLID: Dependency Inversion Principle (DIP)
// We build dependencies from abstractions, injecting them from the composition root
async function createDependencies() {
  const db = await initDB('jokes');
  const dbAdapter = new CouchDBAdapter(db);
  const jokeRepository = new JokeRepository(dbAdapter);
  const jokeService = new JokeService(jokeRepository);
  const jokeController = new JokeController(jokeService);
  
  return { jokeController };
}

// SOLID: Open/Closed Principle (OCP)
// The application can be extended with new routes/controllers without modifying existing logic
function setupRoutes(app: express.Application, jokeController: JokeController) {
  // Health check
  app.get('/health', (req, res) => jokeController.healthCheck(req, res));
  
  // Joke routes
  app.get('/jokes', (req, res) => jokeController.getAllJokes(req, res));
  app.get('/jokes/random', (req, res) => jokeController.getRandomJoke(req, res));
  app.get('/jokes/:id', (req, res) => jokeController.getJokeById(req, res));
  app.post('/jokes', (req, res) => jokeController.createJoke(req, res));
  app.put('/jokes/:id', (req, res) => jokeController.updateJoke(req, res));
}

async function start() {
  try {
    const app = express();
    const port = Number(process.env.PORT || 3000);
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    
    // API documentation
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi as any));
    app.get('/', (_req, res) => res.redirect('/docs'));
    
    // SOLID: Dependency Inversion Principle (DIP)
    // Dependencies are created and injected here (composition root)
    const { jokeController } = await createDependencies();
    
    // Setup routes
    setupRoutes(app, jokeController);
    
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
}

start();
