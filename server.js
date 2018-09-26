const net = require('net');

const socket = new Promise((resolve, reject) => {
  const server = net.Server((sock) => {
    console.log('Connected to client');
    sock.setEncoding('utf8');

    sock.on('end', () => {
      console.log('Client disconnected');
      reject();
    });

    resolve(sock);
  });

  server.listen(8123, () => console.log('Server is listening'));

  server.on('error', (err) => {
    console.error(err.toString());
    server.end();
    reject(err);
  });
});

const data = new Promise((resolve) => {
  socket.then((sock) => sock.on('data', resolve));
});

data.then((cmd) => {
  if (/^PUT/.test(cmd)) {
    console.log('put');
    socket.then((sock) => sock.write('ok\n'));
  } else if (/^KEYS/.test(cmd)) {
    console.log('keys');
    socket.then((sock) => sock.write('deine mudda\n'));
  } else {
    console.log('shit');
  }
});




/*const handleCmd = (cmd) => {
  if (/^PUT/.test(cmd)) {
    console.log(put);
  }
}

data.then(handleCmd);*/
