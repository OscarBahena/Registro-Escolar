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
  try {
    const docRef = await setDoc(doc(db, "Unidades", document.getElementById("clave").value ), {
        Clave: document.getElementById("clave").value,
        Nombre: document.getElementById("nombre").value,
        Año: document.getElementById("año").value,
        Periodo: document.getElementById("periodo").value,
        Categoria: document.getElementById("categoria").value,
        Creditos: document.getElementById("creditos").value,
        Registro:"Paquita la del Barrio",
    });
  } catch (e) {
    console.error("Error adding document: ", e);
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

$("#tbUnidades").on("click",".regis", async function () {
  const producto_id = $(this).data("id");
  console.log("click en " + producto_id);
  try {
  } catch (error) {
      console.log("error", error);
  }
});
