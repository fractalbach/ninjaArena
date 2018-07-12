# Ninja Arena

Online, free-for-all, player-vs-player, arena game.  Playable in the browser,
thanks to websockets.  (In early development) New things can be found here.
Location of the server: http://35.230.55.6/


## Speed Tests

To test your websocket connection on the echo server, go to
http://35.230.55.6/speed
which sends 100 messages back and forth, testing the average Round Trip Time
of the web socket messages, including both client and server message processing
times.


## Endpoints

Main websocket endpoint for the game:
http://35.230.55.6/ws

The echo server, used for speed tests and other experiments:
http://35.230.55.6/ws/echo


## Websockets

*Note: since websockets don't use HTTP, usually visiting the webpage directly
in a browser will not work. Instead, use the javascript websocket API*:
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

Here's an example usage, designed for chrome, which sometimes bundles
large messages together, and must be seperated again to access them.
~~~javascript
conn = new WebSocket("ws://35.230.55.6/ws");
conn.onmessage = handleMessages;

function handleMessages(event) {
	 let messages = event.data.split('\n');
	 for (let i = 0; i < messages.length; i++) {
	     console.log(messages[i])
	 }
}

conn.send("hello!");
~~~