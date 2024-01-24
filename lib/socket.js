const { Socket: NativeSocket } = require("bindings")("socket");

class Socket {
    #socket;
    constructor(options) {
        this.#validateAddress(options);
        this.#socket = new NativeSocket(options);
        this.port = this.#socket.port;
        this.hostname = this.#socket.hostname;
    }

    #validateAddress(address) {
        if (!address) {
            throw new Error("Address is required");
        }

        if (!address.port || typeof address.port !== "number" || address.port < 0) {
            throw new Error("Port is required");
        }

        if (!address.hostname || typeof address.hostname !== "string") {
            throw new Error("Hostname is required");
        }
    }

    listen(callback) {
        return this.#socket.listen(callback);
    }
}

module.exports = {
    Socket
}