/* UBICACIÓN DE ELEMENTOS HTML, CREACIÓN DE CONSTANTES Y VARIABLES
================================================================================================= */
const form = document.querySelector('#container-form__form');
const divColores = document.querySelector('#div-colores');
const containerTareas = document.querySelector('#container-tareas');
const containerError = document.querySelector('#container-error');
const pError = document.querySelector('#container-error__parrafo');

const IDB = window.indexedDB;
let db;

const date = new Date();
let colorSeleccionado;
let errores = [];
/* ============================================================================================== */

/* FUNCIONES
================================================================================================= */

// 1.- FUNCIÓN QUE MUESTRA LAS TAREAS TRAIDAS DESDE LA BD INDEXDB EN NUESTRO HTML
const mostrarTasks = (() => {
  const transaction = db.transaction(['tasks'], 'readonly');
  const objectStore = transaction.objectStore('tasks');
  const request = objectStore.openCursor();

  const fragment = document.createDocumentFragment();

  request.onsuccess = (() => {
    const cursor = request.result;

    if (cursor) {
      if (cursor.value.estado) {
        const div1 = document.createElement('DIV');
        div1.className = 'container-tareas__item';
        div1.style = `background-color: ${cursor.value.color}`;

        const div2 = document.createElement('DIV');
        div2.className = 'container-tareas__item__div-span';

        const span = document.createElement('SPAN');
        span.className = 'container-tareas__item__div-span__span';
        span.setAttribute('id', 'span');
        span.style = 'text-decoration: line-through';
        span.textContent = `${cursor.value.name}`;

        const div3 = document.createElement('DIV');
        div3.className = 'container-tareas__item__div-date';

        const label = document.createElement('LABEL');
        label.className = 'container-tareas__item__div-date__date';
        label.textContent = `${cursor.value.date}`;

        const div4 = document.createElement('DIV');
        div4.className = 'container-tareas__item__div-modificar';

        const label2 = document.createElement('LABEL');
        label2.className = 'container-tareas__item__div-modificar__label-modificar';
        label2.textContent = 'Ѵ';

        const div5 = document.createElement('DIV');
        div5.className = 'container-tareas__item__div-borrar';

        const label3 = document.createElement('LABEL');
        label3.className = 'container-tareas__item__div-borrar__label-borrar';
        label3.textContent = 'X';

        div2.appendChild(span);
        div1.appendChild(div2);

        div3.appendChild(label);
        div1.appendChild(div3);

        div4.appendChild(label2);
        div1.appendChild(div4);

        div5.appendChild(label3);
        div1.appendChild(div5);

        fragment.appendChild(div1);

        cursor.continue();
      } else {
        const div1 = document.createElement('DIV');
        div1.className = 'container-tareas__item';
        div1.style = `background-color: ${cursor.value.color}`;

        const div2 = document.createElement('DIV');
        div2.className = 'container-tareas__item__div-span';

        const span = document.createElement('SPAN');
        span.className = 'container-tareas__item__div-span__span';
        span.setAttribute('id', 'span');
        span.textContent = `${cursor.value.name}`;

        const div3 = document.createElement('DIV');
        div3.className = 'container-tareas__item__div-date';

        const label = document.createElement('LABEL');
        label.className = 'container-tareas__item__div-date__date';
        label.textContent = `${cursor.value.date}`;

        const div4 = document.createElement('DIV');
        div4.className = 'container-tareas__item__div-modificar';

        const label2 = document.createElement('LABEL');
        label2.className = 'container-tareas__item__div-modificar__label-modificar';
        label2.textContent = 'Ѵ';

        const div5 = document.createElement('DIV');
        div5.className = 'container-tareas__item__div-borrar';

        const label3 = document.createElement('LABEL');
        label3.className = 'container-tareas__item__div-borrar__label-borrar';
        label3.textContent = 'X';

        div2.appendChild(span);
        div1.appendChild(div2);

        div3.appendChild(label);
        div1.appendChild(div3);

        div4.appendChild(label2);
        div1.appendChild(div4);

        div5.appendChild(label3);
        div1.appendChild(div5);

        fragment.appendChild(div1);

        cursor.continue();
      }
    } else {
      containerTareas.innerHTML = '';
      containerTareas.appendChild(fragment);
    }
  });

  request.onerror = ((eventError) => {
    console.log(eventError);
  });
});

