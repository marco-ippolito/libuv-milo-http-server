#include "output.h"
#include "milo.h"

isize_t append_output(const milo::Parser* parser, uchar_t* message, const uchar_t* data, usize_t size) {
  if (data == NULL) {
  } else {
    uchar_t* string_data = create_string();
    strncpy(reinterpret_cast<char*>(string_data), reinterpret_cast<const char*>(data), size);
  }

  free(message);
  return 0;
}

isize_t event(const milo::Parser* parser, const char* name, usize_t position, const uchar_t* data, usize_t size) {
  auto message = create_string();
  return append_output(parser, message, data, size);
}

isize_t show_span(const milo::Parser* parser, const char* name, const uchar_t* data, usize_t size) {
  auto context = reinterpret_cast<context_t*>(parser->owner);
  uchar_t* string_data = create_string();
  strncpy(reinterpret_cast<char*>(string_data), reinterpret_cast<const char*>(data), size);

  if (strcmp(name, "method") == 0) {
    context->method = string_data;
  } else if (strcmp(name, "url") == 0) {
    context->url = string_data;
  } else if (strcmp(name, "protocol") == 0) {
    context->protocol = string_data;
  } else if (strcmp(name, "version") == 0) {
    context->version = string_data;
  } else {
    free(string_data);
  }

  return event(parser, name, parser->position, data, size);
}
