var transDuplex = require('duplex-transform')
var protobufStream = require('protobufjs-stream')

module.exports = WireProtocol

// Wire protocol takes a (byte-oriented) stream, and wraps it
// with Message encoding/decoding transforms (ships Payloads).
function WireProtocol(payloadTypes, wireStream) {
  var payloads = Payload.codec.createStream(wireStream)

  return transDuplex(encode, payloads, decode)

  function encode(item, ) {

  }
}


function WrapStream(checksumFn) {
  checksumFn = Pkt.IntegrityFrame.coerceChecksumFn(checksumFn)
  return through2.obj(write)

  function write (packet, enc, next) {
    this.push(Pkt.IntegrityFrame(packet, checksumFn))
    next()
  }
}


// acceptFns is a list of functions to accept as valid.
// if acceptFns is undefined, all functions in multihash accepted
function UnwrapStream(acceptFns) {
  if (acceptFns)
    throw new Error('accepting specific functions not implemented yet')
  return through2.obj(write)

  function write(packet, enc, next) {
    var integrity = packet
    var err = integrity.validate()
    if (err) {
      this.emit('invalid', { packet: integrity, error: err })
    } else {
      // ok, it's good. unwrap.
      this.push(integrity.decodePayload())
    }
    next()
  }
}