import { Parser } from "@shogunpanda/milo";

const lastHeaderName = Symbol("lastHeaderName");

function extractPayload(from, size) {
	return this.context.input.subarray(from, from + size);
}

function getValue(name, from, size) {
	this.context.parsed[name] = extractPayload.call(this, from, size).toString(
		"utf-8",
	);
	return 0;
}

function onReason(from, size) {
	return getValue.call(this, "reason", from, size);
}

function onMethod(from, size) {
	return getValue.call(this, "method", from, size);
}

function onUrl(from, size) {
	return getValue.call(this, "url", from, size);
}

function onProtocol(from, size) {
	return getValue.call(this, "protocol", from, size);
}

function onVersion(from, size) {
	return getValue.call(this, "version", from, size);
}

function onStatus(from, size) {
	return getValue.call(this, "status", from, size);
}

function onHeaderName(from, size) {
	this.context.parsed.headers[lastHeaderName] = extractPayload.call(
		this,
		from,
		size,
	).toString("utf-8");
	return 0;
}

function onHeaderValue(from, size) {
	this.context.parsed.headers[this.context.parsed.headers[lastHeaderName]] =
		extractPayload.call(this, from, size).toString("utf-8");
	return 0;
}

function onData(from, size) {
	return getValue.call(this, "data", from, size);
}

function onHeaders() {
	delete this.context.parsed.headers[lastHeaderName];
	return 0;
}

export function load() {
	const parser = Parser.create();
	parser.context.parsed = { headers: {} };
	parser.setOnMethod(onMethod.bind(parser));
	parser.setOnUrl(onUrl.bind(parser));
	parser.setOnProtocol(onProtocol.bind(parser));
	parser.setOnVersion(onVersion.bind(parser));
	parser.setOnReason(onReason.bind(parser));
	parser.setOnStatus(onStatus.bind(parser));
	parser.setOnHeaderName(onHeaderName.bind(parser));
	parser.setOnHeaderValue(onHeaderValue.bind(parser));
	parser.setOnData(onData.bind(parser));
	parser.setOnHeaders(onHeaders.bind(parser));
	return parser;
}