// 2.- SELECCIONA EL COLOR DE FONDO DE LA TAREA (Delegación de Eventos)
divColores.addEventListener('click', (event) => {
  event.preventDefault();
  const colorTarea = event.target.classList[1];

  switch (colorTarea) {
    case 'div1':
      colorSeleccionado = '#008000';
      divColores.firstElementChild.classList.toggle('container-form__form__div-colores__html-div1--active');
      divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
      divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');
      break;
    case 'div2':
      colorSeleccionado = '#ff4500';
      divColores.children[1].classList.toggle('container-form__form__div-colores__html-div2--active');
      divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
      divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');
      break;
    case 'div3':
      colorSeleccionado = '#ff0000';
      divColores.lastElementChild.classList.toggle('container-form__form__div-colores__html-div3--active');
      divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
      divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
      break;
    case undefined:
      errores.push('Color de tarea indefinido');
      break;
    case null:
      errores.push('Color de tarea null');
      break;
    default:
      errores.push('Color de tarea requerido');
      break;
  }
});

// 3.- FUNCIÓN QUE COMPARA Y VALIDA LA FECHA
const compararFechas = ((inputDate) => {
  const yearActual = date.getFullYear();
  let monthActual = (date.getMonth() + 1).toString();
  let dateActual = (date.getDate()).toString();

  if (monthActual.length <= 1) {
    monthActual = `0${monthActual}`;
  }

  if (dateActual.length <= 1) {
    dateActual = `0${dateActual}`;
  }

  const fechaActual = `${yearActual}-${monthActual}-${dateActual}`;

  if (inputDate < fechaActual) {
    return true;
  }
});

// 4.- FUNCIÓN QUE CREA LAS TAREAS
const crearTask = ((taskTitle, taskDate, taskColor) => {
  const task = {
    name: taskTitle,
    date: taskDate,
    color: taskColor,
    estado: false,
  };

  const transaction = db.transaction(['tasks'], 'readwrite');
  const objectStore = transaction.objectStore('tasks');
  const request = objectStore.add(task);

  request.onsuccess = (() => {
    errores = [];
    pError.textContent = '';
    colorSeleccionado = '';

    divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
    divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
    divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');

    containerError.classList.remove('container-error-visible');

    form.reset();
    mostrarTasks();
    form.input_item.focus();
  });

  request.onerror = ((eventError) => {
    if (eventError.target.error.code === 0) {
      errores.push('Error: La tarea ya exite en la BD');

      containerError.classList.add('container-error-visible');
      pError.textContent = '';
      pError.innerHTML = errores.join(', ');

      form.input_date.focus();
    }
  });
});

// 5.- FUNCIÓN PARA ELIMINAR TAREAS
const deleteTask = ((taskToDelete) => {
  const transaction = db.transaction(['tasks'], 'readwrite');
  const objectStore = transaction.objectStore('tasks');
  const request = objectStore.delete(taskToDelete);

  request.onsuccess = (() => {
    form.reset();
    mostrarTasks();
    form.input_item.focus();
  });

  request.onerror = (() => {
    errores.push('Error: tarea no eliminada de la BD');

    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
    form.input_date.focus();
  });
});

// 6.- FUNCIÓN PARA TAREA COMPLETADA
const completedTask = ((taskToCompleted) => {
  const transaction = db.transaction(['tasks'], 'readwrite');
  const objectStore = transaction.objectStore('tasks');
  const request = objectStore.get(taskToCompleted);

  request.onsuccess = (() => {
    const data = request.result;

    if (data.estado === true) {
      data.estado = false;
    } else {
      data.estado = true;
    }

    const requestFinal = objectStore.put(data);

    requestFinal.onsuccess = (() => {
      form.reset();
      mostrarTasks();
      form.input_item.focus();
    });

    requestFinal.onerror = ((error) => {
      errores.push(error);

      containerError.classList.add('container-error-visible');
      pError.textContent = '';
      pError.innerHTML = errores.join(', ');

      form.input_date.focus();
    });

    form.reset();
    mostrarTasks();
    form.input_item.focus();
  });

  request.onerror = ((error) => {
    errores.push(error);

    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');

    form.input_date.focus();
  });
});

// FUNCIÓN PARA BUSCAR DATOS DE TAREA A ACTUALIZAR
const getTask = ((taskToupdate) => {
  const transaction = db.transaction(['tasks'], 'readonly');
  const objectStore = transaction.objectStore('tasks');
  const request = objectStore.get(taskToupdate);

  request.onsuccess = (() => {
    const data = request.result;

    form.input_item.value = data.name;
    form.input_date.value = data.date;
    form.button.dataset.action = 'update';
    form.button.value = 'U';
  });

  request.onerror = ((error) => {
    errores.push(error);

    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');

    form.input_date.focus();
  });
});

