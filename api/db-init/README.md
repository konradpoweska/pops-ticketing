## Initialisation of Mongo database

Use the `init-db.js` script to initialise your MongoDB database. It adds validators to ensure security of added data.

Works whether the database already exists or not (doesn't remove your data by default).

```sh
node api/db-init/init-db
```

Options useful for development:
  - `--drop`: drops the database first (be careful)
  - `--sample-data`: inserts sample data.

