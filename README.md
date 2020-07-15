## api-freshman-yr



## Local Development

1). Do `docker-compose up` The application will likely fail on the first attempt becasue it takes several seconds for the database container to spin up. 
2). When the logs indicate that the database is ready for incoming connections do `docker-compose down` follow-by another `docker-compose up`. This is flow is only required on the first startup. Subsequently you can just do `docker-compose up` once to set up the project.

* Instead of `docker-compose down` and then `docker-compose up` you can also just manually restart the `data_service` container with `docker restart` to bootstrap the project.

## Notes
