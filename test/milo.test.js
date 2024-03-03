import { load } from '../lib/milo.js';

const request = Buffer.from('GET /foo/bar HTTP/1.')
const parser = await load();
const status = parser.parse(request, request.length);
console.log(status);