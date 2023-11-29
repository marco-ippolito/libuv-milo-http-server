{
    "targets": [{
        "target_name": "http-server-addon",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "src/http_server.cpp",
            "src/http_server.h",
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")",
            "deps/milo/parser/dist/cpp/release-all-callbacks/"
        ],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")",
            "deps/libuv/uv.gyp:libuv"
        ],
        'libraries': ['../deps/milo/parser/dist/cpp/release-all-callbacks/libmilo.a'],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
        'cflags': [ '-stdlib=libc++' ],
    }]
}