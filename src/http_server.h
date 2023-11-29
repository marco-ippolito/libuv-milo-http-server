#pragma once
#include <napi.h>

class MiloHttpServer : public Napi::ObjectWrap<MiloHttpServer>
{
public:
    MiloHttpServer(const Napi::CallbackInfo &info);
    void Listen(const Napi::CallbackInfo &info);
    static Napi::Function GetClass(Napi::Env);
};

struct milo_response
{
    const char *base;
    std::string method;
    std::vector<std::string> header_values;
    std::vector<std::string> header_names;
    std::string body;
};

struct server_data
{
    Napi::FunctionReference callback;
};
