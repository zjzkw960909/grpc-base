const Grpc = require('../index').Grpc;
var gServer = new Grpc({env: 'test', host: '0.0.0.0:8890'});
console.log('start client')
var sayHello = () => {
	gServer.getData({
		path: "kevin.node.services.test",
		version: "1.0.0",
		method: "sayHello",
		args: {id: 1}
	}, function (data) {
		console.log('data', data);
	}, function (err) {
		console.log(err);
	})
}
var test1 = () => {
	gServer.getData({
		path: "kevin.node.services.test",
		version: "1.0.0",
		method: "getBbb",
		args: {id: 1}
	}, function (data) {
		console.log('test1', data);
	}, function (err) {
		console.log(err);
	})
  
}
var time = () => {
	gServer.getData({
		path: "kevin.node.services.test",
		version: "1.0.0",
		method: "timer",
		args: {id: 1}
	}, function (data) {
		console.log('test', data);
	}, function (err) {
		console.log(err);
	})
  
}
time();
sayHello();
test1();
