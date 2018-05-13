# API for teacher/student system

The following instructions is to set up the server locally
#### 1. Run npm install to install all dependencies
```
npm install
```

#### 2. Run knex migrate to set up database tables
```
knex migrate:latest
```

#### 3. Run npm start to start the server on port 3000
```
npm start
```

#### 4. Run npm test to run the unit tests
```
npm test
```

#### Description of files:

- src/index.js : Starts the app http server on port 3000.
- src/test/test.js: Unit tests
- process.env: Config file for database
- knexfile.js: Knex database connection configuration
