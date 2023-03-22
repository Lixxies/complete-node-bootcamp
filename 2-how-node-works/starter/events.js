import EventEmitter from "events";
import http from "http";

const emitter = new EventEmitter();

emitter.on('newSale', () => {
    console.log("There was a new sale!");
})

emitter.on('newSale', () => {
    console.log("Customer name: Jonas");
})

emitter.on('newSale', stock => {
    console.log(`There are now ${stock} items left in stock`);
})

emitter.emit('newSale', 9)

////////////////////////////

const server = http.createServer()

server.on('request', (req, res) => {
    res.end("Request received");
})

server.on('request', (req, res) => {
    console.log("Another request received");
})

server.on('close', () => {
    console.log("Server closed");
})

server.listen(8000, '127.0.0.1', () => {
    console.log("Waiting for requests...");
})
