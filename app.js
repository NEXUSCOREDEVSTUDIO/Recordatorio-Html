// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAaz09QjFw5qp5fiN9jH6fhj1CykH3UYPU",
    authDomain: "mama-chequer.firebaseapp.com",
    databaseURL: "https://mama-chequer-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mama-chequer",
    storageBucket: "mama-chequer.firebasestorage.app",
    messagingSenderId: "959340556338",
    appId: "1:959340556338:web:cb9e61adebfe33142e0c2b",
    measurementId: "G-R2XJKPM04G"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tareasRef = ref(db, "tareas");

// Elementos del DOM
const tareaInput = document.getElementById("tareaInput");
const agregarBtn = document.getElementById("agregarBtn");
const borrarTodoBtn = document.getElementById("borrarTodoBtn");
const listaTareas = document.getElementById("listaTareas");

// Escuchar cambios en tiempo real
onValue(tareasRef, (snapshot) => {
    listaTareas.innerHTML = "";
    const tareas = snapshot.val();
    if (tareas) {
        Object.keys(tareas).forEach(id => {
            const tarea = tareas[id];
            mostrarTarea(id, tarea.texto, tarea.hecha);
        });
    }
});

// Agregar tarea
agregarBtn.addEventListener("click", () => {
    const texto = tareaInput.value.trim();
    if (texto !== "") {
        const nuevaTareaRef = push(tareasRef);
        set(nuevaTareaRef, {
            texto: texto,
            hecha: false
        });
        tareaInput.value = "";
    }
});

// Borrar todas las tareas
borrarTodoBtn.addEventListener("click", () => {
    if (confirm("¿Seguro quieres borrar todas las tareas?")) {
        remove(tareasRef);
    }
});

// Mostrar tarea en la lista
function mostrarTarea(id, texto, hecha) {
    const li = document.createElement("li");
    li.textContent = texto;
    li.style.textDecoration = hecha ? "line-through" : "none";

    // Botón para marcar como hecha
    const btnHecha = document.createElement("button");
    btnHecha.textContent = hecha ? "Desmarcar" : "Hecha";
    btnHecha.style.marginLeft = "10px";
    btnHecha.addEventListener("click", () => {
        update(ref(db, `tareas/${id}`), { hecha: !hecha });
    });

    // Botón para eliminar tarea
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.addEventListener("click", () => {
        remove(ref(db, `tareas/${id}`));
    });

    li.appendChild(btnHecha);
    li.appendChild(btnEliminar);
    listaTareas.appendChild(li);
}
