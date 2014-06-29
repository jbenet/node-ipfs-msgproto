var test = require('tape')
var map = require('lodash.map')
var multiDgrams = require('multi-dgram-stream')
var msgproto = require('./')
var Message = msgproto.Message
var Frame = msgproto.Frame

function setupStreams(addrs) {
  addrs = map(addrs, function(a) {
    return 'localhost:' + a
  })

  return map(addrs, function (addr) {
    var mds = multiDgrams(addr, addrs)
    var seg = msgproto.WireProtocol(msgproto.Frame)
    seg.buffers.pipe(mds).pipe(seg.buffers)
    return seg.messages
  })
}


test('test send', function(t) {
  var numMessages = 10
  t.plan(numMessages * 4 + 1)

  var sent = {}
  var streams = setupStreams([1234, 2345, 3456])
  map(streams, function(s) {
    s.on('data', function(msg) {
      t.ok(sent[msg.payload], 'should receive msg: ' + msg.payload)
      sent[msg.payload].push(s)

      if (sent[msg.payload].length == streams.length) { // all got it.
        delete sent[msg.payload]
        t.ok(!sent[msg.payload], 'should be done with msg: ' + msg.payload)
      }

      if (Object.keys(sent).length == 0) { // all done
        map(streams, function(s) {
          s.write(null)
          s.end() // why doesn't s.end() work!?
        })
        t.ok(true, 'should be done')
      }
    })
  })

  for (var i = 0; i < numMessages; i++) {
    var msg = Frame(new Buffer('hello there #' + i))
    sent[msg.payload] = [] // expect things.

    var sender = streams[(i + 1) % streams.length]
    sender.write(msg)
    console.log('sent: ' + msg.payload)
  }
})
