import bindings from "bindings";
import { EventEmitter } from "events";
import { ReadableStream } from "node:stream/web";
const { Socket } = bindings("inbound-socket");

export class InboundSocket {
	#socket;
	emitter;
	readable;
	open = false;

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
		this.emitter = new EventEmitter();
		this.open = true;
		this.readable = ReadableStream.from(this.#onEvents());
	}

	async *#onEvents() {
		while (this.open) {
			const eventPromise = new Promise((resolve, reject) => {
				this.emitter.on("data", resolve);
				this.emitter.on("error", reject);
			});
			yield await eventPromise;
		}
	}

	close() {
		this.open = false;
		this.#socket.close();
		return this;
	}

	listen() {
		const read = this.emitter.emit.bind(this.emitter);
		this.#socket.listen(read);
		return this;
	}
}
