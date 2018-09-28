"use strict"
const net = require('net')

const server = net.Server()
server.listen(8123, () => console.log('Server is listening'))

server.on('error', (err) => {
  console.error(err.toString())
  server.close()
})

server.on('close', () => console.log('Server shut down'))

server.on('connection', (socket) => {
  console.log('Client connected')

  socket.setEncoding('utf8')
  socket.on('end', () => console.log('Client disconnected'))
  socket.on('data', interpretInContext(socket))
})

const interpretInContext = (socket) => {
  let dict = {}

  return (cmd) => {
    switch(true) {
      case /^PUT[\n ]/.test(cmd):
        if (!/^PUT \w+ \d+ \w+\n$/.test(cmd)) {
          socket.write('ko\n')
        } else {
          let res = cmd.split(/[ \n]/)
          dict[res[1]] = res[3].slice(0, res[2])
          socket.write('ok\n')
        }
        break;

      case /^KEYS[\n ]/.test(cmd):
        if (!/^KEYS\n$/.test(cmd)) {
          socket.write('Too much parameters\n')
        } else {
          for (let key in dict) {
            socket.write(key + "\n")
          }
        }
        break;

      case /^GET[\n ]/.test(cmd):
        if (!/^GET \w+\n$/.test(cmd)) {
          socket.write('Too much or not enough parameters\n')
        } else {
          let res = cmd.split(/[ \n]/)
          let etr = dict[res[1]]
          if (etr) {
            socket.write(etr.length + '\n' + etr+ '\n')
          } else {
            socket.write('0\n')
          }
        }
        break;

      case /^DEL[\n ]/.test(cmd):
        if (!/^DEL \w+\n$/.test(cmd)) {
          socket.write('Too much or not enough parameters\n')
        } else {
          let res = cmd.split(/[ \n]/)
          if (dict[res[1]]) {
            delete dict[res[1]]
            socket.write('ok\n')
          } else {
            socket.write('ko\n')
          }
        }
        break;
    }
  }
}
