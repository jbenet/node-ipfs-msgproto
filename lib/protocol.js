var segment = require('pipe-segment')
var through2 = require('through2')
var duplexer2 = require('duplexer2.jbenet')
var stream = require('readable-stream')
var noop = function() {}

module.exports = WireProtocol

// Wire protocol takes a stream, and wraps it with Message
// encoding/decoding transforms (ships Payloads).
function WireProtocol(MessageType) {

  var packer = through2.obj(pack)
  var unpacker = through2.obj(unpack)
  var packingErrors = stream.Readable({objectMode: true})
  var unpackingErrors = stream.Readable({objectMode: true})
  packingErrors._read = noop
  unpackingErrors._read = noop

  return segment({
    messages: duplexer2({objectMode: true}, packer, unpacker),
    buffers: duplexer2({objectMode: true}, unpacker, packer),
    packingErrors: packingErrors,
    unpackingErrors: unpackingErrors,
  })

  function pack(msg, enc, next) {
    var encoded
    try {
      encoded = msg.encode()
    } catch (e) {
      packingErrors.push(e)
    }
    if (encoded) this.push(encoded)
    next()
  }

  function unpack(buf, enc, next) {
    var decoded
    try {
      decoded = MessageType.decode(buf)
    } catch (e) {
      unpackingErrors.push(e)
    }
    if (decoded) this.push(decoded)
    next()
  }
}
