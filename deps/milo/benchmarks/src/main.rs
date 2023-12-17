#![allow(unused_attributes)]
#![feature(test)]

use std::time::Instant;

use milo::Parser;
use milo_test_utils::http;

#[path = "../tests/benchmarks.rs"]
mod benchmark;

fn main() {
  let mut samples = vec![];

  samples.push(
    (
      "seanmonstar_httparse",
      http(
        r#"
          GET /wp-content/uploads/2010/03/hello-kitty-darth-vader-pink.jpg HTTP/1.1\r\n
          Host: www.kittyhell.com\r\n
          User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; ja-JP-mac; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 Pathtraq/0.9\r\n
          Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n
          Accept-Language: ja,en-us;q=0.7,en;q=0.3\r\n
          Accept-Encoding: gzip,deflate\r\n
          Accept-Charset: Shift_JIS,utf-8;q=0.7,*;q=0.7\r\n
          Keep-Alive: 115\r\n
          Connection: keep-alive\r\n
          Cookie: wp_ozh_wsa_visits=2; wp_ozh_wsa_visit_lasttime=xxxxxxxxxx; __utma=xxxxxxxxx.xxxxxxxxxx.xxxxxxxxxx.xxxxxxxxxx.xxxxxxxxxx.x; __utmz=xxxxxxxxx.xxxxxxxxxx.x.x.utmccn=(referral)|utmcsr=reader.livedoor.com|utmcct=/reader/|utmcmd=referral\r\n\r\n
        "#,
      ),
    )
  );

  samples.push((
    "nodejs_http_parser",
    http(
      r#"
          POST /joyent/http-parser HTTP/1.1\r\n
          Host: github.com\r\n
          DNT: 1\r\n
          Accept-Encoding: gzip, deflate, sdch\r\n
          Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4\r\n
          User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1)
          AppleWebKit/537.36 (KHTML, like Gecko)
          Chrome/39.0.2171.65 Safari/537.36\r\n
          Accept: text/html,application/xhtml+xml,application/xml;q=0.9,
          image/webp,*/*;q=0.8\r\n
          Referer: https://github.com/joyent/http-parser\r\n
          Connection: keep-alive\r\n
          Transfer-Encoding: chunked\r\n
          Cache-Control: max-age=0\r\n\r\nb\r\nhello world\r\n0\r\n\r\n
        "#,
    ),
  ));

  samples.push((
    "undici",
    http(
      r#"
        HTTP/1.1 200 OK
        Connection: keep-alive
        Content-Length: 65536
        Date: Sun, 05 Nov 2023 14:26:18 GMT
        Keep-Alive: timeout=600
        @
      "#,
    )
    .replace("@", &format!("{:-<65535}", "-")),
  ));

  for (name, payload) in samples {
    let len = payload.len();
    let iterations = (8 << 30) / len;
    let total = iterations * len;
    let parser = Parser::new();

    let start = Instant::now();

    for _i in 0..(iterations as usize) {
      parser.parse(payload.as_ptr(), payload.len());
    }

    let time = Instant::now().duration_since(start).as_secs_f64();
    let bw = (total as f64) / time;

    println!(
      "{:25} | {} samples | {:.2} mb | {:.2} mb/s | {:.2} ops/sec | {:.2} s",
      name,
      iterations,
      total / (1024 * 1024),
      bw / (1024 * 1024) as f64,
      (iterations as f64) / time,
      time
    );
  }
}
