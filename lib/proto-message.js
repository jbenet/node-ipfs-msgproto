var Message = require('./message')

function ProtoMessage(fields) {
  if (!(this instanceof ProtoMessage))
    return ProtoMessage(fields)

  Message.call(this)
  this.fields = fields
}

Message.inherits(ProtoMessage, Message)

// Call encodeData to get the finalized data for encoding.
ProtoMessage.prototype.getEncodedData = function() {
  data = {}
  for (var k in this.fields)
    data[k] = this[k]
  return data
}

// Call decodeData to set values from decoded data.
ProtoMessage.prototype.setDecodedData = function(data) {
  for (var k in this.fields)
    this[k] = data[k]
}
