import { deepStrictEqual, strictEqual } from 'node:assert'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { test } from 'node:test'

function parseNDJSON(raw) {
  return raw
    .trim()
    .replaceAll(/\n+\s*[-]+\n+/gm, '\n')
    .replaceAll(/^\s+/gm, '')
    .trim()
    .split('\n')
    .map(i => JSON.parse(i.trim()))
}

function verifyOutput(executable, expected) {
  const actual = spawnSync(resolve(process.cwd(), 'dist', executable)).stdout.toString('utf-8')

  const actualLines = parseNDJSON(actual)
  const expectedLines = parseNDJSON(expected)

  strictEqual(actualLines.length, expectedLines.length, 'Output length differs')
  for (let i = 0; i < expectedLines.length; i++) {
    deepStrictEqual(actualLines[i], expectedLines[i], `Line ${i + 1} differs`)
  }
}

function releaseOutputDefault() {
  return `
    { "pos": 0, "event": "begin", "configuration": { "debug": false, "all-callbacks": false }, "data": null }
    { "pos": 16, "event": "request", "data": null }
    { "pos": 0, "event": "method", "data": "GET" }
    { "pos": 4, "event": "url", "data": "/" }
    { "pos": 6, "event": "protocol", "data": "HTTP" }
    { "pos": 11, "event": "version", "data": "1.1" }
    { "pos": 18, "event": "headers", "type": "request", "method": "GET", "url": "/", "protocol": "HTTP", "version": "1.1", "body": null, "data": null }
    { "pos": 18, "event": "complete", "data": null }
    { "pos": 18, "consumed": 18, "state": "START" }
    
    ------------------------------------------------------------------------------------------
    
    { "pos": 0, "event": "begin", "configuration": { "debug": false, "all-callbacks": false }, "data": null }
    { "pos": 17, "event": "response", "data": null }
    { "pos": 0, "event": "protocol", "data": "HTTP" }
    { "pos": 5, "event": "version", "data": "1.1" }
    { "pos": 9, "event": "status", "data": "200" }
    { "pos": 13, "event": "reason", "data": "OK" }
    { "pos": 17, "event": "header_name", "data": "Transfer-Encoding" }
    { "pos": 36, "event": "header_value", "data": "chunked" }
    { "pos": 45, "event": "header_name", "data": "Trailer" }
    { "pos": 54, "event": "header_value", "data": "x-trailer" }
    { "pos": 67, "event": "headers", "type": "response", "status": 200, "protocol": "HTTP", "version": "1.1", "body": "chunked", "data": null }
    { "pos": 67, "event": "chunk_length", "data": "c" }
    { "pos": 69, "event": "chunk_extensions_name", "data": "need" }
    { "pos": 74, "event": "chunk_extension_value", "data": "love" }
    { "pos": 80, "event": "chunk", "data": null }
    { "pos": 80, "event": "body", "data": null }
    { "pos": 80, "event": "data", "data": "hello world!" }
    { "pos": 94, "event": "chunk_length", "data": "0" }
    { "pos": 97, "event": "chunk", "data": null }
    { "pos": 97, "event": "body", "data": null }
    { "pos": 97, "event": "trailer_name", "data": "X-Trailer" }
    { "pos": 108, "event": "trailer_value", "data": "value" }
    { "pos": 108, "event": "trailers", "data": null }
    { "pos": 108, "event": "complete", "data": null }
    { "pos": 117, "consumed": 117, "state": "START" }
  `
}

function releaseOutputAllCallbacks() {
  return `
    { "pos": 0, "event": "begin", "configuration": { "debug": false, "all-callbacks": true }, "data": null }
    { "pos": 0, "event": "method", "data": "GET" }
    { "pos": 4, "event": "url", "data": "/" }
    { "pos": 6, "event": "protocol", "data": "HTTP" }
    { "pos": 11, "event": "version", "data": "1.1" }
    { "pos": 16, "event": "request", "data": null }
    { "pos": 18, "event": "headers", "type": "request", "method": "GET", "url": "/", "protocol": "HTTP", "version": "1.1", "body": null, "data": null }
    { "pos": 18, "event": "complete", "data": null }
    { "pos": 18, "consumed": 18, "state": "START" }
    
    ------------------------------------------------------------------------------------------
    
    { "pos": 0, "event": "begin", "configuration": { "debug": false, "all-callbacks": true }, "data": null }
    { "pos": 0, "event": "protocol", "data": "HTTP" }
    { "pos": 5, "event": "version", "data": "1.1" }
    { "pos": 9, "event": "status", "data": "200" }
    { "pos": 13, "event": "reason", "data": "OK" }
    { "pos": 17, "event": "response", "data": null }
    { "pos": 17, "event": "header_name", "data": "Transfer-Encoding" }
    { "pos": 36, "event": "header_value", "data": "chunked" }
    { "pos": 45, "event": "header_name", "data": "Trailer" }
    { "pos": 54, "event": "header_value", "data": "x-trailer" }
    { "pos": 67, "event": "headers", "type": "response", "status": 200, "protocol": "HTTP", "version": "1.1", "body": "chunked", "data": null }
    { "pos": 67, "event": "chunk_length", "data": "c" }
    { "pos": 69, "event": "chunk_extensions_name", "data": "need" }
    { "pos": 74, "event": "chunk_extension_value", "data": "love" }
    { "pos": 80, "event": "chunk", "data": null }
    { "pos": 80, "event": "body", "data": null }
    { "pos": 80, "event": "data", "data": "hello world!" }
    { "pos": 94, "event": "chunk_length", "data": "0" }
    { "pos": 97, "event": "chunk", "data": null }
    { "pos": 97, "event": "body", "data": null }
    { "pos": 97, "event": "trailer_name", "data": "X-Trailer" }
    { "pos": 108, "event": "trailer_value", "data": "value" }
    { "pos": 108, "event": "trailers", "data": null }
    { "pos": 108, "event": "complete", "data": null }
    { "pos": 117, "consumed": 117, "state": "START" }
  `
}

function debugOutputDefault() {
  return `
    { "pos": 0, "event": "before_state_change", "current_state": "START", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "begin", "configuration": { "debug": true, "all-callbacks": false }, "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "REQUEST", "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "REQUEST", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "REQUEST_METHOD", "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "REQUEST_METHOD", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "REQUEST_URL", "data": null }
    { "pos": 4, "event": "before_state_change", "current_state": "REQUEST_URL", "data": null }
    { "pos": 4, "event": "after_state_change", "current_state": "REQUEST_PROTOCOL", "data": null }
    { "pos": 10, "event": "before_state_change", "current_state": "REQUEST_PROTOCOL", "data": null }
    { "pos": 10, "event": "after_state_change", "current_state": "REQUEST_VERSION", "data": null }
    { "pos": 16, "event": "request", "data": null }
    { "pos": 16, "event": "before_state_change", "current_state": "REQUEST_VERSION", "data": null }
    { "pos": 16, "event": "after_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 16, "event": "before_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 16, "event": "after_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 0, "event": "method", "data": "GET" }
    { "pos": 4, "event": "url", "data": "/" }
    { "pos": 6, "event": "protocol", "data": "HTTP" }
    { "pos": 11, "event": "version", "data": "1.1" }
    { "pos": 18, "event": "headers", "type": "request", "method": "GET", "url": "/", "protocol": "HTTP", "version": "1.1", "body": null, "data": null }
    { "pos": 18, "event": "complete", "data": null }
    { "pos": 18, "event": "before_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 18, "event": "after_state_change", "current_state": "START", "data": null }
    { "pos": 18, "consumed": 18, "state": "START" }
    
    ------------------------------------------------------------------------------------------
    
    { "pos": 0, "event": "before_state_change", "current_state": "START", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "begin", "configuration": { "debug": true, "all-callbacks": false }, "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "RESPONSE", "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "RESPONSE", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "RESPONSE_VERSION", "data": null }
    { "pos": 5, "event": "before_state_change", "current_state": "RESPONSE_VERSION", "data": null }
    { "pos": 5, "event": "after_state_change", "current_state": "RESPONSE_STATUS", "data": null }
    { "pos": 9, "event": "before_state_change", "current_state": "RESPONSE_STATUS", "data": null }
    { "pos": 9, "event": "after_state_change", "current_state": "RESPONSE_REASON", "data": null }
    { "pos": 17, "event": "response", "data": null }
    { "pos": 17, "event": "before_state_change", "current_state": "RESPONSE_REASON", "data": null }
    { "pos": 17, "event": "after_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 17, "event": "before_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 17, "event": "after_state_change", "current_state": "HEADER_TRANSFER_ENCODING", "data": null }
    { "pos": 36, "event": "before_state_change", "current_state": "HEADER_TRANSFER_ENCODING", "data": null }
    { "pos": 36, "event": "after_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 45, "event": "before_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 45, "event": "after_state_change", "current_state": "HEADER_VALUE", "data": null }
    { "pos": 63, "event": "before_state_change", "current_state": "HEADER_VALUE", "data": null }
    { "pos": 63, "event": "after_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 0, "event": "protocol", "data": "HTTP" }
    { "pos": 5, "event": "version", "data": "1.1" }
    { "pos": 9, "event": "status", "data": "200" }
    { "pos": 13, "event": "reason", "data": "OK" }
    { "pos": 17, "event": "header_name", "data": "Transfer-Encoding" }
    { "pos": 36, "event": "header_value", "data": "chunked" }
    { "pos": 45, "event": "header_name", "data": "Trailer" }
    { "pos": 54, "event": "header_value", "data": "x-trailer" }
    { "pos": 67, "event": "headers", "type": "response", "status": 200, "protocol": "HTTP", "version": "1.1", "body": "chunked", "data": null }
    { "pos": 67, "event": "before_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 67, "event": "after_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 67, "event": "before_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 67, "event": "after_state_change", "current_state": "CHUNK_EXTENSION_NAME", "data": null }
    { "pos": 69, "event": "before_state_change", "current_state": "CHUNK_EXTENSION_NAME", "data": null }
    { "pos": 69, "event": "after_state_change", "current_state": "CHUNK_EXTENSION_VALUE", "data": null }
    { "pos": 74, "event": "before_state_change", "current_state": "CHUNK_EXTENSION_VALUE", "data": null }
    { "pos": 74, "event": "after_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 67, "event": "chunk_length", "data": "c" }
    { "pos": 69, "event": "chunk_extensions_name", "data": "need" }
    { "pos": 74, "event": "chunk_extension_value", "data": "love" }
    { "pos": 80, "event": "chunk", "data": null }
    { "pos": 80, "event": "body", "data": null }
    { "pos": 80, "event": "data", "data": "hello world!" }
    { "pos": 80, "event": "before_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 80, "event": "after_state_change", "current_state": "CHUNK_END", "data": null }
    { "pos": 92, "event": "before_state_change", "current_state": "CHUNK_END", "data": null }
    { "pos": 92, "event": "after_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 94, "event": "before_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 94, "event": "after_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 94, "event": "chunk_length", "data": "0" }
    { "pos": 97, "event": "chunk", "data": null }
    { "pos": 97, "event": "body", "data": null }
    { "pos": 97, "event": "before_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 97, "event": "after_state_change", "current_state": "TRAILER_NAME", "data": null }
    { "pos": 97, "event": "before_state_change", "current_state": "TRAILER_NAME", "data": null }
    { "pos": 97, "event": "after_state_change", "current_state": "TRAILER_VALUE", "data": null }
    { "pos": 97, "event": "trailer_name", "data": "X-Trailer" }
    { "pos": 108, "event": "trailer_value", "data": "value" }
    { "pos": 108, "event": "trailers", "data": null }
    { "pos": 108, "event": "complete", "data": null }
    { "pos": 108, "event": "before_state_change", "current_state": "TRAILER_VALUE", "data": null }
    { "pos": 108, "event": "after_state_change", "current_state": "START", "data": null }
    { "pos": 117, "consumed": 117, "state": "START" }
  `
}

function debugOutputAllCallbacks() {
  return `
    { "pos": 0, "event": "before_state_change", "current_state": "START", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "begin", "configuration": { "debug": true, "all-callbacks": true }, "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "REQUEST", "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "REQUEST", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "REQUEST_METHOD", "data": null }
    { "pos": 0, "event": "method", "data": "GET" }
    { "pos": 0, "event": "before_state_change", "current_state": "REQUEST_METHOD", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "REQUEST_URL", "data": null }
    { "pos": 4, "event": "url", "data": "/" }
    { "pos": 4, "event": "before_state_change", "current_state": "REQUEST_URL", "data": null }
    { "pos": 4, "event": "after_state_change", "current_state": "REQUEST_PROTOCOL", "data": null }
    { "pos": 6, "event": "protocol", "data": "HTTP" }
    { "pos": 10, "event": "before_state_change", "current_state": "REQUEST_PROTOCOL", "data": null }
    { "pos": 10, "event": "after_state_change", "current_state": "REQUEST_VERSION", "data": null }
    { "pos": 11, "event": "version", "data": "1.1" }
    { "pos": 16, "event": "request", "data": null }
    { "pos": 16, "event": "before_state_change", "current_state": "REQUEST_VERSION", "data": null }
    { "pos": 16, "event": "after_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 16, "event": "before_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 16, "event": "after_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 18, "event": "headers", "type": "request", "method": "GET", "url": "/", "protocol": "HTTP", "version": "1.1", "body": null, "data": null }
    { "pos": 18, "event": "complete", "data": null }
    { "pos": 18, "event": "before_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 18, "event": "after_state_change", "current_state": "START", "data": null }
    { "pos": 18, "consumed": 18, "state": "START" }
    
    ------------------------------------------------------------------------------------------
    
    { "pos": 0, "event": "before_state_change", "current_state": "START", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "begin", "configuration": { "debug": true, "all-callbacks": true }, "data": null }
    { "pos": 0, "event": "before_state_change", "current_state": "MESSAGE", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "RESPONSE", "data": null }
    { "pos": 0, "event": "protocol", "data": "HTTP" }
    { "pos": 0, "event": "before_state_change", "current_state": "RESPONSE", "data": null }
    { "pos": 0, "event": "after_state_change", "current_state": "RESPONSE_VERSION", "data": null }
    { "pos": 5, "event": "version", "data": "1.1" }
    { "pos": 5, "event": "before_state_change", "current_state": "RESPONSE_VERSION", "data": null }
    { "pos": 5, "event": "after_state_change", "current_state": "RESPONSE_STATUS", "data": null }
    { "pos": 9, "event": "status", "data": "200" }
    { "pos": 9, "event": "before_state_change", "current_state": "RESPONSE_STATUS", "data": null }
    { "pos": 9, "event": "after_state_change", "current_state": "RESPONSE_REASON", "data": null }
    { "pos": 13, "event": "reason", "data": "OK" }
    { "pos": 17, "event": "response", "data": null }
    { "pos": 17, "event": "before_state_change", "current_state": "RESPONSE_REASON", "data": null }
    { "pos": 17, "event": "after_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 17, "event": "header_name", "data": "Transfer-Encoding" }
    { "pos": 17, "event": "before_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 17, "event": "after_state_change", "current_state": "HEADER_TRANSFER_ENCODING", "data": null }
    { "pos": 36, "event": "header_value", "data": "chunked" }
    { "pos": 36, "event": "before_state_change", "current_state": "HEADER_TRANSFER_ENCODING", "data": null }
    { "pos": 36, "event": "after_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 45, "event": "header_name", "data": "Trailer" }
    { "pos": 45, "event": "before_state_change", "current_state": "HEADER_NAME", "data": null }
    { "pos": 45, "event": "after_state_change", "current_state": "HEADER_VALUE", "data": null }
    { "pos": 54, "event": "header_value", "data": "x-trailer" }
    { "pos": 63, "event": "before_state_change", "current_state": "HEADER_VALUE", "data": null }
    { "pos": 63, "event": "after_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 67, "event": "headers", "type": "response", "status": 200, "protocol": "HTTP", "version": "1.1", "body": "chunked", "data": null }
    { "pos": 67, "event": "before_state_change", "current_state": "HEADERS", "data": null }
    { "pos": 67, "event": "after_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 67, "event": "chunk_length", "data": "c" }
    { "pos": 67, "event": "before_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 67, "event": "after_state_change", "current_state": "CHUNK_EXTENSION_NAME", "data": null }
    { "pos": 69, "event": "chunk_extensions_name", "data": "need" }
    { "pos": 69, "event": "before_state_change", "current_state": "CHUNK_EXTENSION_NAME", "data": null }
    { "pos": 69, "event": "after_state_change", "current_state": "CHUNK_EXTENSION_VALUE", "data": null }
    { "pos": 74, "event": "chunk_extension_value", "data": "love" }
    { "pos": 74, "event": "before_state_change", "current_state": "CHUNK_EXTENSION_VALUE", "data": null }
    { "pos": 74, "event": "after_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 80, "event": "chunk", "data": null }
    { "pos": 80, "event": "body", "data": null }
    { "pos": 80, "event": "data", "data": "hello world!" }
    { "pos": 80, "event": "before_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 80, "event": "after_state_change", "current_state": "CHUNK_END", "data": null }
    { "pos": 92, "event": "before_state_change", "current_state": "CHUNK_END", "data": null }
    { "pos": 92, "event": "after_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 94, "event": "chunk_length", "data": "0" }
    { "pos": 94, "event": "before_state_change", "current_state": "CHUNK_LENGTH", "data": null }
    { "pos": 94, "event": "after_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 97, "event": "chunk", "data": null }
    { "pos": 97, "event": "body", "data": null }
    { "pos": 97, "event": "before_state_change", "current_state": "CHUNK_DATA", "data": null }
    { "pos": 97, "event": "after_state_change", "current_state": "TRAILER_NAME", "data": null }
    { "pos": 97, "event": "trailer_name", "data": "X-Trailer" }
    { "pos": 97, "event": "before_state_change", "current_state": "TRAILER_NAME", "data": null }
    { "pos": 97, "event": "after_state_change", "current_state": "TRAILER_VALUE", "data": null }
    { "pos": 108, "event": "trailer_value", "data": "value" }
    { "pos": 108, "event": "trailers", "data": null }
    { "pos": 108, "event": "complete", "data": null }
    { "pos": 108, "event": "before_state_change", "current_state": "TRAILER_VALUE", "data": null }
    { "pos": 108, "event": "after_state_change", "current_state": "START", "data": null }
    { "pos": 117, "consumed": 117, "state": "START" }
  `
}

test('reference-release-default', t => {
  verifyOutput('reference-release-default', releaseOutputDefault())
})

test('reference-release-all-callbacks', t => {
  verifyOutput('reference-release-all-callbacks', releaseOutputAllCallbacks())
})

test('reference-debug-default', async t => {
  verifyOutput('reference-debug-default', debugOutputDefault())
})

test('reference-debug-all-callbacks', async t => {
  verifyOutput('reference-debug-all-callbacks', debugOutputAllCallbacks())
})
