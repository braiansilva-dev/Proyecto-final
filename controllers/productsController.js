const fileDb = require('../modules/fileDb');

async function getProduct(req, res) {
  let fileName = req.params.id; // e.g., 50741 or 50741.json
  if (!fileName) return res.status(400).json({ error: 'Falta id' });
  if (!fileName.endsWith('.json')) fileName = fileName + '.json';
  try {
    const data = await fileDb.readJsonFrom('products', fileName);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `No encontrado products/${fileName}` });
  }
}

async function getProductComments(req, res) {
  let fileName = req.params.id;
  if (!fileName) return res.status(400).json({ error: 'Falta id' });
  if (!fileName.endsWith('.json')) fileName = fileName + '.json';
  try {
    const data = await fileDb.readJsonFrom('products_comments', fileName);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `No encontrado products_comments/${fileName}` });
  }
}

module.exports = { getProduct, getProductComments };
