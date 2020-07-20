"use strict";

/* UBICACIÓN DE ELEMENTOS HTML, CREACIÓN DE CONSTANTES Y VARIABLES
================================================================================================= */
var form = document.querySelector('#container-form__form');
var divColores = document.querySelector('#div-colores');
var containerTareas = document.querySelector('#container-tareas');
var containerError = document.querySelector('#container-error');
var pError = document.querySelector('#container-error__parrafo');
var IDB = window.indexedDB;
var db;
var date = new Date();
var colorSeleccionado;
var errores = [];
/* ============================================================================================== */

/* FUNCIONES
================================================================================================= */
// 1.- FUNCIÓN QUE MUESTRA LAS TAREAS TRAIDAS DESDE LA BD INDEXDB EN NUESTRO HTML

var mostrarTasks = function mostrarTasks() {
  var transaction = db.transaction(['tasks'], 'readonly');
  var objectStore = transaction.objectStore('tasks');
  var request = objectStore.openCursor();
  var fragment = document.createDocumentFragment();

  request.onsuccess = function () {
    var cursor = request.result;

    if (cursor) {
      if (cursor.value.estado) {
        var div1 = document.createElement('DIV');
        div1.className = 'container-tareas__item';
        div1.style = "background-color: ".concat(cursor.value.color);
        var div2 = document.createElement('DIV');
        div2.className = 'container-tareas__item__div-span';
        var span = document.createElement('SPAN');
        span.className = 'container-tareas__item__div-span__span';
        span.setAttribute('id', 'span');
        span.style = 'text-decoration: line-through';
        span.textContent = "".concat(cursor.value.name);
        var div3 = document.createElement('DIV');
        div3.className = 'container-tareas__item__div-date';
        var label = document.createElement('LABEL');
        label.className = 'container-tareas__item__div-date__date';
        label.textContent = "".concat(cursor.value.date);
        var div4 = document.createElement('DIV');
        div4.className = 'container-tareas__item__div-modificar';
        var label2 = document.createElement('LABEL');
        label2.className = 'container-tareas__item__div-modificar__label-modificar';
        label2.textContent = 'Ѵ';
        var div5 = document.createElement('DIV');
        div5.className = 'container-tareas__item__div-borrar';
        var label3 = document.createElement('LABEL');
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
        cursor["continue"]();
      } else {
        var _div = document.createElement('DIV');

        _div.className = 'container-tareas__item';
        _div.style = "background-color: ".concat(cursor.value.color);

        var _div2 = document.createElement('DIV');

        _div2.className = 'container-tareas__item__div-span';

        var _span = document.createElement('SPAN');

        _span.className = 'container-tareas__item__div-span__span';

        _span.setAttribute('id', 'span');

        _span.textContent = "".concat(cursor.value.name);

        var _div3 = document.createElement('DIV');

        _div3.className = 'container-tareas__item__div-date';

        var _label = document.createElement('LABEL');

        _label.className = 'container-tareas__item__div-date__date';
        _label.textContent = "".concat(cursor.value.date);

        var _div4 = document.createElement('DIV');

        _div4.className = 'container-tareas__item__div-modificar';

        var _label2 = document.createElement('LABEL');

        _label2.className = 'container-tareas__item__div-modificar__label-modificar';
        _label2.textContent = 'Ѵ';

        var _div5 = document.createElement('DIV');

        _div5.className = 'container-tareas__item__div-borrar';

        var _label3 = document.createElement('LABEL');

        _label3.className = 'container-tareas__item__div-borrar__label-borrar';
        _label3.textContent = 'X';

        _div2.appendChild(_span);

        _div.appendChild(_div2);

        _div3.appendChild(_label);

        _div.appendChild(_div3);

        _div4.appendChild(_label2);

        _div.appendChild(_div4);

        _div5.appendChild(_label3);

        _div.appendChild(_div5);

        fragment.appendChild(_div);
        cursor["continue"]();
      }
    } else {
      containerTareas.innerHTML = '';
      containerTareas.appendChild(fragment);
    }
  };

  request.onerror = function (eventError) {
    console.log(eventError);
  };
}; // 2.- SELECCIONA EL COLOR DE FONDO DE LA TAREA (Delegación de Eventos)


divColores.addEventListener('click', function (event) {
  event.preventDefault();
  var colorTarea = event.target.classList[1];

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
}); // 3.- FUNCIÓN QUE COMPARA Y VALIDA LA FECHA

var compararFechas = function compararFechas(inputDate) {
  var yearActual = date.getFullYear();
  var monthActual = (date.getMonth() + 1).toString();
  var dateActual = date.getDate().toString();

  if (monthActual.length <= 1) {
    monthActual = "0".concat(monthActual);
  }

  if (dateActual.length <= 1) {
    dateActual = "0".concat(dateActual);
  }

  var fechaActual = "".concat(yearActual, "-").concat(monthActual, "-").concat(dateActual);

  if (inputDate < fechaActual) {
    return true;
  }
}; // 4.- FUNCIÓN QUE CREA LAS TAREAS


var crearTask = function crearTask(taskTitle, taskDate, taskColor) {
  var task = {
    name: taskTitle,
    date: taskDate,
    color: taskColor,
    estado: false
  };
  var transaction = db.transaction(['tasks'], 'readwrite');
  var objectStore = transaction.objectStore('tasks');
  var request = objectStore.add(task);

  request.onsuccess = function () {
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
  };

  request.onerror = function (eventError) {
    if (eventError.target.error.code === 0) {
      errores.push('Error: La tarea ya exite en la BD');
      containerError.classList.add('container-error-visible');
      pError.textContent = '';
      pError.innerHTML = errores.join(', ');
      form.input_date.focus();
    }
  };
}; // 5.- FUNCIÓN PARA ELIMINAR TAREAS


