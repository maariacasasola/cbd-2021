const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");
const NodeCouchdb = require("node-couchdb");

app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/views/index.html');
});

app.listen(3000, function () {
  console.log("Server is started on Port 3000");
});

const couch = new NodeCouchdb({
  auth: {
    user: "admin",
    password: "cbd",
  },
});

couch.listDatabases().then(function (dbs) {
  console.log(dbs);
});

// Crear bd
couch.createDatabase("cbd").then(
  () => {
    console.log("gola");
  },
  (err) => {
    // request error occured
  }
);

// Borrar base de datos
couch.dropDatabase("cbd").then(
  () => {
    console.log("gola");
  },
  (err) => {
    // request error occured
  }
);

couch.get("cbd", "some_document_id").then(
  ({ data, headers, status }) => {
    // data is json response
    // headers is an object with all response headers
    // status is statusCode number
  },
  (err) => {
    // either request error occured
    // ...or err.code=EDOCMISSING if document is missing
    // ...or err.code=EUNKNOWN if statusCode is unexpected
  }
);
