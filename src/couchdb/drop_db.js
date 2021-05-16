var couch = require('./couchdb');

couch.db.destroy("artists").then(
    () => {
        console.log("Database 'artists' have been deleted");
    }
);

couch.db.destroy("tracks").then(
    () => {
        console.log("Database 'tracks' have been deleted");
    }
);