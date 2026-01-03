Joke CouchDB
=============

This image runs Apache CouchDB pre-seeded with a `jokes` database containing a couple of sample jokes. Use this image to run the backend for the Joke-Couch app without having to seed the database yourself.

Image name (example):

  dpstrip/joke-couch-couchdb:latest

Replace DOCKERHUB_USERNAME with your Docker Hub username.

How it works
------------
- Based on the official `couchdb:3.3.1` image.
- On first start the container sets up the admin user from env vars `COUCHDB_USER` and `COUCHDB_PASSWORD` (defaults to `admin` / `password`).
- The image runs an init script that waits for CouchDB, creates the `jokes` database if missing, and inserts documents from `/jokes.json` using the `_bulk_docs` API.

Run locally
-----------
Run with default credentials (admin/password):

```bash
docker run -d --name joke-couch-db -p 5984:5984 dpstrip/joke-couch-couchdb:latest
```

Run with custom credentials (recommended):

```bash
docker run -d --name joke-couch-db -p 5984:5984 \
  -e COUCHDB_USER=myadmin -e COUCHDB_PASSWORD="s3cr3t" \
  dpstrip/joke-couch-couchdb:latest
```

Verify the jokes were inserted:

```bash
curl -u admin:password http://localhost:5984/jokes/_all_docs?include_docs=true | jq
```

Using with the Joke-Couch app
----------------------------
Set the following environment variables for the app so it can connect to this CouchDB instance:

- COUCH_HOST (default: localhost)
- COUCH_PORT (default: 5984)
- COUCH_USER (example: admin)
- COUCH_PASSWORD (example: password)

Example with docker-compose
---------------------------
Create a `docker-compose.yml` stanza similar to:

```yaml
services:
  couchdb:
    image: DOCKERHUB_USERNAME/joke-couch-couchdb:latest
    ports:
      - 5984:5984
    environment:
      COUCHDB_USER: admin
      COUCHDB_PASSWORD: password
```

Publishing to Docker Hub
------------------------
Locally build, tag and push (replace DOCKERHUB_USERNAME):

```bash
# build
docker build -t dpstrip/joke-couch-couchdb:latest ./docker/couchdb
# login
docker login -u DOCKERHUB_USERNAME
# push
docker push dpstrip/joke-couch-couchdb:latest
```

Automated publish (GitHub Actions)
----------------------------------
You can create a GitHub Actions workflow that builds and pushes the image automatically when you push a release tag. Provide your Docker Hub username and token as repository secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.

Support / Troubleshooting
-------------------------
- If the database isn't seeded, check container logs:

```bash
docker logs -f joke-couch-db
```

- If CouchDB fails to start because of admin setup, set `COUCHDB_USER` and `COUCHDB_PASSWORD` explicitly when running the container.
