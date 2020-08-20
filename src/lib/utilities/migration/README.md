## Utilities/migration

Tool designed to facilitate db migrations from the command line via NPM scripts.

### Notes

* The `db-migrate` package uses `process.argv` in surprising and unpredictable ways when initialized from inside an NPM script. Attempts to unify the database migration tool logic into one file (the preferred) approach wasted much time. We settled on separating calls to the `db-migrate` package into distinct files as a compromise.

