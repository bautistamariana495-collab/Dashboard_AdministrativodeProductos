const URL_API = 'https://dummyjson.com/products';

// --- LÓGICA COMPARTIDA ---
async function obtenerCategorias() {
    const selector = document.getElementById('filtro-categoria') || document.getElementById('nuevo-cat');
    if (!selector) return;

    try {
        const res = await fetch(`${URL_API}/category-list`);
        const cats = await res.json();
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
            selector.appendChild(opt);
        });
    } catch (e) { console.error("Error categorías:", e); }
}


if (document.getElementById('cuerpo-tabla')) {
    let skip = 0;
    const limit = 10;

    const cargarDatos = async () => {
        const query = document.getElementById('buscador').value;
        const cat = document.getElementById('filtro-categoria').value;
        const [sort, order] = document.getElementById('ordenar-por').value.split('-');

        let url = `${URL_API}?limit=${limit}&skip=${skip}&sortBy=${sort}&order=${order}`;
        if (query) url = `${URL_API}/search?q=${query}`;
        else if (cat) url = `${URL_API}/category/${cat}?sortBy=${sort}&order=${order}`;

        const res = await fetch(url);
        const data = await res.json();
        renderizar(data.products, data.total);
    };

    const renderizar = (productos, total) => {
        const tbody = document.getElementById('cuerpo-tabla');
        tbody.innerHTML = productos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.thumbnail}" width="40" style="border-radius:4px"></td>
                <td>${p.title}</td>
                <td>${p.category}</td>
                <td>$${p.price}</td>
                <td>
                    <button class="btn-edit" onclick="window.location.href='editar.html?id=${p.id}'">✏️</button>
                    <button class="btn-delete" onclick="eliminar(${p.id}, this)">🗑️</button>
                </td>
            </tr>
        `).join('');
        document.getElementById('info-paginacion').innerText = `Total: ${total} | Mostrando: ${skip + 1}-${Math.min(skip + limit, total)}`;
    };

 
    document.getElementById('btn-siguiente').onclick = () => { skip += limit; cargarDatos(); };
    document.getElementById('btn-anterior').onclick = () => { if(skip > 0) { skip -= limit; cargarDatos(); } };
    document.getElementById('btn-buscar').onclick = cargarDatos;
    document.getElementById('buscador').onkeypress = (e) => { if(e.key === 'Enter') cargarDatos(); };
    document.getElementById('filtro-categoria').onchange = cargarDatos;
    document.getElementById('ordenar-por').onchange = cargarDatos;

    window.eliminar = async (id, el) => {
        if(confirm("¿Eliminar producto?")) {
            await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
            el.closest('tr').style.opacity = '0.3';
            alert("Eliminado (Simulación exitosa)");
        }
    };

    cargarDatos();
    obtenerCategorias();
}


if (document.getElementById('form-nuevo-producto')) {
    obtenerCategorias();
    document.getElementById('form-nuevo-producto').onsubmit = async (e) => {
        e.preventDefault();
        const nuevo = {
            title: document.getElementById('nuevo-titulo').value,
            price: parseFloat(document.getElementById('nuevo-precio').value),
            category: document.getElementById('nuevo-cat').value,
            description: document.getElementById('nuevo-descripcion').value
        };

        const res = await fetch(`${URL_API}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });
        const data = await res.json();
        alert(`¡Éxito! Producto ID ${data.id} creado.`);
        window.location.href = 'index.htm';
    };
}