var map = require('map-values')
var protobuf = require('protobufjs')
var protobufStream = require('protobufjs-stream')
var transDuplex = require('duplex-transform')

module.exports = Codec

// Simple codec example
// protocol buffers (using protobufjs-stream)
function Codec(pbSchema) {
  if (!(this instanceof Codec))
    return new Codec(pbObj)

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
Codec.prototype.createStream = function(stream) {
  var encode = this.schema.createEncodeStream()
  var decode = this.schema.createDecodeStream()
  return transDuplex(encode, stream, decode)
}

Codec.fromProtoSrc = function(src) {
  var protos = protobuf.loadProto(src).result.messages
  return map(protos, Codec)
}
