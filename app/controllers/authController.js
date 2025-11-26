const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret123';

const USERS = [
    { username: 'admin', password: '1234' },
    { username: 'justin', password: 'pass123' }
];

function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Buscar usuario en la "base de datos" depende si quiero agregar o no ananan
    const user = USERS.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Crear token
    const token = jwt.sign(
        { username: user.username },
        SECRET
    );
    return res.json({ message: 'Login exitoso', token });
}

function logout(req, res) {
    res.clearCookie('token');
    return res.json({ message: 'Logout exitoso' });
}

module.exports = { login, logout };
