document.addEventListener('DOMContentLoaded', () => {
    let clienteInput = document.querySelector(".cliente");
    let productoInput = document.querySelector(".producto");
    let precioInput = document.querySelector(".precio");
    let imagenInput = document.querySelector(".imagen");
    let observacionInput = document.querySelector(".observacion");
    let btnGuardar = document.querySelector(".btn-guardar");
    let btnActualizar = document.querySelector(".btn-actualizar");
    let tabla = document.querySelector(".table > tbody");
    let busquedaInput = document.querySelector(".busqueda");
    let pedidoEnEdicion = null;

    btnGuardar.addEventListener("click", () => {
        let datos = validarFormulario();
        if (datos) {
            guardardatos(datos);
            mostrarDatos();
        }
    });

    btnActualizar.addEventListener("click", () => {
        if (pedidoEnEdicion !== null) {
            actualizarPedido(pedidoEnEdicion);
        }
    });

    busquedaInput.addEventListener("input", () => {
        mostrarDatos(busquedaInput.value.trim().toLowerCase());
    });

    function validarFormulario() {
        if (
            clienteInput.value === "" ||
            productoInput.value === "" ||
            precioInput.value === "" ||
            imagenInput.value === "" ||
            observacionInput.value === ""
        ) {
            alert("Todos los campos son obligatorios");
            return null;
        } else {
            let datosform = {
                cliente: clienteInput.value,
                producto: productoInput.value,
                precio: precioInput.value,
                imagen: imagenInput.value,
                observacion: observacionInput.value
            };

            clienteInput.value = "";
            productoInput.value = "";
            precioInput.value = "";
            imagenInput.value = "";
            observacionInput.value = "";

            return datosform;
        }
    }

    const listadopedidos = "pedidos";

    function guardardatos(datos) {
        let pedidos = [];
        let pedidosPrevios = JSON.parse(localStorage.getItem(listadopedidos));

        if (pedidosPrevios !== null) {
            pedidos = pedidosPrevios;
        }

        pedidos.push(datos);
        localStorage.setItem(listadopedidos, JSON.stringify(pedidos));
        alert("Pedido guardado en localStorage");
    }

    function mostrarDatos(filtro = "") {
        let pedidos = [];
        let pedidosPrevios = JSON.parse(localStorage.getItem(listadopedidos));

        if (pedidosPrevios !== null) {
            pedidos = pedidosPrevios;
        }

        tabla.innerHTML = ""; // Limpiar la tabla antes de mostrar los datos

        pedidos.forEach((p, i) => {
            if (p.cliente.toLowerCase().includes(filtro)) {
                let fila = document.createElement("tr");
                fila.innerHTML = `
                    <td> ${i + 1} </td>
                    <td> ${p.cliente} </td>
                    <td> ${p.producto} </td>
                    <td> ${p.precio} </td>
                    <td> <img src="${p.imagen}" width="50%"> </td>
                    <td> ${p.observacion} </td>
                    <td> 
                        <span class="btn-editar btn btn-warning" data-index="${i}">🗳️</span>
                        <span class="btn-eliminar btn btn-danger " data-index="${i}">❌</span>
                    </td>
                `;
                tabla.appendChild(fila);
            }
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', editarPedido);
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', eliminarPedido);
        });
    }

    function editarPedido(event) {
        const index = event.target.getAttribute('data-index');
        let pedidos = JSON.parse(localStorage.getItem(listadopedidos)) || [];

        clienteInput.value = pedidos[index].cliente;
        productoInput.value = pedidos[index].producto;
        precioInput.value = pedidos[index].precio;
        imagenInput.value = pedidos[index].imagen;
        observacionInput.value = pedidos[index].observacion;

        pedidoEnEdicion = index;

        btnGuardar.classList.add("d-none");
        btnActualizar.classList.remove("d-none");
    }

    function actualizarPedido(index) {
        let pedidos = JSON.parse(localStorage.getItem(listadopedidos)) || [];

        pedidos[index].cliente = clienteInput.value;
        pedidos[index].producto = productoInput.value;
        pedidos[index].precio = precioInput.value;
        pedidos[index].imagen = imagenInput.value;
        pedidos[index].observacion = observacionInput.value;

        localStorage.setItem(listadopedidos, JSON.stringify(pedidos));
        alert("Datos actualizados con éxito");

        mostrarDatos();

        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        imagenInput.value = "";
        observacionInput.value = "";

        btnGuardar.classList.remove("d-none");
        btnActualizar.classList.add("d-none");
        pedidoEnEdicion = null;
    }

    function eliminarPedido(event) {
        const index = event.target.getAttribute('data-index');
        let pedidos = JSON.parse(localStorage.getItem(listadopedidos)) || [];

        const confirmar = confirm("¿Seguro que quieres eliminar este pedido?");
        
        if (confirmar) {
            pedidos.splice(index, 1);
            localStorage.setItem(listadopedidos, JSON.stringify(pedidos));
            mostrarDatos();
        }
    }

    mostrarDatos();
});
