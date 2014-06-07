var Message = require('./message')
var Payload = require('./payload')

module.exports = Frame

// A Frame is a meta Message that carries a Payload Message
// It provides nice helpers for en/decoding and en/decapsulating.
// (Think of the OSI layer frames: IP, TCP, UDP, Ethernet.)
function Frame(payload) {
  if (!(this instanceof Frame))
    return new Frame(payload)

  Message.apply(this)

  if (!(this instanceof Buffer) && !(this instanceof Payload))
    payload = Payload(payload)

  this.payload = payload
}

Message.inherits(Frame, Message)

Frame.prototype.getEncodedPayload = function() {
  var payload = this.payload

  if (!(payload instanceof Buffer))
    payload = payload.encode()

  return payload
}

Frame.prototype.getDecodedPayload = function(payloadTypes) {
  var payload = this.payload

  if (payload instanceof Buffer)
    payload = Payload.decode(payload)

  // want the payload message itself
  return payload.getDecodedMessage(payloadTypes)
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

  if (!(this.payload instanceof Buffer) && !(this.payload instanceof Payload))
    return new Error('Frame: payload must be Buffer or Payload')

  if (typeof(this.payload.validate) == 'function')
    return this.payload.validate()
}
