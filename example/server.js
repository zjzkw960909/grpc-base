const Grpc = require('../index').Grpc;

function sayHello(call) {
	var params = call.params;
	return {dd:1};
}
function getBbb(call) {
	var params = call.params;
	return {test1: 12}
}
async function timer(call) {
  var time = () => {
    return new Promise((resolve, reject) => {
      setTimeout(()=> {
        resolve(12);
      }, 0)
    })
  }
	var params = call.params;
	var timeData = await time();
	return {timeData}
}


function main() {
  let gServer = new Grpc({env: "test", host: '0.0.0.0:8890'});

	gServer.start("kevin.node.services.test", "1.0.0", {sayHello, timer, getBbb});
}

main();


