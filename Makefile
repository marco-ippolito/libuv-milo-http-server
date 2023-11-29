webserver: src/main.cpp libuv
	g++ -std=c++17 -stdlib=libc++ -o out/webserver src/main.cpp deps/libuv/.libs/libuv.a  deps/milo/parser/dist/cpp/release-all-callbacks/libmilo.a -I deps/milo/parser/dist/cpp/release-all-callbacks 

libuv:
	$(MAKE) -C deps/libuv
