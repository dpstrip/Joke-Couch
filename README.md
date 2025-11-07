# Joke-Couch — TypeScript + CouchDB starter

This repository provides a minimal TypeScript API that uses CouchDB as its datastore. Below is a short reference describing what the important files and folders are and what they do so you can find things quickly.

Files and what they do (quick reference)
---------------------------------------

- `package.json` — npm scripts and dependencies (build, dev, start).
- `tsconfig.json` — TypeScript compiler configuration.
- `src/` — application source code:
	- `src/server.ts` — Express server with endpoints (`/health`, `/jokes`, `/jokes/:id`, `POST /jokes`).
	- `src/db.ts` — CouchDB helper (initializes/creates the `jokes` DB using `nano`).
	- `src/index.ts` — one-off script that inserts a sample joke document.
- `docker/` — Docker builds and compose helpers:
	- `docker/couchdb/` — CouchDB seed image (Dockerfile, `init.sh`, `jokes.json`, Docker Hub README).
	- `docker/api/` — API build Dockerfile (multi-stage) for the production API image.
	- `docker/compose/pull-compose.yml` — a simple compose file that pulls the prebuilt images from Docker Hub (replace `dpstrip` with your Docker Hub username if needed).
- `.github/workflows/docker-publish.yml` — GitHub Actions workflow that can build and push the CouchDB image when you push a tag (set secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`).

I also added prebuilt Docker images to Docker Hub for convenience (pushed under `dpstrip`): a seeded CouchDB image and a production API image. See the Docker section further down for run commands.

What I added

- `docker-compose.yml` — starts a CouchDB container (binds port 5984).
- `package.json`, `tsconfig.json` — TypeScript project config and scripts.
- `src/index.ts` — small example app using `nano` to talk to CouchDB.
- `.env.example` — env vars for connection.
- `.devcontainer/devcontainer.json` — starts CouchDB automatically when opening the repository in a Codespace / dev container.

Quick start

1. Copy `.env.example` to `.env` and edit credentials if you want:

	```bash
	cp .env.example .env
	# edit .env to change credentials if desired
	```

2. Start CouchDB with Docker Compose (locally):

	```bash
	docker compose up -d
	```

	CouchDB web UI (Fauxton) will be at: http://localhost:5984/_utils/ (use the admin credentials from `.env`).

3. Install dependencies and run the app (locally):

	```bash
	npm install
	npm run dev
	```

	The app will connect to CouchDB, create the `jokes` database (if missing) and insert a sample document.

4. Build and run production bundle:

	```bash
	npm run build
	npm start
	```

Dev Container / Codespaces

If you open this repository in a Codespace or in VS Code using the Dev Containers extension, the devcontainer is configured to start CouchDB automatically.

- The file `.devcontainer/devcontainer.json` runs `npm install` after creation and then runs `docker compose up -d` after the container starts.
- Ports forwarded from the dev container: `5984` (CouchDB) and `3000` (app, reserved).

What happens when you open the Codespace

1. The dev container image and features are prepared (including Docker-in-Docker feature).
2. `postCreateCommand` runs `npm install`.
3. `postStartCommand` runs `docker compose up -d` and starts the `couchdb` service from `docker-compose.yml`.

Troubleshooting

- If the `docker-in-docker` feature cannot be installed or Docker is not available inside the container, `docker compose up -d` will fail. In that case you can run the command manually from the Codespace terminal (see next section).
- If CouchDB isn't ready yet, check logs with:

  ```bash
  docker compose logs -f couchdb
  ```

Manual commands (if the devcontainer hooks fail or you prefer to run locally)

```bash
# start services
docker compose up -d

# follow CouchDB logs
docker compose logs -f couchdb

# stop and remove
docker compose down
```

App in Docker Compose (optional)

Currently the repository starts only CouchDB. I can add a `Dockerfile` for the TypeScript app and add an `app` service to `docker-compose.yml` so `docker compose up -d` starts both the app and CouchDB together. Would you like me to add that? If yes, I will also wire the app to wait for CouchDB to be healthy before starting.

Notes

- Default credentials in `.env.example` are `admin` / `password` — change these before exposing to any network.
- The `nano` client expects the URL to include credentials; you can also set `COUCH_URL` directly.

Next steps (optional)

- Add a small Express REST API (I can implement this now).
- Add a `Dockerfile` + `app` service to `docker-compose.yml` so both run together.
- Add CI to run TypeScript build/test on push.

If you want any of the next steps, tell me which and I will implement them.

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