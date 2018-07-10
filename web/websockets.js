
var conn;

if (window["WebSocket"]) {        
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
	console.log("Connection closed.");
    };
    conn.onmessage = function (evt) {
        var messages = evt.data.split('\n');
        for (var i = 0; i < messages.length; i++) {
	    console.log(messages[i])
        }
    };
} else {
    console.log("Cannot connect to Websocket");
}


function sendMessage(messageString) {
    conn.send(messageString);
}
