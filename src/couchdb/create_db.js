var couch = require('./couchdb');

couch.db.create('artists', function (err) {
    if (err && err.statusCode != 412) {
        console.error(err);
    }
    else {
        console.log('database "artists" created');
    }
});

couch.db.create('tracks', function (err) {
    if (err && err.statusCode != 412) {
        console.error(err);
    }
    else {
        console.log('database "tracks" created');
    }
});