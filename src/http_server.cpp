#include <napi.h>
#include <stdlib.h>
#include <stdio.h>
#include <vector>
#include "uv.h"
#include "assert.h"
#include "milo.h"
#include "http_server.h"

#define BACKLOG 511
#define HOST "0.0.0.0"

static uv_loop_t *loop;

static intptr_t on_method(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    milo_response *res = static_cast<milo_response *>(p->owner);
    res->method.assign(static_cast<const char *>(res->base) + position, size);
    return 0;
}

static intptr_t on_header_value(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    milo_response *res = static_cast<milo_response *>(p->owner);
    res->header_values.emplace_back(static_cast<const char *>(res->base) + position, size);
    return 0;
}

static intptr_t on_header_name(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    milo_response *res = static_cast<milo_response *>(p->owner);
    res->header_names.emplace_back(static_cast<const char *>(res->base) + position, size);
    return 0;
}

static intptr_t on_data(const milo::Parser *p, uintptr_t position, uintptr_t size)
{
    milo_response *res = static_cast<milo_response *>(p->owner);
    res->body.assign(static_cast<const char *>(res->base) + position, size);
    return 0;
}

static void after_read(uv_stream_t *client,
                       ssize_t nread,
                       const uv_buf_t *buf)
{
    if (nread <= 0)
    {
        free(buf->base);
        return;
    }

    milo_response *res = new milo_response;
    res->base = buf->base;

    milo::Parser *parser = milo::milo_create();
    parser->owner = res;
    parser->callbacks.on_method = on_method;
    parser->callbacks.on_header_value = on_header_value;
    parser->callbacks.on_header_name = on_header_name;
    parser->callbacks.on_data = on_data;

    milo::milo_parse(parser, (const unsigned char *)buf->base, nread);

    server_data *clientData = static_cast<server_data *>(client->data);

    Napi::Env env = clientData->callback.Env();

    Napi::Object response = Napi::Object::New(env);
    response.Set("method", Napi::String::New(env, res->method));
    response.Set("body", Napi::String::New(env, res->body));

    Napi::Array headerNamesArray = Napi::Array::New(env, res->header_names.size());
    for (size_t i = 0; i < res->header_names.size(); i++)
    {
        headerNamesArray.Set(i, Napi::String::New(env, res->header_names[i]));
    }
    response.Set("header_names", headerNamesArray);

    Napi::Array headerValuesArray = Napi::Array::New(env, res->header_values.size());
    for (size_t i = 0; i < res->header_values.size(); i++)
    {
        headerValuesArray.Set(i, Napi::String::New(env, res->header_values[i]));
    }
    response.Set("header_values", headerValuesArray);

    clientData->callback.Call(env.Global(), {response});

    free(res);
    free(parser);
}

static void allocator(uv_handle_t *handle,
                      size_t suggested_size,
                      uv_buf_t *buf)
{
    buf->base = (char *)malloc(suggested_size);
    buf->len = suggested_size;
}

static void on_connection(uv_stream_t *tcpServer, int status)
{
    uv_tcp_t *client = new uv_tcp_t;
    client->data = tcpServer->data;

    uv_tcp_init(loop, client);

    assert(uv_accept(tcpServer, (uv_stream_t *)client) == 0);

    uv_read_start((uv_stream_t *)client, allocator, after_read);
}

void MiloHttpServer::Listen(const Napi::CallbackInfo &info)
{
    uint16_t port = info[0].As<Napi::Number>().DoubleValue();

    server_data *serverData = new server_data;
    serverData->callback = Napi::Persistent(info[1].As<Napi::Function>());

    static uv_tcp_t tcpServer;
    uv_tcp_init(loop, &tcpServer);
    printf("Starting on %s:%d\n", HOST, port);

    struct sockaddr_in address;
    uv_ip4_addr(HOST, port, &address);

    uv_tcp_bind(&tcpServer, (const struct sockaddr *)&address, 0);
    tcpServer.data = serverData;

    uv_listen((uv_stream_t *)&tcpServer, BACKLOG, on_connection);
    uv_run(loop, UV_RUN_DEFAULT);
}

Napi::Function MiloHttpServer::GetClass(Napi::Env env)
{
    return DefineClass(
        env,
        "MiloHttpServer",
        {
            MiloHttpServer::InstanceMethod("listen", &MiloHttpServer::Listen),
        });
}

MiloHttpServer::MiloHttpServer(const Napi::CallbackInfo &info)
    : ObjectWrap(info)
{
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    loop = uv_default_loop();

    Napi::String name = Napi::String::New(env, "MiloHttpServer");
    exports.Set(name, MiloHttpServer::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init);
