const fileDb = require('../modules/fileDb');

async function getCats(req, res) {
  try {
    const data = await fileDb.readJsonFrom('cats', 'cat.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo leer cats/cat.json' });
  }
}

async function getCatProducts(req, res) {
  let idFile = req.params.id; // may be '101' or '101.json'
  if (!idFile) return res.status(400).json({ error: 'Falta id' });
  if (!idFile.endsWith('.json')) idFile = idFile + '.json';
  try {
    const data = await fileDb.readJsonFrom('cats_products', idFile);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `No encontrado cats_products/${idFile}` });
  }
}

module.exports = { getCats, getCatProducts };
