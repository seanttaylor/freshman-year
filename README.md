## api-freshman-yr



## Local Development

1). Do `docker-compose up` The application will likely fail on the first attempt to initialize becasue it takes several seconds for the MySQL database container to spin up. As a result the `data_service` container that relies on the database will not load the API endpoints . 
2). When the logs indicate that the database is ready for incoming connections, do `docker-restart` on the `data_service` container. This flow is only required on the first startup. Subsequently you can just do `docker-compose up` once to set up the project.

## Notes
