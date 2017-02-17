const MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      url = "mongodb://artevod:artevod@ds157158.mlab.com:57158/artevod";

var connect = (callback) => {
    MongoClient.connect(url, {}, function(err, db) {
        callback(err, db);
    });
};

exports.insertBookmark = (iff, bookmark, callback) => {
    connect(function(err, db) {
        assert.equal(null, err);
        var bmCollection = db.collection('bookmarks');
        bmCollection.find({'iff': iff, id: bookmark.id, creator: bookmark.creator}).toArray(function(err, docs) {
            var existed = false;
            if (docs.length > 0) {
                docs.forEach(doc => {
                    if (doc.creator === bookmark.creator) {
                        existed = true;
                        bmCollection.updateOne(
                            {iff: iff, id: bookmark.id, creator: bookmark.creator},
                            {$set: bookmark},
                            function(err, result) {
                                console.log("** the error is");
                                console.log(err);
                                callback(bookmark);
                                db.close();
                            }
                        );
                    }
                });
            } 
            if (!existed) {
                bmCollection.insert(Object.assign(bookmark, {iff: iff}), 
                function(err, result) {
                    callback(bookmark);
                    db.close();
                });
            }
        });
    });
};

exports.removeBookmark = (iff, id, creator, callback) => {
    connect(function(err, db) {
        var predicate = {iff: iff};
        if (creator) {
            predicate.creator = creator;
        }
        if (id) {
            predicate.id = id;
        }
        var bmCollection = db.collection('bookmarks');
        bmCollection.deleteOne(predicate, function(err, docs) {
            callback(docs);
            db.close();
        });
    });
};

exports.getBookmarks = (iff, creator, callback) => {
    connect(function(err, db) {
        var predicate = {};
        if (creator) {
            predicate.creator = creator;
        }
        var bmCollection = db.collection('bookmarks');
        bmCollection.find(predicate).toArray(function(err, docs) {
            callback(docs);
            db.close();
        });
    });
};
