// package echoserver uses websockets and turns all received messages into CAPS.
package echoserver

import (
	"bytes"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var (
	upgrader = websocket.Upgrader{}
)

// HandleWs is called by ninjaServer.go and converts all received messages
// into uppercase, and sends it back to the original source.
func HandleWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}
		log.Printf("Received: %s \n", message)
		message = bytes.ToUpper(message)
		err = conn.WriteMessage(messageType, message)
		if err != nil {
			log.Println(err)
			break
		}
	}
	log.Println(err)
}