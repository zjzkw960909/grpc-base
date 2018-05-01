const grpc = require('grpc'),
  Message = require('./base_pb'),
  Services = require('./base_grpc_pb');
const compose = require('koa-compose');
const getDataRequest = new Message.DataRequest();
const getDataResponse = new Message.DataResponse();

async function getParams(call, next) {
  let query = call.request.getParams();
  const defaultReq = {headers: {logs: []}};
  call.res = {};
  try {
    query = JSON.parse(query);
    call.req = query.grpcHeaders ? query.grpcHeaders : defaultReq;
    call.params = query.params;
    call.req.params = query.params;
  } catch (e) {
    call.req = {headers: {logs: []}};
    call.params = {};
  }
  await next();
}

async function replyData(context, next) {
  let data = await context.originFunc(context);
  const response = {
    data
  };
  let reply = getDataResponse;
  reply.setResult(JSON.stringify(response));
  context.reply = reply;
  await next();
}

class Grpc {
  constructor(config) {
    this.config = Object.assign(Grpc.config, config);
    this.middleware = [];
    this.init();
  }
  init() {
    let _this = this;
    let env = _this.config.env || (_this.config.req && _this.config.req.headers.env);
    _this.config.env = env;
  }
  _createServer(path, version, originService) {
    let methods = Object.keys(originService);
    let GreeterService = Services.createGreets(path, methods);
    let server = new grpc.Server();
    let serverList = Object.create(null);
    for(let k in originService) {
      serverList[k] = (context, callback) => {
        context.originFunc = originService[k];
        this.middleware = [getParams, replyData];
        let fn = compose(this.middleware);
        fn(context).then(() => {
          callback(null, context.reply);   
        }).catch((e) => {
          const data = {code: 404, msg: 'not found'};
          let reply = getDataResponse;
          const response = {
            data
          };
          reply.setResult(JSON.stringify(response));
          callback(null, reply);
        })
      }
    }
    server.addService(GreeterService, serverList);
    server.bind(this.config.host, grpc.ServerCredentials.createInsecure());
    server.start();
  }
  _clientConnect(params, callback, errback) {
    if (params && !(params instanceof Object)) {
      errback && errback('参数不合法');
      return false;
    }
    let {path, method, args} = params;
    let query = {
      params: args
    };
    let request = getDataRequest;
    request.setParams(JSON.stringify(query));
    let GreeterService = Services.createGreets(path, [method]);
    let GreeterClient = grpc.makeGenericClientConstructor(GreeterService);
    let client = new GreeterClient(this.config.host, grpc.credentials.createInsecure());
    client[method](request, function (err, response) {
      if (!err) {
        callback && callback(response.getResult());
      } else {
        errback && errback(err);
      }
    });
  }
  start(path, version, originService) {
    this._createServer(path, version, originService);
  }
  getData(params, callback, errback) {
    this._clientConnect(params, callback, errback);
  }
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }
}

Grpc.config = {
  env: '',
  req: null,
  host: ''
};
module.exports = Grpc;
