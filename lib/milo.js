import { Parser } from "@shogunpanda/milo";

function extractPayload(parser, from, size) {
	return parser.context.input.subarray(from, from + size);
}

function getValue(parser, name, from, size) {
	parser.context[name] = extractPayload(parser, from, size).toString("utf-8");
}

function onMethod(parser, from, size) {
	console.log("AO")
	return getValue(parser, "method", from, size);
}

function onUrl(parser, from, size) {
	return getValue(parser, "url", from, size);
}

function onProtocol(parser, from, size) {
	return getValue(parser, "protocol", from, size);
}

function onVersion(parser, from, size) {
	return getValue(parser, "version", from, size);
}

function onStatus(parser, from, size) {
	return getValue(parser, "status", from, size);
}

function onHeaderName(parser, from, size) {
	return getValue(parser, "header_name", from, size);
}

function onHeaderValue(parser, from, size) {
	return getValue(parser, "header_value", from, size);
}

function onBody(parser, from, size) {
	return extractPayload(parser, "body", parser.position, from, size);
}

function onData(parser, from, size) {
	return getValue(parser, "data", from, size);
}

export function load() {
	const parser = Parser.create();
	parser.setOnMethod(onMethod.bind(parser));
	parser.setOnUrl(onUrl.bind(parser));
	parser.setOnProtocol(onProtocol.bind(parser));
	parser.setOnVersion(onVersion.bind(parser));
	parser.setOnStatus(onStatus.bind(parser));
	parser.setOnHeaderName(onHeaderName.bind(parser));
	parser.setOnHeaderValue(onHeaderValue.bind(parser));
	parser.setOnBody(onBody.bind(parser));
	parser.setOnData(onData.bind(parser));
	return parser;
}
