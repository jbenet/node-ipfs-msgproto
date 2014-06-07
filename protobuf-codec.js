var protobuf = require('protocol-buffers')
var transDuplex = require('duplex-transform')

module.exports = Codec

function Codec(proto2json) {
  if (!(this instanceof Codec))
    return new Codec(proto2json)

  this.schema = protobuf(proto2json)
}

Codec.prototype.encode = function(msg) {
  return this.schema.encode(msg)
}

Codec.prototype.decode = function(buf) {
  return this.schema.decode(buf)
}

Codec.prototype.createStream = function(stream) {
  var encode = this.schema.createEncodeStream()
  var decode = this.schema.createDecodeStream()
  return transDuplex(encode, stream, decode)
}
