import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
//import { getFirestore } from "./node_modules/firebase/firebase-firestore-lite.js";

import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVeIl1xZxBBwzaTrn2V2e8CCOR4GlgAF8",
  authDomain: "universidad-81fd7.firebaseapp.com",
  projectId: "universidad-81fd7",
  storageBucket: "universidad-81fd7.appspot.com",
  messagingSenderId: "36928367817",
  appId: "1:36928367817:web:57b1392e258f55e3d93118",
  measurementId: "G-H35QM0MP16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let bti =  document.getElementById("inser");
let btc =  document.getElementById("consu");

const tablaUnidades = document.querySelector("#tbUnidades");

bti.addEventListener('click', async (e) => {
  e.preventDefault();

  const clave = document.getElementById("clave").value;
  const nombre = document.getElementById("nombre").value;
  const año = document.getElementById("año").value;
  const periodo = document.getElementById("periodo").value;
  const categoria = document.getElementById("categoria").value;
  const creditos = document.getElementById("creditos").value;

  if (!clave || !nombre || !año || !periodo || !categoria || !creditos) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  
  try {
    const docRef = await setDoc(
      doc(db, "Unidades", clave),
      {
        Clave: clave,
        Nombre: nombre,
        Año: año,
        Periodo: periodo,
        Categoria: categoria,
        Creditos: creditos,
        Registro: "Paquita la del Barrio",
      }
    );
    const overlayDiv = mostrarOverlay();
    const mensajeErrorHTML = `
      <div id="mensaje-completado" class="mensaje-completado">
        <p>Subiendo Registro...</p>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", mensajeErrorHTML);
    const mensajeError = document.getElementById("mensaje-completado");
    setTimeout(() => {
      mensajeError.remove();
      overlayDiv.remove();
    }, 3000);
  } catch (error) {
    console.error("Error al agregar el documento: ", error);
  }
});


btc.addEventListener('click', async (e)=> {
  ShowUsers();
  viewUsuarios2(); 
});

async function ShowUsers() {
  tbUnidades.innerHTML = "";
  const Allusers = await ViewUsuarios();
  Allusers.forEach((doc) => {
    const datos = doc.data();
    tbUnidades.innerHTML += `<tr class = "regis" data-id="${doc.id}">
    <td>${datos.Clave}</td>
    <td>${datos.Nombre}</td>
    <td>${datos.Creditos}</td>
    <td>
      <button class="btn-primary btn m-1 editar_" data-id="${doc.id}" >
        Editar 
      <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
      </button> 
      <button class="btn-danger btn eliminar_"  data-id="${doc.id}|${datos.Clave}|${datos.Nombre}" >
        Eliminar 
      <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
      </button>
    </td>
    </tr>`;
  });
}

async function ViewUsuarios() {
  const userRef = collection(db, "Unidades");
  const Allusers = await getDocs(userRef);
  return Allusers;
}

async function viewUsuarios2() {
  const q = query(collection(db, "Unidades"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const cities = [];
    querySnapshot.forEach((doc) => {
      cities.push(doc.data().nombre);     
    });
    console.log("Current cities in CA: ", cities.join(", "));
  });
}

$("#tbUnidades").on("click", ".eliminar_", async function () {
  const producto_id = $(this).data("id");
  console.log("click en " + producto_id);
  let datox = producto_id.split('|');
  console.log("datos  " + datox[1]);
  try {
    await deleteDoc(doc(db, "Unidades", datox[0]));
  } catch (error) {
    console.log("error", error);
  }
});

$("#tbUnidades").on("click", ".editar_", async function () {
  const producto_id = $(this).data("id");
  console.log("click en editar" + producto_id);
  try {
    const washingtonRef = doc(db, "Unidades", producto_id.toString());
    console.log(washingtonRef);
    await updateDoc(washingtonRef, {
      Nombre: document.getElementById("nombre").value,
      Año: document.getElementById("año").value,
      Periodo: document.getElementById("periodo").value,
      Categoria: document.getElementById("categoria").value,
      Creditos: document.getElementById("creditos").value,
      Registro:"Paquita la del Barrio",
    });
  } catch (error) {
    console.log("error", error);
  }
});

function mostrarOverlay() {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.position = "fixed";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.width = "100%";
  overlayDiv.style.height = "100%";
  overlayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
  overlayDiv.style.zIndex = "999";
  overlayDiv.id = "overlay-div";
  document.body.appendChild(overlayDiv);
  return overlayDiv;
}