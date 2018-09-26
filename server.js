const net = require('net');

//TODO: Find better way...
let dataResolver;
const data = new Promise((resolve) => {
  dataResolver = resolve;
});

const server = net.Server((sock) => {
  console.log('Connected to client');
  sock.setEncoding('utf8');

  sock.on('end', () => {
    console.log('Client disconnected');
  });

  sock.on('data', dataResolver)
});

server.listen(8123, function() {
  console.log('Server is listening');
});

server.on('error', (err) => {
  console.error(err.toString());
  server.end();
});

const handleCmd = (cmd) => {
  if (/^PUT/.test(cmd)) {
    console.log(put);
  }
}

data.then(handleCmd);
