# ipfs-msgproto

This is a node module to make writing wire protocol stacks on top of streams easier. In particular, it's very helpful when your protocol layers manipulate those above (e.g. en/decryption).  The way it works is that the user defines

- a Message type that inherits from message-protocol's Message
- a Protocol (duplex stream) for writing and reading message objects
- a codec: json, protobuf message, or capnp struct (optional)
- any special actions particular to the protocol (optional)

And this modules takes care of en/decoding, en/decapsulating, etc. BTW, it's recommended to use protobufs or capnp codecs for encoding/decoding to the wire. Though, at the very least, msgproto payloads are protobuf encoded, so you'll get smart wire scanning.

## Install

```
npm install msgproto
```

## Examples

Check out these shim protocols:

- [ipfs-msgproto-integrity](https://github.com/jbenet/node-ipfs-msgproto-integrity) - multihash checksums
- [ipfs-msgproto-network](https://github.com/jbenet/node-ipfs-msgproto-network) - to/from addressing
- [ipfs-msgproto-nonce](https://github.com/jbenet/node-ipfs-msgproto-nonce) - guard against replay attacks
- [ipfs-msgproto-crypto](https://github.com/jbenet/node-ipfs-msgproto-crypto) - encrypted shim protocol


And then see this sample protocol:

- [msgproto-example-chat](https://github.com/jbenet/node-msgproto-example-chat)

