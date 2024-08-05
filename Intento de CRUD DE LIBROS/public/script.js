const API_URL = 'http://localhost:3000/api';

// Mostrar el formulario de añadir autor
function showAddAuthorForm() {
    document.getElementById('add-author-form').style.display = 'block';
}

// Enviar formulario de añadir autor
document.getElementById('add-author')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch(`${API_URL}/autores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            fecha_nacimiento: formData.get('fecha_nacimiento'),
        }),
    }).then(response => {
        if (response.ok) {
            alert('Autor añadido con éxito.');
            fetchAuthors();
        }
    });
});

// Mostrar el formulario de añadir libro
function showAddBookForm() {
    document.getElementById('add-book-form').style.display = 'block';
}

// Enviar formulario de añadir libro
document.getElementById('add-book')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch(`${API_URL}/libros`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            titulo: formData.get('titulo'),
            fecha_publicacion: formData.get('fecha_publicacion'),
            autor_id: formData.get('autor_id'),
            precio: formData.get('precio'),
        }),
    }).then(response => {
        if (response.ok) {
            alert('Libro añadido con éxito.');
            fetchBooks();
        }
    });
});

// Obtener y mostrar todos los autores
function fetchAuthors() {
    fetch(`${API_URL}/autores`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('autores-list');
            list.innerHTML = '';
            data.forEach(author => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${author.nombre} ${author.apellido} - ${author.fecha_nacimiento}
                    <button onclick="deleteAuthor(${author.id})">Eliminar</button>
                    <button onclick="showEditAuthorForm(${author.id}, '${author.nombre}', '${author.apellido}', '${author.fecha_nacimiento}')">Editar</button>
                `;
                list.appendChild(li);
            });
        });
}

// Obtener y mostrar todos los libros
function fetchBooks() {
    fetch(`${API_URL}/libros`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('libros-list');
            list.innerHTML = '';
            data.forEach(book => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${book.titulo} - ${book.fecha_publicacion} - ${book.precio}
                    <button onclick="deleteBook(${book.id})">Eliminar</button>
                    <button onclick="showEditBookForm(${book.id}, '${book.titulo}', '${book.fecha_publicacion}', ${book.autor_id}, ${book.precio})">Editar</button>
                `;
                list.appendChild(li);
            });
        });
}

// Eliminar autor
function deleteAuthor(id) {
    fetch(`${API_URL}/autores/${id}`, {
        method: 'DELETE',
    }).then(response => {
        if (response.ok) {
            alert('Autor eliminado con éxito.');
            fetchAuthors();
        }
    });
}

// Eliminar libro
function deleteBook(id) {
    fetch(`${API_URL}/libros/${id}`, {
        method: 'DELETE',
    }).then(response => {
        if (response.ok) {
            alert('Libro eliminado con éxito.');
            fetchBooks();
        }
    });
}

// Mostrar el formulario de editar autor
function showEditAuthorForm(id, nombre, apellido, fecha_nacimiento) {
    document.getElementById('edit-author-form').style.display = 'block';
    document.getElementById('edit-author-id').value = id;
    document.getElementById('edit-author-nombre').value = nombre;
    document.getElementById('edit-author-apellido').value = apellido;
    document.getElementById('edit-author-fecha_nacimiento').value = fecha_nacimiento;
}

// Enviar formulario de editar autor
document.getElementById('edit-author')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('edit-author-id').value;
    const formData = new FormData(event.target);
    fetch(`${API_URL}/autores/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            fecha_nacimiento: formData.get('fecha_nacimiento'),
        }),
    }).then(response => {
        if (response.ok) {
            alert('Autor actualizado con éxito.');
            fetchAuthors();
            document.getElementById('edit-author-form').style.display = 'none';
        }
    });
});

// Mostrar el formulario de editar libro
function showEditBookForm(id, titulo, fecha_publicacion, autor_id, precio) {
    document.getElementById('edit-book-form').style.display = 'block';
    document.getElementById('edit-book-id').value = id;
    document.getElementById('edit-book-titulo').value = titulo;
    document.getElementById('edit-book-fecha_publicacion').value = fecha_publicacion;
    document.getElementById('edit-book-autor_id').value = autor_id;
    document.getElementById('edit-book-precio').value = precio;
}

// Enviar formulario de editar libro
document.getElementById('edit-book')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('edit-book-id').value;
    const formData = new FormData(event.target);
    
    fetch(`${API_URL}/libros/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            titulo: formData.get('titulo'),
            fecha_publicacion: formData.get('fecha_publicacion'),
            autor_id: formData.get('autor_id'),
            precio: formData.get('precio'),
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Libro actualizado con éxito.');
            fetchBooks();
            document.getElementById('edit-book-form').style.display = 'none';
        } else {
            alert('Error al actualizar el libro: ' + (data.message || 'Desconocido'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al actualizar el libro.');
    });
}); 

// Llamar a fetchAuthors y fetchBooks al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('autores-list')) {
        fetchAuthors();
    }
    if (document.getElementById('libros-list')) {
        fetchBooks();
    }
});
