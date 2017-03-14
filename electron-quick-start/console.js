const WebSocket = require('ws'),
      $ = require('jquery'),
      /*
       *ws = new WebSocket('ws://127.0.0.1:8080'),
       *ws1 = new WebSocket('ws://127.0.0.1:8080');
       */
      ws = new WebSocket('ws://192.168.101.33:8080/sender'),
      ws1 = new WebSocket('ws://192.168.101.33:8080/receive');
      /*
       *ws = new WebSocket('ws://arevod-api-artevod-api.44fs.preview.openshiftapps.com/sender'),
       *ws1 = new WebSocket('ws://arevod-api-artevod-api.44fs.preview.openshiftapps.com/receive');
       */
      
      

$('#removeButton').on('click', function() {
    ws.send(JSON.stringify({
        id: $('#id').val(),
        type: $('#type').val()
    }));
});

ws.on('open', function() {});
ws1.on('message', function(data, flags) {
    $('#result').text(data);
});
