const WebSocket = require('ws'),
      $ = require('jquery'),
      ws = new WebSocket('ws://localhost:3000/sender'),
      ws1 = new WebSocket('ws://localhost:3000/receive');

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
