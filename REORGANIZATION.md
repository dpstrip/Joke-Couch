# Reorganization Notes

## Old Structure (to be removed)

The following directories and files are part of the old structure and should be deleted:

- `/docker/` - Replaced by `/couchdb/docker/` and service-specific Dockerfiles
- `/src/` - Replaced by `/api/src/`
- `/scripts/` - Replaced by `/couchdb/docker/wait-for-couchdb.sh`
- `/Dockerfile` (root) - Replaced by service-specific Dockerfiles in `/api/` and `/web/`
- `/package.json` (root) - Replaced by `/api/package.json`
- `/tsconfig.json` (root) - Replaced by `/api/tsconfig.json`
- `/dist/` - Build artifacts (should be gitignored)
- `/node_modules/` - Dependencies (should be gitignored)

## New Structure

```
Joke-Couch/
├── couchdb/
│   └── docker/          # CouchDB Docker configs, seed data, scripts
├── api/
│   ├── src/             # API source code
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
└── web/
    ├── src/             # Web frontend (placeholder)
    └── Dockerfile
```

## Action Required

To complete the reorganization, run:

```bash
# Remove old directories
rm -rf docker/ src/ scripts/ Dockerfile package.json tsconfig.json dist/ node_modules/

# Or if you want to be cautious, move them to a backup first:
mkdir ../old-structure-backup
mv docker/ src/ scripts/ Dockerfile package.json tsconfig.json dist/ node_modules/ ../old-structure-backup/
```

Note: The old files are still present to allow for comparison and testing before final removal.
