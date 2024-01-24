const { test } = require('node:test');
const { Socket } = require('../lib/socket');

test('Socket', () => {
    new Socket({ port: 8000, hostname: "0.0.0.0" });
})

test('Socket bind same port', () => {
    const socket = new Socket({ port: 8000, hostname: "0.0.0.0" });
    socket.listen((s) => console.log(s));
})