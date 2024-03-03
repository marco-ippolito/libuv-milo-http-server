import milo from "@shogunpanda/milo";

function onMethod(parser, from, size) {
    console.log('FOO', from, size);
    return 0;
}

export async function load() {
	const acc = {};
	const parser = milo.Parser.create();
    parser.setOnMethod(onMethod.bind(milo, parser));
	return parser;
}
