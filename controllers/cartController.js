const fileDb = require('../modules/fileDb');

async function getUserCart(req, res) {
  let idFile = req.params.id; // e.g., 25801 or 25801.json
  if (!idFile) return res.status(400).json({ error: 'Falta id' });
  if (!idFile.endsWith('.json')) idFile = idFile + '.json';
  try {
    const data = await fileDb.readJsonFrom('user_cart', idFile);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `No encontrado user_cart/${idFile}` });
  }
}

async function getBuy(req, res) {
  try {
    const data = await fileDb.readJsonFrom('cart', 'buy.json');
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'No encontrado cart/buy.json' });
  }
}

async function getPublish(req, res) {
  try {
    const data = await fileDb.readJsonFrom('sell', 'publish.json');
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'No encontrado sell/publish.json' });
  }
}

module.exports = { getUserCart, getBuy, getPublish };
