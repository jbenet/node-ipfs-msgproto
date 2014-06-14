module.exports = WireProtocol

// Wire protocol takes a stream, and wraps it with Message
// encoding/decoding transforms (ships Payloads).
function WireProtocol(MessageType, wireStream) {
  return MessageType.codec.wrapDuplexStream(wireStream)
}
