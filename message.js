var inherits = require('inherits')

module.exports = Message

function Message() {
  if (!(this instanceof Message))
    return new Message()
}

// All messages should have a name to identify them.
// Unique to your stack. Feel free to rebind them.
// (useful for debugging/printing)
Message.name = 'msgproto.Message'

Message.prototype.toString = function() {
  return "<" + this.constructor.name + ">"
}

// Call validate to make sure all the data is set correctly.
Message.prototype.validate = function() {}

// Call encodeData to get the finalized data for encoding.
Message.prototype.getEncodedData = function() { return {} }

// Call decodeData to set values from decoded data.
Message.prototype.setDecodedData = function(data) {}

Message.prototype.encode = function() {
  return this.constructor.encode(this)
}

// Call Message.encode to encode a message object into a buffer.
Message.prototype.encode = function() {
  if (!(this instanceof Message))
    throw new Error('must be a Message')

  if (!this.constructor.codec)
    throw new Error('Message has no codec: ' + this.constructor)

  return this.constructor.codec.encode(this.getEncodedData())
}

Message.encode = function(msg) {
  return msg.encode()
}

// Call Message.decode to decode a buffer into a Message.
Message.decode = function(buffer) {
  if (!(buffer instanceof Buffer))
    throw new Error('buffer must be a Buffer')

  // if (!pf.type)
  //   throw new Error('Packet.decode error: no packet type in frame.')

  // if (!pf.payload)
  //   throw new Error('Packet.decode error: no packet payload in frame.')

  if (!this.codec)
    throw new Error('Packet has no codec: ' + this)

  var p = this()
  p.setDecodedData(this.codec.decode(buffer))
  return p
}

Message.inherits = function(MsgType, Parent) {
  Parent = Parent || Message
  inherits(MsgType, Parent)
  MsgType.decode = Parent.decode // need to patch in decode
}
