async function replyData(context, next) {
  let data = await context.originFunc(context);
  const response = {
    data
  };
  let reply = context.getDataResponse;
  reply.setResult(JSON.stringify(response));
  context.reply = reply;
  await next();
}

module.exports = {
  replyData
}
