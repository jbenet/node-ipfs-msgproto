var Message = require('./message')
var protobufCodec = require('./protobuf-codec')

module.exports = Payload

// Payload is used in frames, to identify payloads.
// It carries around every other type of packet.
// Rather than force frames to identify their payloads,
// payloads identify themselves!

// type is a stack's message type code
// payload is either a Message or a Buffer
function Payload(message, type) {
  if (!(this instanceof Payload))
    return new Payload(message, type)

  if (message && !type) {
    if (message.constructor.type)
  }

  Message.apply(this)
  this.type = type
  if (message)
    this.setMessage(message)
}

// Payload inherits from Message for the encode/decode interface.
Message.inherits(Payload, Message)

Payload.codec = protobufCodec([
  { name: 'type', type: 'int' },
  { name: 'message', type: 'bytes'}
])

Payload.prototype.setMessage = function(message) {
  this.encMessage = this.decMessage = undefined
  if (message instanceof Buffer)
    this.encMessage = message
  else if (encodable(message))
    this.decMessage = message
  else
    throw new Error("Payload: should be Buffer or Message.")
}

Payload.prototype.validate = function() {
  if (!this.type)
    return new Error("Payload: no payload type")

  if (!this.encMessage && !this.decMessage)
    return new Error("Payload: no payload message")

  if (this.encMessage) {
    if (!(this.decMessage instanceof Buffer))
      return new Error("Payload: encoded message is not a Buffer")

    if (this.encMessage.length < 1)
      return new Error("Payload: encoded message is empty")
  }

  if (this.decMessage && !(this.decMessage instanceof Message))
    return new Error("Payload: decoded message is not a Message")

  // Don't actually want payload to validate recursively.
  // if (this.decMessage && typeof(this.decMessage.validate) == 'function')
  //   return this.decMessage.validate
}

Payload.prototype.getEncodedData = function() {
  return {
    type: this.type,
    message: this.encodedMessage()
  }
}

Payload.prototype.setDecodedData = function(data) {
  this.type = data.type
  this.message = this.setMessage(data.message)
}

Payload.prototype.toString = function() {
  return "<Payload "+ this.type +">"
}

Payload.prototype.getEncodedMessage = function() {
  if (!this.encMessage && encodable(this.decMessage))
    this.encMessage = this.decMessage.encode()

  if (this.encMessage instanceof Buffer)
    return this.encMessage

  throw new Error('Payload: no or invalid message')
}

Payload.prototype.getDecodedMessage = function(payloadTypes) {
  if (!this.decMessage && this.encMessage instanceof Buffer) {
    var PayloadType = payloadTypes[this.type]
    if (!PayloadType)
      throw new Error('no payload with type: ' + this.type)

    this.decMessage = PayloadType.decode(this.encMessage)
  }

  if (encodable(this.decMessage))
    return this.decMessage

  throw new Error('Payload: no or invalid message')
}

function encodable(m) {
  return m && typeof(m.encode) == 'function'
}

function decodable(m) {
  return m instanceof Buffer
}
