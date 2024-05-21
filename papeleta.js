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

let bti = document.getElementById("inser");
let btc = document.getElementById("consu");


const tablaPapeleta = document.querySelector("#tbPapeleta")

bti.addEventListener('click', async (e) => {
  try {
    // Verificar si algún campo de unidad está vacío
    const unidadCampos = document.querySelectorAll('.unidad-select');
    let algunoVacio = false;
    unidadCampos.forEach((campo) => {
      if (campo.value === '') {
        algunoVacio = true;
      }
    });

    // Si algún campo de unidad está vacío, no registrar ese campo
    const registro = {
      Matricula: document.getElementById("mat_pap").value,
      Programa: document.getElementById("pro_edu_pap").value,
      Semestre: document.getElementById("sem_pap").value,
      Grupo: document.getElementById("gru_pap").value,
      Registro: "Maribel Guardia",     
    };

    if (!algunoVacio) {
      // Si no hay campos de unidad vacíos, agregar los campos de unidad al registro
      const unidades = {};
      unidadCampos.forEach((campo) => {
        unidades[campo.id] = campo.value;
      });
      registro.unidades = unidades;
    }

    // Registrar el documento en la base de datos
    const docRef = await addDoc(collection(db, "Papeleta"), registro);
    console.log("Documento registrado con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al agregar documento: ", error);
  }
});


btc.addEventListener('click', async (e)=> {

  ShowUsers()
  viewUsuarios2()
  
})


async function ShowUsers() {

  tbPapeleta.innerHTML = ""
  const Allusers = await ViewUsuarios()

  Allusers.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //  console.log(doc.id, " => ", doc.data());
      const datos = doc.data()
      
      tbPapeleta.innerHTML += `<tr class = "regis" data-id="${doc.id}">
      <td>${datos.Matricula}</td>
      <td>${datos.Programa}</td>
    
      <td>${datos.Semestre}</td>
      <td>${datos.Grupo}</td>
      <td>
          <button class="btn-primary btn m-1 editar_" data-id="${doc.id}" >
           Editar 
          <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
          </button> 

          <button class="btn-danger btn eliminar_"  data-id="${doc.id}|${datos.Matricula}|${datos.Programa}" >
          Eliminar 
          <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
          
          </button>
      </td>
   
      </tr>`

  });


}

 async function ViewUsuarios() {
  const userRef = collection(db, "Papeleta")
  const Allusers = await getDocs(userRef)
  return Allusers
}

async function viewUsuarios2(){

  const q = query(collection(db, "Papeleta"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const cities = [];

  querySnapshot.forEach((doc) => {
      cities.push(doc.data().nombre);     
  });
  console.log("Current cities in CA: ", cities.join(", "));
});
}

$("#tbPapeleta").on("click", ".eliminar_", async function () {

  const producto_id = $(this).data("id")
  console.log("click en " + producto_id)
 let datox = producto_id.split('|')
 console.log("datos  " + datox[1])
  try {
     
    await deleteDoc(doc(db, "Papeleta", datox[0]));

  } catch (error) {
      console.log("error", error)

  }

})


$("#tbPapeleta").on("click", ".editar_", async function () {

  const producto_id = $(this).data("id")
  console.log("click en editar" + producto_id)

  try {
    const washingtonRef = doc(db, "Papeleta", producto_id.toString());

    await updateDoc(washingtonRef, {
      Matricula: document.getElementById("mat_pap").value,
      Programa: document.getElementById("pro_edu_pap").value,
      Semestre: document.getElementById("sem_pap").value,
      Grupo: document.getElementById("gru_pap").value,
      Registro:"Maribel Guardia",  
    });

  } catch (error) {
      console.log("error", error)
  }
})


$("#tbPapeleta").on("click",".regis", async function () {

  const producto_id = $(this).data("id")
  console.log("click en " + producto_id)


  try {
     
  } catch (error) {
      console.log("error", error)

  }

})

async function obtenerIdsUnidades() {
  try {
    const unidadesRef = collection(db, "Unidades");
    const snapshot = await getDocs(unidadesRef);
    const ids = [];
    snapshot.forEach((doc) => {
      ids.push(doc.id);
    });
    return ids;
  } catch (error) {
    console.error("Error al obtener IDs de unidades:", error);
    return [];
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const unidadesRef = collection(db, "Unidades");
    const unidadesSnapshot = await getDocs(unidadesRef);
    const selectElement = document.getElementById("cla_uni");
    
    unidadesSnapshot.forEach((doc) => {
      const unidadId = doc.id;
      const unidadData = doc.data(); 
      const optionText = `${unidadId} - ${unidadData.Nombre}`;
      const option = document.createElement("option");
      option.value = unidadId;
      option.textContent = optionText;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las unidades:", error);
  }
});