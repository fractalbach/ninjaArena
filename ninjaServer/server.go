package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fractalbach/ninjaArena/ninjaServer/echoserver"
)

const HelpMessage = `
The Ninja Arena Server!

USAGE:    
  ninjaServer (-address|-a) <ADDRESS> [options]

EXAMPLES:
  ninjaServer -a localhost:8080
  ninjaServer -a :8080
  ninjaServer -a tcp:80
  ninjaServer -a tcp:443 -index web/home.html
  ninjaServer -a="tcp:443" -index="web/home.html"

INFORMATION:
  Files will be served relative to the current directory,
  which will become the root directory for all files.

  Server Paths
      /     routes to index.html
      /*    routes to any file in the directory and subdirectories.
      /ws   routes to the websocket connection.  Has no files.
      /wss  routes to secure websoket (NOT IMPLEMENTED YET!)

  If the -io flag is used, then stdin and stdout will be enabled.
  Stdin will be scanned line by line (will wait for each line), so
  commands can be sent interactively.

OPTIONS:
`

const (
	HelpAddress    = "Host Address and Port number."
	HelpIndex      = "Homepage file"
	HelpIO         = "Enable Stdin input and Stdout output."
	DefaultAddress = "localhost:8080"
	DefaultIndex   = "index.html"
)

var (
	useStdinStdout bool
	addr           string
	index          string
)

func init() {
	flag.StringVar(&addr, "address", DefaultAddress, HelpAddress)
	flag.StringVar(&addr, "a", DefaultAddress, HelpAddress)
	flag.StringVar(&index, "index", DefaultIndex, HelpIndex)
	flag.BoolVar(&useStdinStdout, "io", false, HelpIO)
	flag.Usage = func() {
		fmt.Fprint(os.Stderr, HelpMessage)
		flag.PrintDefaults()
	}
}

func main() {
	flag.Parse()
	if useStdinStdout {
		go inputLoop()
	}
	runServer()
}

func inputLoop() {
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		handleStdinCommand(scanner.Text())
	}
}

func handleStdinCommand(line string) {
	log.Println("[Stdin]", line)
	switch line {
	case "hello":
		fmt.Println("well hello to you as well!")
	case "quit", "exit", "goodbye", "stop":
		fmt.Println("Shutting down server...")
		log.Fatal("Shutting down server by request from stdin.")
	}
}

func runServer() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", serveHome)
	mux.HandleFunc("/ws", serveWebSocket)
	mux.HandleFunc("/ws/echo", serveWebSocketEcho)
	mux.HandleFunc("/wss", serveSecureWebSocket)
	s := &http.Server{
		Addr:    addr,
		Handler: mux,
	}
	log.Println("Listening and Serving on: ", addr)
	log.Fatal(s.ListenAndServe())
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	logRequest(r)
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), 405)
		return
	}
	http.ServeFile(w, r, r.URL.Path[1:])
	return
}

func serveWebSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println(w, "Not yet implemented.")
}


func serveWebSocketEcho(w http.ResponseWriter, r *http.Request) {
	echoserver.HandleWs(w, r)
}

func serveSecureWebSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println(w, "Secure Web Socket Handler not yet been implemented.")
	http.Error(w, http.StatusText(501), 501)
}

func logRequest(r *http.Request) {
        log.Printf("(%v) %v %v %v", r.RemoteAddr, r.Proto, r.Method, r.URL)
}

