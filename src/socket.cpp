#include <napi.h>
#include <uv.h>
#include "socket.h"

#define BACKLOG 511

Napi::Object Socket::Init(Napi::Env env, Napi::Object exports)
{
    Napi::Function func =
        DefineClass(env,
                    "Socket",
                    {Socket::InstanceMethod("listen", &Socket::Listen),
                     Socket::InstanceAccessor("port", &Socket::GetPort, nullptr),
                     Socket::InstanceAccessor("hostname", &Socket::GetHostname, nullptr)});

    Napi::FunctionReference *constructor = new Napi::FunctionReference();
    *constructor = Napi::Persistent(func);
    env.SetInstanceData(constructor);

    Napi::String name = Napi::String::New(env, "Socket");
    exports.Set(name, func);
    return exports;
}

Napi::Value Socket::GetPort(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    return Napi::Number::New(env, (double)(this->_port));
}

Napi::Value Socket::GetHostname(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    return Napi::String::New(env, this->_hostname);
}

Socket::Socket(const Napi::CallbackInfo &info)
    : Napi::ObjectWrap<Socket>(info)
{
    Napi::Object options = info[0].As<Napi::Object>();
    this->_port = options.Get("port").As<Napi::Number>().Uint32Value();
    this->_hostname = options.Get("hostname").As<Napi::String>().Utf8Value();
}

void on_close(uv_handle_t *handle)
{
    free(handle);
}

static void allocator(uv_handle_t *handle,
                      size_t suggested_size,
                      uv_buf_t *buf)
{
    buf->base = (char *)malloc(suggested_size);
    buf->len = suggested_size;
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
    server_data *clientData = (server_data *)(client->data);
    Napi::Env env = clientData->callback.Env();
    Napi::HandleScope scope(env);
    Napi::Object response = Napi::Object::New(env);
    response.Set("data", Napi::String::New(env, buf->base, nread));
    clientData->callback.Call(env.Global(), {response});
    free(buf->base);
    free(clientData);
    return;
}

static void on_connection(uv_stream_t *tcpServer, int status)
{
    const server_data *serverData = (server_data *)tcpServer->data;
    uv_loop_t *eventLoop = serverData->eventLoop;
    uv_tcp_t *client = (uv_tcp_t *)malloc(sizeof(uv_tcp_t));

    client->data = tcpServer->data;
    int result = 0;
    result = uv_tcp_init(eventLoop, client);

    if (result != 0)
    {
        printf("error on uv_tcp_init %s\n", uv_err_name(result));
        uv_close((uv_handle_t *)client, on_close);
    }

    result = uv_accept(tcpServer, (uv_stream_t *)client);
    if (result != 0)
    {
        printf("error on uv_accept %s\n", uv_err_name(result));
        uv_close((uv_handle_t *)client, on_close);
    }

    result = uv_read_start((uv_stream_t *)client, allocator, after_read);
    if (result != 0)
    {
        printf("error on uv_read_start %s\n", uv_err_name(result));
        uv_close((uv_handle_t *)client, on_close);
    }
}

void Socket::Listen(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    uv_loop_t *eventLoop;
    napi_status status = napi_get_uv_event_loop(env, &eventLoop);
    NAPI_THROW_IF_FAILED(env, status);

    int result = 0;
    static uv_tcp_t tcpServer;
    result = uv_tcp_init(eventLoop, &tcpServer);
    if (result != 0)
    {
        printf("error on uv_tcp_init %s\n", uv_err_name(result));
        return;
    }

    struct sockaddr_in address;
    result = uv_ip4_addr(this->_hostname.c_str(), (int)(this->_port), &address);
    if (result != 0)
    {
        printf("error on uv_ip4_addr %s\n", uv_err_name(result));
        return;
    }

    result = uv_tcp_bind(&tcpServer, (const struct sockaddr *)&address, 0);
    if (result != 0)
    {
        printf("error on uv_tcp_bind %s\n", uv_err_name(result));
        return;
    }

    server_data *serverData = (server_data *)malloc(sizeof(server_data));
    serverData->callback = Napi::Persistent(info[0].As<Napi::Function>());
    serverData->eventLoop = eventLoop;
    tcpServer.data = serverData;

    result = uv_listen((uv_stream_t *)&tcpServer, BACKLOG, on_connection);
    if (result != 0)
    {
        free(tcpServer.data);
        free(serverData);
        printf("error on uv_listen %s\n", uv_err_name(result));
        return;
    }
}
