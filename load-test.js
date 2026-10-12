import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 30,
  duration: '2m',
};

export default function () {
  let res = http.get('http://envoy-service/');

  const statusKey = `HTTP Response: ${res.status}`;
  check(res, {
    [statusKey]: (r) => true,
    'Sucesso (200)': (r) => r.status === 200,
    'Erro 503 (Upstream Termination)': (r) => r.status === 503,
  });

  // Em 10% das execuções, aplicamos uma pausa de exatamente 5 segundos 
  // para forçar a expiração do keep-alive do Node.js no momento da reutilização do socket.
  // Nas outras 90%, mantemos tráfego contínuo.
  if (Math.random() < 0.10) {
    sleep(5.0);
  } else {
    sleep(0.2);
  }
}