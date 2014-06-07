var map = require('map-values')
var protobuf = require('protobufjs')
var protobufStream = require('protobufjs-stream')
var transDuplex = require('duplex-transform')

module.exports = Codec

// Simple codec example
// protocol buffers (using protobufjs-stream)
function Codec(pbSchema) {
  if (!(this instanceof Codec))
    return new Codec(pbSchema)

  this.schema = protobufStream(pbSchema)
}

// must implement
Codec.prototype.encode = function(msg) {
  return this.schema.encode(msg)
}

// must implement
Codec.prototype.decode = function(buf) {
  return this.schema.decode(buf)
}

// must implement
Codec.prototype.createStream = function(stream, MsgType) {
  return transDuplex.obj(encode, stream, decode)

  function encode(item, enc, next) {
    this.push(item.encode())
    next()
  }

  function decode(item, enc, next) {
    this.push(MsgType.decode(item))
    next()
  }
}

Codec.fromProtoSrc = function(src) {
  var protos = protobuf.loadProto(src).result
  return map(protos, Codec)
}
