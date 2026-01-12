# Joke-Couch — TypeScript + CouchDB starter

This repository provides a minimal TypeScript API that uses CouchDB as its datastore. The project is organized as a monorepo with separate directories for each service.

## Project Structure

```
Joke-Couch/
│
├── couchdb/
│   └── docker/          # CouchDB configs, seed data, and scripts
│       ├── Dockerfile
│       ├── init.sh
│       ├── jokes.json
│       ├── wait-for-couchdb.sh
│       └── DockerHub-README.md
│
├── api/
│   ├── src/             # API source code
│   │   ├── server.ts    # Express server with endpoints
│   │   ├── db.ts        # CouchDB helper
│   │   ├── index.ts     # Sample data insertion script
│   │   ├── openapi.json # OpenAPI/Swagger spec
│   │   └── types/       # TypeScript type definitions
│   ├── Dockerfile       # API Docker build
│   ├── package.json
│   └── tsconfig.json
│
├── web/
│   ├── src/             # Frontend source (to be implemented)
│   └── Dockerfile       # Web frontend Docker build
│
├── docker-compose.yml   # Orchestrates all services
└── README.md           # This file
```

## Files and what they do (quick reference)

- **`couchdb/docker/`** — CouchDB seed image configuration:
	- `Dockerfile` — Custom CouchDB image with seed data
	- `init.sh` — Initialization script that seeds the database
	- `jokes.json` — Sample jokes data
	- `wait-for-couchdb.sh` — Script to wait for CouchDB to be ready
	- `DockerHub-README.md` — Documentation for the Docker Hub image

- **`api/`** — TypeScript API service:
	- `src/server.ts` — Express server with endpoints (`/health`, `/jokes`, `/jokes/:id`, `POST /jokes`)
	- `src/db.ts` — CouchDB helper (initializes/creates the `jokes` DB using `nano`)
	- `src/index.ts` — Script that inserts a sample joke document
	- `package.json`, `tsconfig.json` — TypeScript project config
	- `Dockerfile` — Multi-stage build for production API image

- **`web/`** — Web frontend (placeholder for future implementation)

- **`docker-compose.yml`** — Orchestrates CouchDB, API, and web services

## Quick start

**Option 1: Using Docker Compose (recommended)**

Start all services (CouchDB and API):

```bash
docker compose up -d
```

This will start:
- CouchDB on port 5984 (seeded with sample jokes)
- API on port 3000 with Swagger UI at http://localhost:3000/docs

CouchDB web UI (Fauxton) will be at: http://localhost:5984/_utils/

**Option 2: Run API locally for development**

1. Copy `.env.example` to `.env` and edit credentials if you want:

	```bash
	cp .env.example .env
	# edit .env to change credentials if desired
	```

2. Start CouchDB with Docker Compose:

	```bash
	docker compose up couchdb -d
	```

3. Install dependencies and run the API in development mode:

	```bash
	cd api
	npm install
	npm run dev
	```

	The API will connect to CouchDB and be available at http://localhost:3000

4. Build and run production bundle:

	```bash
	cd api
	npm run build
	npm start
	```

**Option 3: Run with prebuilt Docker Hub images**

If you have already pulled `dpstrip/joke-couch-* :1.4` images into Docker Desktop (or another host):

	```bash
	# from the repo root
	docker pull dpstrip/joke-couch-db:1.4
	docker pull dpstrip/joke-couch-api:1.4
	docker pull dpstrip/joke-couch-web:1.4

	# launch the stack using the image-based compose file
	docker compose -f docker-compose.images.yml up -d
	```

This uses [docker-compose.images.yml](docker-compose.images.yml), which references the prebuilt images rather than rebuilding from source. After the stack starts:

- CouchDB Fauxton: http://localhost:5984/_utils/
- API + Swagger UI: http://localhost:3000/docs
- Web UI: http://localhost:8080

## Dev Container / Codespaces

If you open this repository in a Codespace or in VS Code using the Dev Containers extension, the devcontainer is configured to start CouchDB automatically.

- The file `.devcontainer/devcontainer.json` runs `npm install` in the API directory after creation and then runs `docker compose up -d` after the container starts.
- Ports forwarded from the dev container: `5984` (CouchDB), `3000` (API), and `8080` (Web).

**Accessing the application in Codespaces:**

1. Start the application: `docker compose up -d`
2. Open the **Ports** panel in VS Code (bottom panel, next to Terminal)
3. Find port **8080** (web) and right-click it
4. Select **Port Visibility** → **Public**
5. Click the globe icon or copy the forwarded URL to access the web app
6. The URL will be in the format: `https://<codespace-name>-8080.app.github.dev`

Alternatively, use the Simple Browser within VS Code:
- Press `Ctrl+Shift+P` → "Simple Browser: Show"
- Enter `http://localhost:8080`

## Manual commands

```bash
# Start all services
docker compose up -d

# Start only CouchDB
docker compose up couchdb -d

# Follow CouchDB logs
docker compose logs -f couchdb

# Follow API logs
docker compose logs -f api

# Stop and remove all services
docker compose down

# Rebuild services after code changes
docker compose up --build
```

## Notes

- Default credentials in `.env.example` are `admin` / `password` — change these before exposing to any network.
- The `nano` client expects the URL to include credentials; you can also set `COUCH_URL` directly.
- The new structure separates concerns: CouchDB configuration, API code, and web frontend are in their own directories.

## API Endpoints

Once running, the API provides the following endpoints:

- `GET /health` — Health check
- `GET /jokes` — List all jokes
- `GET /jokes/random` — Get a random joke
- `GET /jokes/:id` — Get a specific joke by ID
- `POST /jokes` — Create a new joke
- `GET /docs` — Swagger UI documentation

Using the CouchDB Explorer VS Code extension

If you'd like to connect with the CouchDB Explorer extension, here's how to add a connection depending on where the extension runs:

- Extension running on your local machine (Compose started on host):
	- Protocol: HTTP
	- Host: localhost
	- Port: 5984
	- Username: admin
	- Password: password
	- Full URL (optional): http://admin:password@localhost:5984/

- Extension running inside the Codespace / devcontainer:
	- Protocol: HTTP
	- Host: couchdb
	- Port: 5984
	- Username: admin
	- Password: password
	- Full URL (optional): http://admin:password@couchdb:5984/

Steps in the extension UI:
1. Open the CouchDB Explorer extension panel.
2. Click "Add Connection" (or the + button).
3. Fill the fields above for the environment you're using.
4. Save and expand the new connection to see databases (or open Fauxton at http://localhost:5984/_utils/).

Troubleshooting tips
- If the extension can't connect, verify the container is running and healthy with `docker compose ps` and `docker compose logs -f couchdb`.
- If you started CouchDB previously without admin credentials and changed `.env` later, recreate the data volume with `docker compose down -v` then `docker compose up -d` so CouchDB initializes with the admin credentials from `.env`.


# Joke-Couch