var deleteTask = function deleteTask(taskToDelete) {
  var transaction = db.transaction(['tasks'], 'readwrite');
  var objectStore = transaction.objectStore('tasks');
  var request = objectStore["delete"](taskToDelete);

  request.onsuccess = function () {
    form.reset();
    mostrarTasks();
    form.input_item.focus();
  };

  request.onerror = function () {
    errores.push('Error: tarea no eliminada de la BD');
    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
    form.input_date.focus();
  };
}; // 6.- FUNCIÓN PARA TAREA COMPLETADA


var completedTask = function completedTask(taskToCompleted) {
  var transaction = db.transaction(['tasks'], 'readwrite');
  var objectStore = transaction.objectStore('tasks');
  var request = objectStore.get(taskToCompleted);

  request.onsuccess = function () {
    var data = request.result;

    if (data.estado === true) {
      data.estado = false;
    } else {
      data.estado = true;
    }

    var requestFinal = objectStore.put(data);

    requestFinal.onsuccess = function () {
      form.reset();
      mostrarTasks();
      form.input_item.focus();
    };

    requestFinal.onerror = function (error) {
      errores.push(error);
      containerError.classList.add('container-error-visible');
      pError.textContent = '';
      pError.innerHTML = errores.join(', ');
      form.input_date.focus();
    };

    form.reset();
    mostrarTasks();
    form.input_item.focus();
  };

  request.onerror = function (error) {
    errores.push(error);
    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
    form.input_date.focus();
  };
}; // FUNCIÓN PARA BUSCAR DATOS DE TAREA A ACTUALIZAR


var getTask = function getTask(taskToupdate) {
  var transaction = db.transaction(['tasks'], 'readonly');
  var objectStore = transaction.objectStore('tasks');
  var request = objectStore.get(taskToupdate);

  request.onsuccess = function () {
    var data = request.result;
    form.input_item.value = data.name;
    form.input_date.value = data.date;
    form.button.dataset.action = 'update';
    form.button.value = 'U';
  };

  request.onerror = function (error) {
    errores.push(error);
    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
    form.input_date.focus();
  };
}; // FUNCIÓN PARA ACTUALIZAR O MODIFICAR LAS TAREAS


var updateTask = function updateTask(taskTitle, taskDate, taskColor) {
  var task = {
    name: taskTitle,
    date: taskDate,
    color: taskColor,
    estado: false
  };
  var transaction = db.transaction(['tasks'], 'readwrite');
  var objectStore = transaction.objectStore('tasks');
  var request = objectStore.put(task);

  request.onsuccess = function () {
    var data = request.result;
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
  };

  request.onerror = function (error) {
    errores.push(error);
    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
    form.input_date.focus();
  };
};
/* ============================================================================================== */

/* CÓDIGO PRINCIPAL Y EVENT LISTENER
================================================================================================= */


if (!IDB) {
  console.log('Este navegador no soporta indexedDB');
  alert('indexedDB no es soportado por este navegador');
} else {
  var request = IDB.open('DB_task', 1);

  request.onsuccess = function () {
    db = request.result;
    console.log('OPEN', db);
    mostrarTasks();
  };

  request.onupgradeneeded = function () {
    db = request.result;
    console.log('CREATE', db);
    var objectStore = db.createObjectStore('tasks', {
      keyPath: 'name'
    });
  };

  request.onerror = function (error) {
    console.log('Error: ', error);
  };
} // Coloca el foco en el input donde se agrega la tarea


form.input_item.focus(); // Evento de escucha del submit en el formulario

form.addEventListener('submit', function (event) {
  event.preventDefault();
  errores = [];

  if (form.input_item.value === '') {
    errores.push('Tarea descripción requerida');
    form.input_item.focus();
  } else if (form.input_item.value.length > 60) {
    errores.push("De [1-60] caracteres, actuales ".concat(form.input_item.value.length));
    form.input_item.focus();
  } else if (colorSeleccionado === undefined || colorSeleccionado === null || colorSeleccionado === '') {
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
    var taskTitle = form.input_item.value;
    form.input_item.value = '';
    var taskDate = form.input_date.value;
    var taskColor = colorSeleccionado;

    if (event.target.button.dataset.action === 'add') {
      crearTask(taskTitle, taskDate, taskColor);
    } else if (event.target.button.dataset.action === 'update') {
      updateTask(taskTitle, taskDate, taskColor);
    }
  }
}); // Evento de escucha del DOM al terminar de cargar todos los elementos html, llama a la función
// mostrarTasks(), encargada de mostrar o pintar las tareas traidas desde el localStorage

document.addEventListener('DOMContentLoaded', mostrarTasks); // Evento de escucha del Div contenedor de todas nuestras tareas, esto nos permitirá seleccionar
// en especial la etiqueta label con el simbolo de eliminar.

containerTareas.addEventListener('click', function (event) {
  event.preventDefault();

  if (event.target.innerHTML === 'X') {
    // Tarea seleccionada para eliminar
    var taskToDelete = event.path[2].childNodes[0].innerText.trim();
    deleteTask(taskToDelete);
  } else if (event.target.innerHTML === 'Ѵ') {
    // Tarea seleccionada para marcar como completada
    var taskToCompleted = event.path[2].childNodes[0].innerText.trim();
    completedTask(taskToCompleted);
  } else if (event.path[0].tagName === 'SPAN') {
    // Tarea seleccionada para actualizar
    var taskToupdate = event.path[0].innerText.trim();
    getTask(taskToupdate);
  }
});
/* ============================================================================================== */