// FUNCIÓN PARA ACTUALIZAR O MODIFICAR LAS TAREAS
const updateTask = ((taskTitle, taskDate, taskColor) => {
  const task = {
    name: taskTitle,
    date: taskDate,
    color: taskColor,
    estado: false,
  };

  const transaction = db.transaction(['tasks'], 'readwrite');
  const objectStore = transaction.objectStore('tasks');
  const request = objectStore.put(task);

  request.onsuccess = (() => {
    const data = request.result;

    form.input_item.value = data.name;
    form.input_date.value = data.date;
    form.button.dataset.action = 'add';
    form.button.value = '+';

    errores = [];
    pError.textContent = '';
    colorSeleccionado = '';

    divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
    divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
    divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');

    containerError.classList.remove('container-error-visible');

    form.reset();
    mostrarTasks();
    form.input_item.focus();
  });

  request.onerror = ((error) => {
    errores.push(error);

    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');

    form.input_date.focus();
  });
});
/* ============================================================================================== */

/* CÓDIGO PRINCIPAL Y EVENT LISTENER
================================================================================================= */

if (!IDB) {
  console.log('Este navegador no soporta indexedDB');
  alert('indexedDB no es soportado por este navegador');
} else {
  const request = IDB.open('DB_task', 1);

  request.onsuccess = (() => {
    db = request.result;
    console.log('OPEN', db);

    mostrarTasks();
  });

  request.onupgradeneeded = (() => {
    db = request.result;
    console.log('CREATE', db);

    const objectStore = db.createObjectStore('tasks', { keyPath: 'name' });
  });

  request.onerror = ((error) => {
    console.log('Error: ', error);
  });
}

// Coloca el foco en el input donde se agrega la tarea
form.input_item.focus();

// Evento de escucha del submit en el formulario
form.addEventListener('submit', (event) => {
  event.preventDefault();
  errores = [];

  if (form.input_item.value === '') {
    errores.push('Tarea descripción requerida');
    form.input_item.focus();
  } else if (form.input_item.value.length > 60) {
    errores.push(`De [1-60] caracteres, actuales ${form.input_item.value.length}`);
    form.input_item.focus();
  } else if ((colorSeleccionado === undefined) || (colorSeleccionado === null) || (colorSeleccionado === '')) {
    errores.push('Tarea color requerido');
    divColores.firstElementChild.focus();
  } else if (form.input_date.value === '') {
    errores.push('Tarea fecha requerida');
    form.input_date.focus();
  } else if (compararFechas(form.input_date.value) === true) {
    errores.push('Fecha menor a la actual');
    form.input_date.focus();
  }

  if (errores.length > 0) {
    event.preventDefault();
    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
  } else {
    const taskTitle = form.input_item.value;
    form.input_item.value = '';
    const taskDate = form.input_date.value;
    const taskColor = colorSeleccionado;

    if (event.target.button.dataset.action === 'add') {
      crearTask(taskTitle, taskDate, taskColor);
    } else if (event.target.button.dataset.action === 'update') {
      updateTask(taskTitle, taskDate, taskColor);
    }
  }
});

// Evento de escucha del DOM al terminar de cargar todos los elementos html, llama a la función
// mostrarTasks(), encargada de mostrar o pintar las tareas traidas desde el localStorage
document.addEventListener('DOMContentLoaded', mostrarTasks);

// Evento de escucha del Div contenedor de todas nuestras tareas, esto nos permitirá seleccionar
// en especial la etiqueta label con el simbolo de eliminar.
containerTareas.addEventListener('click', (event) => {
  event.preventDefault();

  if (event.target.innerHTML === 'X') {
    // Tarea seleccionada para eliminar
    const taskToDelete = (event.path[2].childNodes[0].innerText.trim());
    deleteTask(taskToDelete);
  } else if (event.target.innerHTML === 'Ѵ') {
    // Tarea seleccionada para marcar como completada
    const taskToCompleted = event.path[2].childNodes[0].innerText.trim();
    completedTask(taskToCompleted);
  } else if (event.path[0].tagName === 'SPAN') {
    // Tarea seleccionada para actualizar
    const taskToupdate = event.path[0].innerText.trim();
    getTask(taskToupdate);
  }
});
/* ============================================================================================== */
