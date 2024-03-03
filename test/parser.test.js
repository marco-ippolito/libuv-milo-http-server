import { load } from '../lib/milo.js';

const parser = load();
const request = Buffer.from('GET / HTTP/1.1\r\n\r\n')
parser.parse(request, request.length);
console.log(parser.context.method);