import { Parser } from "@shogunpanda/milo";

const lastHeaderName = Symbol("lastHeaderName");

function extractPayload(parser, from, size) {
	return parser.context.input.subarray(from, from + size);
}

function getValue(parser, name, from, size) {
	parser.context.parsed[name] = extractPayload(parser, from, size).toString(
		"utf-8",
	);
	return 0;
}

function onReason(parser, from, size) {
	return getValue(parser, "reason", from, size);
}

function onMethod(parser, from, size) {
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
	parser.context.parsed.headers[lastHeaderName] = extractPayload(
		parser,
		from,
		size,
	).toString("utf-8");
	return 0;
}

function onHeaderValue(parser, from, size) {
	parser.context.parsed.headers[parser.context.parsed.headers[lastHeaderName]] =
		extractPayload(parser, from, size).toString("utf-8");
	return 0;
}

function onData(parser, from, size) {
	return getValue(parser, "data", from, size);
}

function onHeaders(parser) {
	delete parser.context.parsed.headers[lastHeaderName];
	return 0;
}

export function load() {
	const parser = Parser.create();
	parser.context.parsed = { headers: {} };
	parser.setOnMethod(onMethod.bind(null, parser));
	parser.setOnUrl(onUrl.bind(null, parser));
	parser.setOnProtocol(onProtocol.bind(null, parser));
	parser.setOnVersion(onVersion.bind(null, parser));
	parser.setOnReason(onReason.bind(null, parser));
	parser.setOnStatus(onStatus.bind(null, parser));
	parser.setOnHeaderName(onHeaderName.bind(null, parser));
	parser.setOnHeaderValue(onHeaderValue.bind(null, parser));
	parser.setOnData(onData.bind(null, parser));
	parser.setOnHeaders(onHeaders.bind(null, parser));
	return parser;
}
