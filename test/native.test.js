const { Socket: NativeSocket } = require("bindings")("socket");

const socket = new NativeSocket({ port: 3000, hostname: "0.0.0.0" });
socket.listen((a) => console.log(a));