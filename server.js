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
    console.log('브로드캐스트 시작');

    // 메시지를 브로드캐스트 (보낸 클라이언트 제외)
    wss.clients.forEach((client) => {
      console.log(`클라이언트 상태: ${client.readyState}, 자신 여부: ${client === ws}`);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message); // 메시지 전달
        console.log('메시지 전달 완료');
      }
    });

    console.log('브로드캐스트 종료');
  });

  ws.on('close', () => {
    console.log('클라이언트 연결 종료');
  });
});

// 기본 HTTP 엔드포인트
app.get('/', (req, res) => {
  res.send('WebSocket 서버가 실행 중입니다.');
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
