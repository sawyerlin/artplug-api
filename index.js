const fs = require('fs'),
      express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      dbClient = require('./dbClient'),
      rubs = {
          0: {
              title: "",
              start: 1,
              end: 6,
              size: 6,
              suffix: "e.jpg"
          },
          1: {
              title: "Tout plein de films",
              start: 1,
              end: 10,
              size: 16,
              suffix: "v.jpg"
          },
          2: {
              title: "A ne pas manquer",
              start: 1,
              end: 1,
              size: 1,
              suffix: "b.jpg"
          },
          3: {
              title: "Tout plein de série",
              start: 11,
              end: 16,
              size: 16,
              suffix: "v.jpg"
          },
          4: {
              title: "Promotions du mois",
              start: 4,
              end: 6,
              size: 6,
              suffix: "e.jpg"
          },
      };
var expressWs = require('express-ws')(app);
app.use(bodyParser.json());
app.use(express.static('sources'));
app.get('/home', function(req, res) {
    fs.readFile('sources/home.json', 'utf-8', function(err, data) {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        for (var i in jsonData.rubriques) {
            var rubrique = jsonData.rubriques[i],
                id = rubrique.id;
            rubrique.contents = buildContents(id, rubs[id].start, rubs[id].end, rubs[id].suffix, req);
            if (rubrique.moreUrl) { 
                rubrique.contents.push({
                    id: "more",
                    detailUrl: "/rubrique/" + id 
                });
            }
        }
        res.json(jsonData);
    });
});
app.get('/rubrique/:id', function(req, res) {
    var id = req.params.id;
    var result = {
        id: id,
        backgroundImage: getHostUrl(req) + "/gfx/background.png",
        title: rubs[id].title,
        contents: []
    };
    result.contents = buildContents(id, 1, rubs[id].size, rubs[id].suffix, req, true);
    res.json(result);
});
app.get('/menu/:id*?', function(req, res) {
    var id = req.params.id;
    fs.readFile('sources/menu' + (id !== undefined ? "_" + id : "") + '.json', function(err, data) {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});
app.get('/search/:text*?', function(req, res) {
    res.json(buildContents(1, 1, rubs[1].size, rubs[1].suffix, req, true));
});
app.get('/detail/:type?/:id', function(req, res) {
    var id = req.params.id;
    var isIntegral = req.query.integral;
    var fileName = "movie";

    if(req.params.type === undefined) {
        switch(Math.floor(Math.random() * 4) + 1) {
            case 0:
                fileName = "movie";
                break;
            case 1:
                fileName = "serie";
                break;
            case 2:
                fileName = "season";
                break;
            case 4:
                fileName = "collection";
                break; 
        }
        fileName = "collection";
    } else {
        fileName = req.params.type;
    }
    if (isIntegral) {
      fileName = "integral";
    }

    fs.readFile('sources/' + fileName + '.json', function(err, data) {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        jsonData.id = id;
        jsonData.picture = {
            backgroundImage: getHostUrl(req) + jsonData.picture.backgroundImage,
            recoBackgroundImage: getHostUrl(req) + jsonData.picture.recoBackgroundImage,
            image: getHostUrl(req) + jsonData.picture.image
        };
        if (jsonData.type === "season") {
            jsonData.episodes = buildEpisodes(id, req);
        } else if (jsonData.type === "serie" && isIntegral) {
            jsonData.seasons = (function() {
                var results = [];
                for (var i = 1; i <= 3; i ++) {
                    var episodes = buildEpisodes(id, req);
                    results.push({
                        season: i,
                        episodeNumber: episodes.length,
                        episodes: episodes
                    });
                }
                return results;
            })();
        } else if (jsonData.type !== "collection") {
            jsonData.recos = {
                title: "Vous aimerez peut-être aussi...",
                contents: buildContents(1, rubs[1].start, rubs[1].end, rubs[1].suffix, req)
            };
        }
        res.json(jsonData);
    });
});
app.get('/help', function(req, res) {
    fs.readFile('sources/help.json', function(err, data) {
        if (err) throw err;
        var jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});
app.put('/bookmarks/:iff', function(req, res) {
    dbClient.insertBookmark(+req.params.iff, req.body, function(result) {
        delete result._id;
        delete result.iff;
        res.json(Object.assign(result, {
            title: "item " + result.id,
            imageUrl: getHostUrl(req) + "/gfx/" + result.id + "z.jpg",
            detailUrl: "/detail/" + result.id + "_" + result.id,
            backgroundUrl: getHostUrl(req) + "/gfx/videos/background.png",
            startDate: new Date(),
            rating: Math.floor(Math.random() * 100) + 1,
            note: Math.floor(Math.random() * 10000) + 1
        }));
    });
});
app.delete('/bookmarks/:iff', function(req, res) {
    dbClient.removeBookmark(+req.params.iff, +req.query.id, req.query.creator, function(result) {
        res.json({});
    });
});
app.get('/bookmarks/:iff', function(req, res) {
    var creator = req.query.creator,
        version = req.query.version;
    dbClient.getBookmarks(req.params.iff, creator, version, function(result) {
        res.json(result.map((bookmark, index) => {
            delete bookmark._id;
            delete bookmark.iff;
            return Object.assign(bookmark, {
                title: "item " + index,
                imageUrl: getHostUrl(req) + "/gfx/" + index + "z.jpg",
                detailUrl: "/detail/" + bookmark.id + "_" + index,
                backgroundUrl: getHostUrl(req) + "/gfx/videos/background.png",
                startDate: new Date(),
                rating: Math.floor(Math.random() * 100) + 1,
                note: Math.floor(Math.random() * 10000) + 1
            });
        }));
    });
});
var aWss = expressWs.getWss('/receive');
app.ws('/receive', function(ws, req) {
    /*
     *ws.on('message', function(msg) {
     *    aWss.clients.forEach(function(client) {
     *        client.send(msg);
     *    });
     *    console.log(msg);
     *});
     */
});
app.ws('/sender', function(ws, req) {
    ws.on('message', function(msg) {
        aWss.clients.forEach(function(client) {
            client.send(msg);
        });
        console.log(msg);
    });
});
function buildEpisodes(id, req) {
    var contents = [];
    for (var i = 1; i <= 6; i++) {
        //var newId = Math.floor(Math.random() * (100)).toString();
        var newId = id + "_" + i;
        var content = {
            id: newId,
            imageUrl: getHostUrl(req) + "/gfx/season/e" + i + ".png",
            detailUrl: "/detail/" + newId,
            number: i,
            type: "episode",
            isLocked: i === 3,
            picture: {
                backgroundImage: "/gfx/movie/moviebg.png",
                recoBackgroundImage: "/gfx/movie/recobg.png",
                image: "/gfx/movie/vignette.jpg"
            },
            title: "itemTitle " + i,
            synopsis: "(Random id: "+ newId +") En 6 captivants épisodes, la saison 1 de Rectify raconte les jours qui suivent la libération de Daniel. Comment se réhabituer à un quotidien fait des projets et d'anticipation, quand on a vécu enfermé, sans espoir ni futur, ni même la sensation des saisons qui passent ? Comment comprendre un monde qui, en 18 ans, s'est métamorphosé ? " + i,
            rents: {
                sd: {
                    value: 2.99,
                    duration: "48",
                    type: "h"
                },
                hd: {
                    value: 3.99,
                    duration: "48",
                    type: "h"
                }
            },
            medias: {
                sd: "483976780",
                hd: "483976777"
            },
            trailer: "110000"
        };
        contents.push(content);
    }
    return contents;
}
function buildContents(id, start, end, suffix, req, isfull) {
    isfull = isfull || false;
    var contents = [];
    for (var i = start; i <= end; i++) {
        var newId = id + "_" + i;
        var content = {
            id: newId,
            imageUrl: getHostUrl(req) + "/gfx/" + i + suffix,
            detailUrl: "/detail/" + newId
        };
        if (isfull) {
            content.title = "itemTitle " + i;
            content.actor = "itemActor " + i;
            content.duration = i + "h51";
            content.genre = "genre " + i;
            content.synopsis = "synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis synopsis" + i;
            content.csa = (i % 3 + 1);
        }
        contents.push(content);
    }
    return contents;
}
function getHostUrl(req) {
return "";
    //return req.protocol + "://" + req.headers.host + "/arte_bouchon_api";
}
app.listen(8080, function() {
    console.log('%s: Node server started on %d ...', Date(Date.now()), 8080);
});
