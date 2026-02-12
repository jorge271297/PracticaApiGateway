const http = require('http');
const fs = require('fs');
const path = require('path');

const storeFile = path.join(__dirname, 'payments_store.json');
if (!fs.existsSync(storeFile)) fs.writeFileSync(storeFile, JSON.stringify({}));

function readStore() {
  try { return JSON.parse(fs.readFileSync(storeFile, 'utf8') || '{}'); } catch (e) { return {}; }
}

function writeStore(data) { fs.writeFileSync(storeFile, JSON.stringify(data, null, 2)); }

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }

  if (req.method === 'POST' && req.url === '/api/pagos') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const input = JSON.parse(body || '{}');
        if (!input.usuario || !input.amount) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: 'usuario y amount son requeridos' }));
        }

        const id = 'pay_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
        const success = (Math.floor(Math.random()*100) < 85);
        let status = success ? 'success' : 'failed';

        const record = {
          id, usuario: input.usuario, amount: Number(input.amount), currency: input.currency || 'USD', method: input.method || 'card', status,
          metadata: input.metadata || {}, created_at: new Date().toISOString()
        };

        const store = readStore();
        store[id] = record;
        writeStore(store);

        // Si pago simulado exitoso, intentar descontar inventario y limpiar carrito
        if (success) {
          try {
            // Obtener carrito desde servicio de carrito
            const cartRes = await fetch(`http://carrito-service:3003/api/carrito/${encodeURIComponent(input.usuario)}`);
            const cart = await cartRes.json();
            const items = cart.items || [];

            // Preparar reducción para inventario
            const reductions = items.map(i => ({ sku: i.producto || i.sku || null, cantidad: i.cantidad || 1 })).filter(r => r.sku);

            // Llamar a inventario para reducir stock
            const invRes = await fetch('http://inventario-service:3002/api/productos/reducir', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: reductions })
            });
            const invResult = await invRes.json();

            // Verificar resultados
            const anyFailed = (invResult.results || []).some(r => !r.success);
            if (anyFailed) {
              // Marcar pago como fallido por inventario
              store[id].status = 'failed_inventory';
              writeStore(store);
              res.writeHead(200);
              return res.end(JSON.stringify({ payment_id: id, status: 'failed_inventory', inventory: invResult }));
            }

            // Limpiar carrito
            await fetch('http://carrito-service:3003/api/carrito/clear', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usuario: input.usuario })
            });

            // Actualizar registro
            store[id].status = 'success';
            writeStore(store);
            res.writeHead(201);
            return res.end(JSON.stringify({ payment_id: id, status: 'success' }));
          } catch (e) {
            store[id].status = 'failed';
            writeStore(store);
            res.writeHead(500);
            return res.end(JSON.stringify({ payment_id: id, status: 'failed', error: 'error processing post-payment actions' }));
          }
        }

        // Pago simulado fallido
        res.writeHead(201);
        return res.end(JSON.stringify({ payment_id: id, status }));
      } catch (e) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'invalid json' }));
      }
    });
    return;
  }

  const getMatch = req.url.match(/^\/api\/pagos\/([^\/]+)$/);
  if (req.method === 'GET' && getMatch) {
    const id = getMatch[1];
    const store = readStore();
    if (!store[id]) { res.writeHead(404); return res.end(JSON.stringify({ error: 'Pago no encontrado' })); }
    res.writeHead(200);
    return res.end(JSON.stringify(store[id]));
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200); return res.end(JSON.stringify({ status: 'OK', service: 'payments', timestamp: new Date().toISOString() }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

const port = process.env.PORT || 80;
server.listen(port, () => console.log('Payments mock running on port', port));
