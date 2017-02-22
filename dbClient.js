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
        var bmCollection = db.collection('bookmarks'),
            predicate = Object.assign({
            iff: iff, 
            id: bookmark.id, 
            creator: bookmark.creator,
        }, (function() {
            if (bookmark.creator === "ticket") {
                return {
                    version: bookmark.version
                };
            } else if (bookmark.creator === "player") {
                return {
                    version: bookmark.version
                };
            }
        })());
        bmCollection.findOne(predicate, function(err, item) {
            if (item) {
                bmCollection.updateOne(predicate, {$set: bookmark},
                function(err, result) {
                    callback(bookmark);
                    db.close();
                });
            } else {
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
        if (id) {
            predicate.id = id;
        }
        if (creator) {
            predicate.creator = creator;
        }
        console.log(predicate);
        db.collection('bookmarks').deleteOne(predicate, function(err, docs) {
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
