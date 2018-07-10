package wshandle

import (
	"github.com/gorilla/websocket"
	"log"
	"bytes"
	"time"
	"net/http"
)

type client struct {
	name    string
	channel chan<- string
}

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
)

var (
	upgrader = websocket.Upgrader{}
	entering = make(chan client)
)

// handleWs is called by ninjaServer.go
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

func broadcaster() {
}

// an example of some service.
/*
func service1(w http.ResponseWriter, r *http.Request) {
}

func service2(w http.ResponseWriter, r *http.Request) {
}

type Hub struct {
	clients map[*Client]bool
	broadcast chan []bytes
	register chan *Client
	unregister chan *Client
}
*/
