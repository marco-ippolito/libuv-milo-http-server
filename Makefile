webserver: src/main.cpp libuv
	gcc -std=c++17 -o out/webserver src/main.cpp deps/uv/.libs/libuv.a  deps/milo/parser/dist/cpp/release-all-callbacks/libmilo.a -I deps/milo/parser/dist/cpp/release-all-callbacks 

libuv:
	$(MAKE) -C deps/uv
