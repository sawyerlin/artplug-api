const assert = require('assert'),
      dbClient = require('../dbClient');

describe('Bookmarks', function() {
    /*
     *describe('#### Add 1', function() {
     *    it('bookmark is added', function(done) {
     *        dbClient.insertBookmark(123456, {
     *            id: 1,
     *            creator: "favorite"
     *        }, function(result) {
     *            done();
     *        });
     *    });
     *});
     */
    /*
     *describe('#### Add 2', function() {
     *    it('bookmark is added', function(done) {
     *        dbClient.insertBookmark(123456, {
     *            id: 2,
     *            creator: "ticket",
     *            leftTime: {
     *                version: "hd",
     *                number: 15,
     *                type: "j"
     *            }
     *        }, function(result) {
     *            done();
     *        });
     *    });
     *});
     */
    describe('#### Add 3', function() {
        it('bookmark is added', function(done) {
            dbClient.insertBookmark(5073103, {
                id: 10,
                creator: "player",
                timeCode: 51
            }, function(result) {
                done();
            });
        });
    });
    /*
     *describe('**** Get All bookmarks', function() {
     *    it('all bookmarks are got', function(done) {
     *        dbClient.getBookmarks(123456, null, function(result) {
     *            console.log(result);
     *            done();
     *        });
     *    });
     *});
     *describe('**** Get ticket bookmarks', function() {
     *    it('ticket bookmarks are got', function(done) {
     *        dbClient.getBookmarks(123456, "ticket", function(result) {
     *            console.log(result);
     *            done();
     *        });
     *    });
     *});
     *describe('**** Get player bookmarks', function() {
     *    it('ticket bookmarks are got', function(done) {
     *        dbClient.getBookmarks(123456, "player", function(result) {
     *            done();
     *        });
     *    });
     *});
     *describe('**** Get favorite bookmarks', function() {
     *    it('ticket bookmarks are got', function(done) {
     *        dbClient.getBookmarks(123456, "favorite", function(result) {
     *            done();
     *        });
     *    });
     *});
     */
    /*
     *describe('$$$$ remove favorite of bookmark 1', function() {
     *    it('bookmarks favorite 1 is removed', function(done) {
     *        dbClient.removeBookmark(123456, 1, "favorite", function(result) {
     *            done();
     *        });
     *    });
     *});
     */
    /*
     *describe('$$$$ remove ticket of bookmark 2', function() {
     *    it('bookmark ticket 2 is removed', function(done) {
     *        dbClient.removeBookmark(123456, 2, "ticket", function(result) {
     *            done();
     *        });
     *    });
     *});
     *describe('$$$$ remove player bookmarks ', function() {
     *    it('bookmarks player are removed', function(done) {
     *        dbClient.removeBookmark(123456, null, "player", function(result) {
     *            done();
     *        });
     *    });
     *});
     */
});
