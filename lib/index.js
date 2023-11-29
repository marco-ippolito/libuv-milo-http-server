const { MiloHttpServer } = require('bindings')('http-server-addon');

const instance = new MiloHttpServer();
instance.listen(8000, (req) => console.log(req));