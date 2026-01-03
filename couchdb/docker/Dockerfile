FROM couchdb:3.3.1

# Default admin credentials (change at run-time with -e COUCHDB_USER/COUCHDB_PASSWORD)
ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=password

# Copy seed data and initializer
COPY ./jokes.json /jokes.json
COPY ./init.sh /init.sh
RUN chmod +x /init.sh

# Use our init script as the container CMD; it will start couchdb and seed the DB
CMD ["/init.sh"]
