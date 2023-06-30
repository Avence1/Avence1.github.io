const http = require("http");
// const stream = require("stream");

// 处理 SSE 请求
const handleSSE = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    // "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  let x = 0;
  // 发送消息
  const timer = setInterval(() => {
    res.write("event: slide\n"); // 事件类型
    res.write(`id: ${+new Date()}\n`); // 消息 ID
    res.write(`data: ${x++}\n`); // 消息数据
    res.write("retry: 10000\n"); // 重连时间
    res.write("\n\n"); // 消息结束
    if(x>=20){
      clearInterval(timer);
      res.write("event: slide\n"); // 事件类型
      res.write(`id: ${+new Date()}\n`); // 消息 ID
      res.write(`data: dataOver\n`); // 消息数据
      res.write("retry: 10000\n"); // 重连时间
      res.write("\n\n");
    }
  }, 50);

  // // 发送注释保持长连接
  // setInterval(() => {
  //   res.write(": \n\n");
  // }, 12000);

};

// 创建 HTTP 服务器并监听端口
const server = http.createServer((req, res) => {
  if (req.url === "/avence/stream") {
    // 处理 SSE 请求
    handleSSE(req, res);
  } else {
    // 处理其他请求
    res.writeHead(200);
    res.end("Hello, World!");
  }
});
server.listen(3000, () => {
  console.log("xxx");
});
