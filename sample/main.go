package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
)

func main() {
	port := 3000

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		w.Write([]byte("julia"))
	})

	l, err := net.Listen("tcp", ":"+strconv.Itoa(port))
	if err != nil {
		log.Fatalf("listen: %s", err)
	}

	ch := make(chan os.Signal)
	signal.Notify(ch, os.Interrupt, os.Kill)

	go func() {
		log.Println("starting server on port " + strconv.Itoa(port))
		err := http.Serve(l, mux)
		if err != nil {
			log.Fatalf("serve: %s", err)
		}
	}()

	<-ch
	if err := l.Close(); err != nil {
		log.Printf("serve close: %s", err)
	}

	log.Println("server closed")
}
