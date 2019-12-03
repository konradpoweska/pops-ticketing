# POPS1920 Ticketing system
Polytech Paris-Sud ET5 Informatique, Projet Génie Logiciel

## 1. Development
Install all dependencies:
```sh
npm install
```
```sh
node app.js # with client reloading
# OR
npm run build
nodemon app.js --static # with server reloading
```

### Building for production
Clear your `dist` folder.

Set the environment variable to `production`:
 - On bash: `export NODE_ENV=production`
 - On PowerShell: `$env:NODE_ENV='production'`

```sh
npm run build
```

## 2. Production

Set your environment variable to `production`, as explained above.

Install production dependencies only:
```sh
npm install
```

Then simply run:
```sh
node app.js
```
