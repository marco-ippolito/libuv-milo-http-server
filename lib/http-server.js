import { InboundTCPSocket } from "./socket.js";
import { load } from "./milo.js";

export class HttpServer {
	httpVersion;
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
			try {
				const parser = load();
				parser.parse(req.data, req.data.length);
				const data = parser.context.parsed;
				const url = `${normalizeProtocol(data.protocol)}${this.hostname}:${this.port}${data.url}`
				parser.context.parsed.body = data.data; // rename data to body for compatibility with request
				const request = new Request(url, parser.context.parsed);
				const response = await cb(request, err);
				res.write(response.parse(this.httpVersion));
			} catch (error) {
				console.log(error);
			}
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