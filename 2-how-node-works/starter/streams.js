import fs from 'fs';
import http from 'http';

const server = http.createServer()

server.on('request', (req, res) => {
    const readable = fs.createReadStream('test-file.txt')
    readable.pipe(res)  // readableSource.pipe(writeableDestination)
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening...')
})
