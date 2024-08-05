const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//INSTALAR LAS DEPENDENCIAS
//npm install express
//npm install mysql2
// Configura la conexión a la base de datos en MYSQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu_contraseña',
    database: 'Biblioteca'
});

// Conecta a la base de datos
connection.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos.');
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas para páginas CRUD
app.get('/autores.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'autores.html'));
});

app.get('/libros.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'libros.html'));
});

// API CRUD para Autores
app.get('/api/autores', (req, res) => {
    connection.query('SELECT * FROM Autores', (err, results) => {
        if (err) {
            console.error('Error al obtener autores:', err);
            return res.status(500).json({ error: 'Error al obtener autores' });
        }
        res.json(results);
    });
});

app.post('/api/autores', (req, res) => {
    const { nombre, apellido, fecha_nacimiento } = req.body;
    connection.query('INSERT INTO Autores (nombre, apellido, fecha_nacimiento) VALUES (?, ?, ?)', 
    [nombre, apellido, fecha_nacimiento], (err, results) => {
        if (err) {
            console.error('Error al añadir autor:', err);
            return res.status(500).json({ error: 'Error al añadir autor' });
        }
        res.send('Autor añadido con éxito.');
    });
});

app.put('/api/autores/:id', (req, res) => {
    const { nombre, apellido, fecha_nacimiento } = req.body;
    const { id } = req.params;
    connection.query('UPDATE Autores SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id = ?', 
    [nombre, apellido, fecha_nacimiento, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar autor:', err);
            return res.status(500).json({ error: 'Error al actualizar autor' });
        }
        res.send('Autor actualizado con éxito.');
    });
});

app.delete('/api/autores/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM Autores WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar autor:', err);
            return res.status(500).json({ error: 'Error al eliminar autor' });
        }
        res.send('Autor eliminado con éxito.');
    });
});

// API CRUD para Libros
app.get('/api/libros', (req, res) => {
    connection.query('SELECT * FROM Libros', (err, results) => {
        if (err) {
            console.error('Error al obtener libros:', err);
            return res.status(500).json({ error: 'Error al obtener libros' });
        }
        res.json(results);
    });
});

app.post('/api/libros', (req, res) => {
    const { titulo, fecha_publicacion, autor_id, precio } = req.body;
    connection.query('INSERT INTO Libros (titulo, fecha_publicacion, autor_id, precio) VALUES (?, ?, ?, ?)', 
    [titulo, fecha_publicacion, autor_id, precio], (err, results) => {
        if (err) {
            console.error('Error al añadir libro:', err);
            return res.status(500).json({ error: 'Error al añadir libro' });
        }
        res.send('Libro añadido con éxito.');
    });
});

app.put('/api/libros/:id', (req, res) => {
    const { titulo, fecha_publicacion, autor_id, precio } = req.body;
    const { id } = req.params;
    connection.query('UPDATE Libros SET titulo = ?, fecha_publicacion = ?, autor_id = ?, precio = ? WHERE id = ?', 
    [titulo, fecha_publicacion, autor_id, precio, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar libro:', err);
            return res.status(500).json({ error: 'Error al actualizar libro' });
        }
        res.send('Libro actualizado con éxito.');
    });
});

app.delete('/api/libros/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM Libros WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar libro:', err);
            return res.status(500).json({ error: 'Error al eliminar libro' });
        }
        res.send('Libro eliminado con éxito.');
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal.');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
