#include <stdlib.h>
#include <stdio.h>
#include "string.h"
#include "uv.h"
#include "assert.h"
#include "milo.h"

// The backlog argument defines the maximum length to which the
// queue of pending connections for sockfd may grow.  If a
// connection request arrives when the queue is full, the client may
// receive an error with an indication of ECONNREFUSED
#define BACKLOG 511
#define PORT 8000
#define HOST "0.0.0.0"

static uv_loop_t *loop;
static uv_tcp_t tcpServer;
static milo::Parser *parser;

static intptr_t on_method(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    char *content = reinterpret_cast<char *>(malloc(sizeof(char) * 1000));

    // Rust internall uses unsigned chars for string, so we need to cast.
    strncpy(content, reinterpret_cast<const char *>(p->owner) + position, size);


    printf("Method: %s\n", content);
    free(content);

    // All good, let's return.
    return 0;
};

static intptr_t on_header_value(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    char *content = reinterpret_cast<char *>(malloc(sizeof(char) * 1000));

    // Rust internall uses unsigned chars for string, so we need to cast.
    strncpy(content, reinterpret_cast<const char *>(p->owner) + position, size);

    printf("Header value: %s\n", content);
    free(content);

    // All good, let's return.
    return 0;
};

static intptr_t on_header_name(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    char *content = reinterpret_cast<char *>(malloc(sizeof(char) * 1000));

    // Rust internall uses unsigned chars for string, so we need to cast.
    strncpy(content, reinterpret_cast<const char *>(p->owner) + position, size);

    printf("Header name: %s\n", content);
    free(content);

    // All good, let's return.
    return 0;
};

static void after_read(uv_stream_t *handle,
                       ssize_t nread,
                       const uv_buf_t *buf)
{

    printf("after reading\n");

    uv_shutdown_t *sreq;

    // nothing to read if 0 or EOF if < 0
    if (nread <= 0)
    {
        free(buf->base);
        return;
    }

    parser->owner = buf->base;
    parser->callbacks.on_method = on_method;
    parser->callbacks.on_header_value = on_header_value;
    parser->callbacks.on_header_name = on_header_name;

    uintptr_t r = milo::milo_parse(parser, (const unsigned char *)buf->base, nread);

    assert(r > 0);
}

// we have to allocate manually all chunks of data we receive
static void allocator(uv_handle_t *handle,
                      size_t suggested_size,
                      uv_buf_t *buf)
{
    buf->base = (char *)malloc(suggested_size);
    buf->len = suggested_size;
}

static void on_connection(uv_stream_t *server, int status)
{

    printf("on connection\n");

    if (status < 0)
    {
        fprintf(stderr, "listen error: %s\n", uv_strerror(status));
        return;
    }

    uv_tcp_t *client = (uv_tcp_t *)malloc(sizeof(uv_tcp_t));

    // initialize the client handle
    uv_tcp_init(loop, client);

    assert(uv_accept(server, (uv_stream_t *)client) == 0);

    printf("connection accepted\n");

    uv_read_start((uv_stream_t *)client, allocator, after_read);
}

int main()
{
    struct sockaddr_in address;
    loop = uv_default_loop();
    parser = milo::milo_create();
    uv_tcp_init(loop, &tcpServer);
    uv_ip4_addr(HOST, PORT, &address);
    uv_tcp_bind(&tcpServer, (const struct sockaddr *)&address, 0);

    uv_listen((uv_stream_t *)&tcpServer, BACKLOG, on_connection);
    uv_run(loop, UV_RUN_DEFAULT);
}
