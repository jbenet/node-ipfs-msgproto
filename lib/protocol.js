var segment = require('pipe-segment')
var through2 = require('through2')
var duplexer2 = require('duplexer2.jbenet')

module.exports = WireProtocol

// Wire protocol takes a stream, and wraps it with Message
// encoding/decoding transforms (ships Payloads).
function WireProtocol(MessageType) {

  var packer = through2.obj(pack)
  var unpacker = through2.obj(unpack)

  return segment({
    messages: duplexer2({objectMode: true}, packer, unpacker),
    buffers: duplexer2({objectMode: true}, unpacker, packer),
  })

  function pack(msg, enc, next) {
    this.push(msg.encode())
    next()
  }

  function unpack(buf, enc, next) {
    this.push(MessageType.decode(buf))
    next()
  }
}
