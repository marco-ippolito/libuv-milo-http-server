import milo from "@perseveranza-pets/milo";

const lastHeaderName = Symbol("lastHeaderName");

function extractPayload(context, from, size) {
	return context.input.subarray(from, from + size);
}

function getValue(context, name, from, size) {
	context.parsed[name] = extractPayload(context, from, size).toString("utf-8");
	return 0;
}

function onReason(p, from, size) {
	return getValue(this.context, "reason", from, size);
}

function onMethod(p, from, size) {
	return getValue(this.context, "method", from, size);
}

function onUrl(p, from, size) {
	return getValue(this.context, "url", from, size);
}

function onProtocol(p, from, size) {
	return getValue(this.context, "protocol", from, size);
}

function onVersion(p, from, size) {
	return getValue(this.context, "version", from, size);
}

function onStatus(p, from, size) {
	const context = this.context;
	return getValue(context, "status", from, size);
}

function onHeaderName(p, from, size) {
	this.context.parsed.headers[lastHeaderName] = extractPayload(
		this.context,
		from,
		size,
	).toString("utf-8");
	return 0;
}

function onHeaderValue(p, from, size) {
	this.context.parsed.headers[this.context.parsed.headers[lastHeaderName]] =
		extractPayload(this.context, from, size).toString("utf-8");
	return 0;
}

function onData(p, from, size) {
	return getValue(this.context, "data", from, size);
}

function onHeaders() {
	delete this.context.parsed.headers[lastHeaderName];
	return 0;
}

export function load() {
	const parser = milo.create();
	parser.context.parsed = { headers: {} };
	parser.setOnMethod(parser, onMethod);
	parser.setOnUrl(parser, onUrl);
	parser.setOnProtocol(parser, onProtocol);
	parser.setOnVersion(parser, onVersion);
	parser.setOnReason(parser, onReason);
	parser.setOnStatus(parser, onStatus);
	parser.setOnHeaderName(parser, onHeaderName);
	parser.setOnHeaderValue(parser, onHeaderValue);
	parser.setOnData(parser, onData);
	parser.setOnHeaders(parser, onHeaders);
	return parser;
}
