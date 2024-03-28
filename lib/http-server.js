import { InboundTCPSocket } from "./socket.js";
import { load } from "./milo.js";
import milo from "@perseveranza-pets/milo";

export class HttpServer {
	httpVersion;
	hostname;
	port;
	#socket;
	constructor(options) {
		this.httpVersion = options.httpVersion || "1.1";
		this.hostname = options.hostname;
		this.port = options.port;
		switch (this.httpVersion) {
			case "1":
			case "1.1":
				this.#socket = new InboundTCPSocket(options);
				break;
			case "2":
				throw new Error("HTTP/2 is not supported yet");
			case "3":
				throw new Error("HTTP/3 is not supported yet");
			default:
				throw new Error("Invalid HTTP version");
		}
	}

	listen(cb) {
		this.#socket.listen(async (req, res, err) => {
			const parser = load();
			// Allocate a memory in the WebAssembly space. This speeds up data copying to the WebAssembly layer.
			const ptr = milo.alloc(req.data.length);
			// Create a buffer we can use normally.
			const buffer = Buffer.from(milo.memory.buffer, ptr, req.data.length);
			buffer.set(req.data, 0);
			const consumed = milo.parse(parser, ptr, req.data.length);
			consumed.body = consumed.data;// rename data to body for compatibility with request

			console.log(consumed);

			const url = `${normalizeProtocol(data.protocol)}${this.hostname}:${this.port}${data.url}`;
			const request = new Request(url, consumed);
			milo.dealloc(ptr, req.data.length);
			milo.destroy(parser);

			const response = await cb(request, err);
			const responseStringified = await parseResponse(response, this.httpVersion);
			res.write(responseStringified);
		});
		return this;
	}

	close() {
		this.#socket.close();
		return this;
	}
}

function normalizeProtocol(protocol) {
	switch (protocol) {
		case "HTTP":
			return "http://";
		case "HTTPS":
			return "https://";
		default:
			break;
	}
}


export async function parseResponse(response, httpVersion) {
	let headers = "";
	for (const [key, value] of response.headers.entries()) {
		headers += `${key}: ${value}\r\n`;
	}
	const body = await response.text();
	return `HTTP/${httpVersion} ${response.status} ${response.statusText}\r\n${headers}\r\n${body}`;
}
