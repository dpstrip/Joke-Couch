# Joke Couch Web Frontend

A Next.js React application that provides a web interface for the Joke Couch API.

## Features

- 🎲 **Random Joke**: Get a random joke from the collection
- 📋 **All Jokes**: Browse through all jokes in the database  
- ➕ **Add Joke**: Submit new jokes to the collection
- 🎨 **Responsive Design**: Built with Tailwind CSS for mobile-first design

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Docker** - Containerization

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Running Locally

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Integration

The application connects to the Joke Couch API through:
- Development: `http://localhost:3000` (API server)
- Production: `http://api:3000` (Docker service name)

### Building for Production

```bash
npm run build
npm start
```

## Docker

### Building the Image

```bash
docker build -t joke-couch-web .
```

### Running with Docker Compose

The web application is configured to run as part of the docker-compose setup in the root directory.

```bash
# From project root
docker-compose up web
```

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── JokeCard.tsx     # Individual joke display
│   │   ├── JokeList.tsx     # List all jokes
│   │   ├── RandomJoke.tsx   # Random joke component
│   │   └── AddJokeForm.tsx  # Form to add jokes
│   ├── lib/                 # Utilities and API client
│   │   └── api.ts          # API client
│   └── types/              # TypeScript type definitions
│       └── joke.ts         # Joke-related types
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS config
└── Dockerfile           # Docker build instructions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint