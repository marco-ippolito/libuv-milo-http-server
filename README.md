### libuv-http-server

Small http server with libuv and milo bind with node
Rust is required.
To compile milo:

- `cargo install wasm-pack`
- `cargo install cbindgen`
- `cargo install --force cargo-make`
- `makers all`

Run:

- `npm run build` to build the `.node` addon
- `npm run start` to start the server

You can use curl to test the server:

`curl localhost:8000 -H "Foo:Bar" -d "Hello World"`
