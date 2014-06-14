var fs = require('fs')
var Message = require('./message')
var ProtobufCodec = require('ipfs-protobuf-codec')

module.exports = Frame

// A Frame is a meta Message that carries a payload (usually a Message)
// It provides nice helpers for en/decoding and en/decapsulating.
// (Think of the OSI layer frames: IP, TCP, UDP, Ethernet.)
function Frame(payload, payloadType) {
  if (!(this instanceof Frame))
    return new Frame(payload, payloadType)

  Message.apply(this)
  this.payload = payload
  this.payloadType = payloadType || Buffer
}

Message.inherits(Frame, Message)

Frame.prototype.getEncodedPayload = function() {
  var payload = this.payload

  if (!(payload instanceof Buffer))
    payload = payload.encode()

  return payload
}

Frame.prototype.getDecodedPayload = function() {
  var payload = this.payload

  if (payload instanceof Buffer && this.payloadType != Buffer)
    payload = this.payloadType.decode(payload)

  return payload
}

Frame.prototype.getEncodedData = function() {
  // no super because Message doesn't do anything.
  return {
    payload: this.getEncodedPayload()
  }
}

Frame.prototype.setDecodedData = function(data) {
  // no super because Message doesn't do anything.
  this.payload = data.payload
}

Frame.prototype.validate = function() {
  // no super because Message doesn't do anything.
  if (!this.payload)
    return new Error('Frame: no payload')

  if (!(this.payload instanceof Buffer) && !(this.payload instanceof Message))
    return new Error('Frame: payload must be Buffer or Message')

  if (typeof(this.payload.validate) == 'function')
    return this.payload.validate()
}

var src = fs.readFileSync(__dirname + '/frame.proto', 'utf-8')
var protos = ProtobufCodec.fromProtoSrc(src)
Frame.codec = protos.Frame
