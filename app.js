const express = require('express');
const PORT = process.env.PORT || 3000;


let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// API routes
const api = require('./api/');
app.use("/api/", api);


// Serve UI content
if(process.env.NODE_ENV == "production" || process.argv.indexOf('--static') >= 0) {
  app.use(express.static('dist'));
}
else {
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler("src/index.html");
  app.use(bundler.middleware());
}


// Listen
app.listen(PORT, ()=>{
  console.log(`\rApp running on port ${PORT}.`);
});
