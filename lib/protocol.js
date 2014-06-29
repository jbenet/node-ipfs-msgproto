var segment = require('pipe-segment')
var through2 = require('through2')
var bun = require('bun')

module.exports = WireProtocol

// Wire protocol takes a stream, and wraps it with Message
// encoding/decoding transforms (ships Payloads).
function WireProtocol(MessageType) {
  var seg = MessageType.codec.createPipeSegment()

  var packer = through2.obj(pack)
  var unpacker = through2.obj(unpack)

  return segment({
    messages: bun([packer, seg.decoded, unpacker]),
    buffers: seg.encoded,
  })

  function pack(msg) {
    return msg.encode()
  }

  function unpack(buf) {
    return MessageType.decode(buf)
  }
}
