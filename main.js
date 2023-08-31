

//por alguna razon que desconzco cuando abro el index en el navegador los datos que traigo de mi archivo json no aparecen, pero si lo abre con live server funciona correctamente.

let carrito=[];
//Localstorage:
if(localStorage.getItem("carrito")){
    carrito=JSON.parse(localStorage.getItem("carrito"));
}

let datos="";
fetch("json/shoes.json")
    .then(respuesta => respuesta.json())
    .then(data =>{
        datos=data
        mostrarProductos(data);
    })

//empiezo a trabajar con el DOM, creando las cards para cada producto\

const mostrarProductos= (datos)=>{
    const contenedorProductos=document.getElementById("contenedorProductos");
    datos.forEach(shoes=>{
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12" );
        card.innerHTML =`   
        <div class="card">
            <img src=" ${shoes.img} " alt="">
            <div class="info">
                <h3> ${shoes.modelo} </h3>
                <p> $${shoes.precio} </p>
                <button class="btn btn-color" id="btn${shoes.id}"> Agrega al carrito </button>
                
            </div>
        </div>`
        contenedorProductos.appendChild(card);

                const boton = document.getElementById(`btn${shoes.id}`)
                boton.addEventListener("click", () => {
                    agregarAlCarrito(shoes.id);
                    Toastify({
                        text:`"${shoes.modelo}" ha sido agregado al carrito `,
                        duration:3000,
                        gravity:"top",
                        position:"right"
                    }).showToast();
                })
    })
}

const agregarAlCarrito=(id)=>{
    const productoEnCarrito = carrito.find(shoes =>shoes.id===id);
    if(productoEnCarrito){
        productoEnCarrito.cantidad++;
    }
    else{
        const producto = datos.find(shoes => shoes.id ===id);
        carrito.push(producto);
    }
    totalDeLaCompra();
    localStorage.setItem("carrito",JSON.stringify(carrito));
    mostrarCarrito();
}

const verCarrito = document.getElementById("verCarrito");
const contenedorCarrito=document.getElementById("contenedorCarrito");
verCarrito.addEventListener("click", ()=> {
    mostrarCarrito();
})

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML="";
    carrito.forEach(shoes => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12" );
        card.innerHTML =`   
        <div class="card">
            <img src=" ${shoes.img} " alt="">
            <div class="info">
                <h3> ${shoes.modelo} </h3>
                <p> $${shoes.precio} </p>
                <p> ${shoes.cantidad} </p>
                <button class="btn btn-color" id="eliminar${shoes.id}"> Eliminar del carrito </button>
            </div>
        </div>`
        contenedorCarrito.appendChild(card);

        const boton=document.getElementById(`eliminar${shoes.id}`);
        boton.addEventListener("click",()=>{
            swal.fire({
                title:`estas seguro de eliminar "${shoes.modelo}"?`,
                icon:"warning",
                confirmButtonText:"Aceptar",
                showCancelButton:true,
                cancelButtonText:"Cancelar"
            }).then((result) => {
                if(result.isConfirmed){
                    eliminarProducto(shoes.id);
                    swal.fire({
                        title: `"${shoes.modelo}" ha sido eliminada!`,
                        icon: "success",
                    })
                }
            })
        })
    })
    totalDeLaCompra();
}
const eliminarProducto = (id) =>{
    const producto = carrito.find(shoes => shoes.id===id);
    let indice=carrito.indexOf(producto);
    carrito.splice(indice,1);
    mostrarCarrito();
    localStorage.setItem("carrito",JSON.stringify(carrito));
}
const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
    swal.fire({
        title:"estas seguro de querer vaciar tu carrito?",
        icon:"warning",
        confirmButtonText:"Aceptar",
        showCancelButton:true,
        cancelButtonText:"Cancelar"
    }).then((result) => {
        if(result.isConfirmed){
            eliminarTodoDelCarrito();
            swal.fire({
                title: `el carrito se ha vaciado con exito!`,
                icon: "success",
            })
        }
    })
})

const eliminarTodoDelCarrito = () => {
    carrito=[];
    mostrarCarrito();
}

const total= document.getElementById("total");
const totalDeLaCompra=()=>{
    let totalCompra=0;
    carrito.forEach(shoes => {
        totalCompra+= shoes.precio*shoes.cantidad;
    })
    total.innerHTML=`$${totalCompra}`;
}

