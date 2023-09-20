cargarListaDeTurnos();

//FUNCION PARA CARGAR LA LISTA DE TURNOS DESDE EL JSON
function cargarListaDeTurnos() {
    fetch('turnos.json')
        .then(response => response.json())
        .then(data => {
            actualizarListaDeTurnos(data); //LLAMA A LA FUNCION PARA ACTUALIZAR LA LISTA DE TURNOS
        })
        .catch(error => {
            console.error('Error al cargar la lista de turnos:', error);
        }); //MUESTRA MENSAJE DE ERROR EN CONSOLA SI FALLA LA SOLICITUD
}

//FUNCION PARA REGISTRAR NUEVO TURNO Y OBTENER EL NOMBRE Y APELLIDO DEL USUARIO DESDE EL FORMULARIO
async function registrarTurno() {
    const nombreInput = document.getElementById("Nombre");
    const apellidoInput = document.getElementById("Apellido");

    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;

    //VERIFICA SI SE COMPLETARON AMBOS CAMPOS EN EL FORMULARIO
    if (!nombre || !apellido) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese un nombre y un apellido válidos.',
        });
        return; //MUESTRA MENSAJE DE ERROR SI NO ES UN DATO VALIDO O FALTA ALGUN CAMPO - SALE DE LA FUNCION
    }

    //SE COMBINA NOMBRE Y APELLIDO
    const nombreCompleto = `${nombre} ${apellido}`;

    //RESTABLECE LOS CAMPOS NOMBRE Y APELLIDO A UN VALOR VACIO
    nombreInput.value = '';
    apellidoInput.value = '';

    //SE OBTIENE LA LISTA DE TURNOS DEL ALMACENAMIENTO LOCAL
    let listaDeTurnos = JSON.parse(localStorage.getItem('listaDeTurnos')) || [];

    //CREA OBJETO DE TURNO CON NOMBRE COMPLETO
    const nuevoTurno = { nombre: nombreCompleto };

    //AGREGA EL NUEVO TURNO A LA LISTA
    listaDeTurnos.push(nuevoTurno);

    //GUARDA LISTA ACTUALIZADA EN ALMACENAMIENTO LOCAL
    localStorage.setItem('listaDeTurnos', JSON.stringify(listaDeTurnos));

    //MUESTRA MENSAJE DE TURNO REGISTRADO
    Swal.fire({
        icon: 'success',
        title: 'Turno registrado',
        text: `El turno se registró para ${nombreCompleto}`,
    });

    actualizarListaDeTurnos(listaDeTurnos); //LLAMA A LA FUNCION PARA ACTUALIZAR LA LISTA DE TURNOS
}

//FUNCION PARA CANCELAR EL TURNO CON EL NOMBRE Y APELLIDO DEL USUARIO
async function cancelarTurno() {

    //CUADRO DE DIALOGO PARA QUE EL USUARIO INGRESE SU NOMBRE Y APELLIDO
    const { value: nombre } = await Swal.fire({
        title: 'Ingrese su nombre',
        input: 'text',
        inputLabel: 'Nombre',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingrese un nombre válido';//MENSAJE DE ERROR SI EL NOMBRE Y APELLIDO NO SON VALIDOS
            }
        }
    });

    if (!nombre) {
        return; //VUELVE A LA FUNCION SI CANCELA
    }
    //SE OBTIENE LA LISTA DE TURNOS DEL ALMACENAMIENTO LOCAL
    let listaDeTurnos = JSON.parse(localStorage.getItem('listaDeTurnos')) || [];

    //BUSCA EL INDICE DE TURNOS
    const index = listaDeTurnos.findIndex(turno => turno.nombre === nombre);

    //MUESTRA MENSAJE DE ERROR SI NO LO ENCUENTRA EN LA LISTA
    if (index === -1) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Nombre no encontrado en la lista de turnos.',
        });
        return; //VUELVE A LA FUNCION
    }
    //BUSCA EN EL INDICE DE TURNOS
    const turnoCanceladoInfo = listaDeTurnos[index];
    listaDeTurnos.splice(index, 1);

    localStorage.setItem('listaDeTurnos', JSON.stringify(listaDeTurnos));

    //SI EL NOMBRE Y APELLIDO ES CORRECTO SE MUESTRA MENSAJE DE TURNO CANCELADO
    Swal.fire({
        icon: 'info',
        title: 'Turno cancelado',
        text: `El turno para ${turnoCanceladoInfo.nombre} ha sido cancelado.`,
    });

    actualizarListaDeTurnos(listaDeTurnos); //LLAMA A LA FUNCION PARA ACTUALIZAR LA LISTA DE TURNOS
}

//FUNCION PARA ACTUALIZAR LA LISTA DE TURNOS EN LA PAGINA
function actualizarListaDeTurnos(turnos) {
    const listaDeTurnosElement = document.getElementById("listaDeTurnos");
    listaDeTurnosElement.innerHTML = "";

    //ITERA A TRAVES DE LA LISTA DE TURNOS Y CREA ELEMENTOS DE LISTA PARA CADA UNO
    turnos.forEach(turno => {
        const li = document.createElement("li");
        const mensaje = turno.cancelado ? `Turno #${turno.turno} - ${turno.nombre} (Cancelado)` : `Turno #${turno.turno} - ${turno.nombre}`;
        li.textContent = mensaje;
        listaDeTurnosElement.appendChild(li);
    });
}

//EVENT LISTENER PARA EL BOTON DE REGISTRO DE TURNOS
const botonPedirTurno = document.getElementById("pedirTurno");
botonPedirTurno.addEventListener("click", registrarTurno);

//EVENTI LISTENER PARA EL BOTON DE CANCELACION DE TURNOS
const botonCancelarTurno = document.getElementById("cancelarTurno");
botonCancelarTurno.addEventListener("click", cancelarTurno);