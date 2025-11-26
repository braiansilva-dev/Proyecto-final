const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

const apiRoutes = require('./routes/api');
const { verifyTokenPage } = require('./modules/jwtMiddleware');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret123';

app.use(express.json());
app.use(cookieParser());

// Middleware para verificar token (función helper)
function checkToken(req) {
    const token = req.cookies?.token;
    if (!token) return false;
    try {
        jwt.verify(token, SECRET);
        return true;
    } catch (err) {
        return false;
    }
}

// Rutas de la API en /api
app.use('/api', apiRoutes);

// Middleware para bloquear acceso directo a archivos .html
app.use((req, res, next) => {
    // Si la ruta termina en .html, redirigir a login
    if (req.path.endsWith('.html')) {
        return res.redirect('/login');
    }
    next();
});

// Rutas públicas (sin autenticación) - DEBEN ir ANTES de express.static
app.get('/', (req, res) => {
    // Si ya tiene token válido, redirigir al index
    if (checkToken(req)) {
        return res.redirect('/index');
    }
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.get('/login', (req, res) => {
    // Si ya tiene token válido, redirigir al index
    if (checkToken(req)) {
        return res.redirect('/index');
    }
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

// Rutas protegidas (requieren autenticación) - DEBEN ir ANTES de express.static
const protectedPages = {
    '/index': 'index.html',
    '/products': 'products.html',
    '/categories': 'categories.html',
    '/cart': 'cart.html',
    '/sell': 'sell.html',
    '/my-profile': 'my-profile.html',
    '/product-info': 'product-info.html'
};

// Configurar rutas protegidas para cada página
Object.keys(protectedPages).forEach(route => {
    app.get(route, verifyTokenPage, (req, res) => {
        res.sendFile(path.join(__dirname, 'pages', protectedPages[route]));
    });
});

// Servir archivos estáticos (js, css, img, etc.) - DEBE ir DESPUÉS de las rutas definidas
// Esto asegura que las rutas definidas se ejecuten antes de que static intente servir archivos
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    dotfiles: 'ignore'
}));

// Middleware catch-all: redirigir cualquier otra ruta a /login si no está autenticado
app.use((req, res) => {
    // Si no es una ruta de API y no es un archivo estático, verificar autenticación
    if (!req.path.startsWith('/api') && !req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$/)) {
        if (!checkToken(req)) {
            res.clearCookie('token');
            return res.redirect('/login');
        }
        // Token válido pero ruta no encontrada, redirigir a index
        return res.redirect('/index');
    }
    // Si es un archivo estático que no existe, devolver 404
    res.status(404).send('Not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});