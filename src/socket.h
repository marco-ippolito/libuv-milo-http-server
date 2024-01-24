#include <napi.h>
#include <uv.h>

class Socket : public Napi::ObjectWrap<Socket>
{
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    Socket(const Napi::CallbackInfo &info);

private:
    Napi::Value GetPort(const Napi::CallbackInfo &info);
    Napi::Value GetHostname(const Napi::CallbackInfo &info);
    void Listen(const Napi::CallbackInfo &info);
    uint32_t _port;
    std::string _hostname;
};

struct server_data
{
    Napi::FunctionReference callback;
    uv_loop_t *eventLoop;
};
