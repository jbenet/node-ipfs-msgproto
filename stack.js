module.exports = Stack

// Stack represents a protocol stack.
// It just manages the mappings between { protocol ids : MessageObject }
function Stack(protocols) {
  this.protocols = protocols || {}
}

Stack.prototype.MessageType = function(type) {
  if (!this.protocols[type])
    throw new Error('stack has no protocol with type: ' + type)

  return this.protocols[type].MessageType
}
