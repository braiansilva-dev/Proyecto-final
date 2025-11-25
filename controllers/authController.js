const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret123';

// Regex para validar usuario y contraseña
const usuarioValido = /^(?:[a-zA-Z0-9._-]{3,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const passwordValida = /^[a-zA-Z0-9._-]{6,}$/;

// Endpoint de login: valida con regex y guarda JWT en cookie httpOnly
async function login(req, res) {
  const { usuario, contrasena } = req.body || {};

  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  // Validar formato de usuario y contraseña con regex
  if (!usuarioValido.test(usuario)) {
    return res.status(400).json({ error: 'Formato de usuario inválido. Debe tener al menos 3 caracteres alfanuméricos o ser un email válido' });
  }

  if (!passwordValida.test(contrasena)) {
    return res.status(400).json({ error: 'Formato de contraseña inválido. Debe tener al menos 6 caracteres alfanuméricos' });
  }

  try {
    // Generar un ID único para el usuario (basado en timestamp y hash simple)
    const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    // Guardar datos en users.json
    const users = require('../json/users.json');
    users.push({ user: usuario, password: contrasena, id: userId });
    require('fs').writeFileSync('./json/users.json', JSON.stringify(users));
    
    // Crear payload con información del usuario
    const payload = { 
      user: usuario, 
      id: userId 
    };
    
    // Generar token JWT
    const token = jwt.sign(payload, SECRET, { expiresIn: '2h' });

    // Guardar token en cookie httpOnly (segura, no accesible desde JavaScript)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    });

    // Enviar respuesta con datos del usuario (sin el token)
    res.json({ success: true, user: payload });
  } catch (err) {
    res.status(500).json({ error: 'Error interno al generar token' });
  }
}

// Endpoint de logout: eliminar cookie
function logout(req, res) {
  res.clearCookie('token');
  res.json({ success: true, message: 'Sesión cerrada correctamente' });
}

module.exports = { login, logout };
