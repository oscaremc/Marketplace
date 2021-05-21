const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title titulo de los productos
 * @param {string} description descripcion de los productos
 * @param {string} imagen imagen de referencia de los productos
 */
const saveTask = (title, description, imagen) =>
  db.collection("tasks").doc().set({
    title,
    description,
    imagen,
  });

const getTasks = () => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask = (id) => db.collection("tasks").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="container-producto">
      <div class="boton-comprar">
        <button class="btn btn-primary btn-delete" data-id="${doc.id}">
          Comprar
        </button>
      </div>
    <h3 class="titulo-producto">${task.title}</h3>
    <p class="descripcion-producto">${task.description}</p>
    <img class="imagen-producto" src="${task.imagen}">
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  const imagen = taskForm["task-imagen"];

  try {
    if (!editStatus) {
      await saveTask(title.value, description.value, imagen.value);
    } else {
      await updateTask(id, {
        title: title.value,
        description: description.value,
        imagen: imagen.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});
