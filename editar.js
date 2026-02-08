const parametros = new URLSearchParams(window.location.search);
const id = parametros.get('id');
const URL_API = 'https://dummyjson.com/products';

const cargarProducto = () => {
    if(!id) return;
    fetch(`${URL_API}/${id}`)
    .then(res => res.json())
    .then(p => {
        document.getElementById('titulo').value = p.title;
        document.getElementById('precio').value = p.price;
        document.getElementById('descripcion').value = p.description;
        
        // Cargar categorías y seleccionar la actual
        fetch(`${URL_API}/category-list`)
        .then(res => res.json())
        .then(cats => {
            const sel = document.getElementById('categoria');
            cats.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                if(c === p.category) opt.selected = true;
                sel.appendChild(opt);
            });
        });
    });
}

const editarProducto = () => {
    const datos = {
        title: document.getElementById('titulo').value,
        price: parseFloat(document.getElementById('precio').value),
        description: document.getElementById('descripcion').value,
        category: document.getElementById('categoria').value
    };

    fetch(`${URL_API}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        const msg = document.getElementById('mensaje-exito');
        msg.style.display = 'block';
        msg.innerText = "¡Cambios guardados con éxito!";
        setTimeout(() => { window.location.href = 'index.htm'; }, 1500);
    });
}

cargarProducto();