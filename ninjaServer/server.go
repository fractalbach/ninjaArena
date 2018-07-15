package main

import (
	"bufio"
	"crypto/tls"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fractalbach/ninjaArena/ninjaServer/echoserver"
	"golang.org/x/crypto/acme/autocert"
)

const HelpMessage = `
The Ninja Arena Server!

USAGE:    
  ninjaServer [options]

EXAMPLES:
  ninjaServer -a localhost:8080
  ninjaServer -a=localhost:8080
  ninjaServer -a :http -tls :https

INFORMATION:
  Files will be served relative to the current directory,
  which will become the root directory for all files.

  Server Paths
      /     routes to index.html
      /*    routes to any file in the directory and subdirectories.
      /ws   routes to the websocket connection.  Has no files.

  If the -io flag is used, then stdin and stdout will be enabled.
  Stdin will be scanned line by line (will wait for each line), so
  commands can be sent interactively.

OPTIONS:
`

const (
	HelpAddress       = "Host Address and Port for Standard connections."
	HelpAddressTLS    = "Host Address and Port for TLS connections."
	HelpIndex         = "Homepage file"
	HelpIO            = "Enable Stdin input and Stdout output."
	DefaultAddress    = "localhost:8080"
	DefaultAddressTLS = ""
	DefaultIndex      = "index.html"
)

var (
	useStdinStdout bool
	usingTLS       bool
	addr           string
	addrTLS        string
	index          string
)

func init() {
	flag.StringVar(&addr, "address", DefaultAddress, HelpAddress)
	flag.StringVar(&addr, "a", DefaultAddress, HelpAddress)
	flag.StringVar(&addrTLS, "tls", DefaultAddressTLS, HelpAddressTLS)
	flag.StringVar(&index, "index", DefaultIndex, HelpIndex)
	flag.BoolVar(&useStdinStdout, "io", false, HelpIO)
	flag.Usage = func() {
		fmt.Fprint(os.Stderr, HelpMessage)
		flag.PrintDefaults()
	}
	if addrTLS != "" {
		usingTLS = true
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
	certManager := autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("thebachend.com"),
		Cache:      autocert.DirCache("certs"),
	}
	s := &http.Server{
		Addr: addrTLS,
		TLSConfig: &tls.Config{
			GetCertificate: certManager.GetCertificate,
		},
		Handler: mux,
	}
	log.Println("Listening and Serving on: ", addr)
	if usingTLS {
		go http.ListenAndServe(addr, certManager.HTTPHandler(nil))
		log.Println("Listening and Serving TLS on: ", s.Addr)
		log.Fatal(s.ListenAndServeTLS("", ""))
	} else {
		s.Addr = addr
		log.Fatal(s.ListenAndServe())
	}
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
	fmt.Fprintln(w, "Not yet implemented.")
}

func serveWebSocketEcho(w http.ResponseWriter, r *http.Request) {
	echoserver.HandleWs(w, r)
}

func logRequest(r *http.Request) {
	log.Printf("(%v) %v %v %v", r.RemoteAddr, r.Proto, r.Method, r.URL)
}
