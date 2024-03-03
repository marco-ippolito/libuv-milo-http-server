import bindings from "bindings";
const { Socket } = bindings("inbound-socket");

export class InboundSocket {
	#socket;

	constructor(options) {
		if (!options) {
			throw new Error("Address is required");
		}

		if (!options.port || typeof options.port !== "number" || options.port < 0) {
			throw new Error("Port is required");
		}

		if (!options.hostname || typeof options.hostname !== "string") {
			throw new Error("Hostname is required");
		}

		this.#socket = new Socket(options);
	}

	close() {
		this.#socket.close();
		return this;
	}

	listen(cb) {
		this.#socket.listen(cb);
		return this;
	}
}
