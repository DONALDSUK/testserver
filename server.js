const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket 연결 관리
wss.on('connection', (ws) => {
  console.log('클라이언트가 연결되었습니다.');

  ws.on('message', (message) => {
    console.log(`수신된 메시지: ${message}`);

    // 모든 클라이언트에게 메시지 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`서버에서 전달: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('클라이언트 연결 종료');
  });
});

// 기본 HTTP 엔드포인트
app.get('/', (req, res) => {
  res.send('WebSocket 서버가 실행 중입니다.');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
