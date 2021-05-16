var couch = require('./couchdb'); couch.db.create('test', function (err) {
    if (err) {
        console.error(err);
    }
});