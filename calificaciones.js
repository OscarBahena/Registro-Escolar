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
const tbCalificaciones = document.querySelector("#tbCalificaciones");

btc.addEventListener('click', async (e) => {
  try {
    tbCalificaciones.innerHTML = "";
    const unidadesRef = collection(db, "Unidades");
    const unidadesSnapshot = await getDocs(unidadesRef);
    unidadesSnapshot.forEach(async (unidadDoc) => {
      const unidadId = unidadDoc.id;
      const unidadData = unidadDoc.data();
      const registrosRef = collection(db, "Unidades", unidadId, "Acreditados");
      const registrosSnapshot = await getDocs(registrosRef);
      registrosSnapshot.forEach((registroDoc) => {
        const registroData = registroDoc.data();
        tbCalificaciones.innerHTML += `<tr class="regis" data-id="${registroDoc.id}">
          <td>${registroData.Clave}</td>
          <td>${registroData.Matricula}</td>
          <td>${registroData.Calificacion}</td>
          <td>${registroData.Ciclo}</td>
          <td>
            <button class="btn-primary btn m-1 editar_" data-id="${registroDoc.id}|${unidadId}">
              Editar 
              <span class="spinner-border spinner-border-sm" id="Edit-${registroDoc.id}" style="display: none;"></span>
            </button>        
            <button class="btn-danger btn eliminar_" data-id="${registroDoc.id}|${registroData.Clave}|${registroData.Matricula}">
              Eliminar 
              <span class="spinner-border spinner-border-sm" id="elim-${registroDoc.id}" style="display: none;"></span>
            </button>
          </td>
        </tr>`;
      });
    });
  } catch (error) {
    console.error("Error al mostrar registros:", error);
  }
});

bti.addEventListener('click', async (e) => {
  try {
    const matricula = document.getElementById("mat_etu").value; 
    const unidadSeleccionada = document.getElementById("cla_uni").value;
    const calificacion = document.getElementById("calificacion").value;

    if (calificacion === "NC" || calificacion === "6") {
      let subcoleccion = "";
      if (calificacion === "NC") {
          subcoleccion = "NoCurso";
      } else {
          subcoleccion = "DesAcreditados";
      }

      const subcoleccionRef = collection(db, "Unidades", unidadSeleccionada, subcoleccion);
      const snapshot = await getDocs(subcoleccionRef);

      if (snapshot.empty) {
        const newmatricula = matricula + "-01";
        const docRef = doc(subcoleccionRef, newmatricula);
        await setDoc(docRef, {
            Clave: document.getElementById("cla_uni").value,
            Matricula: matricula, 
            Catedratico: document.getElementById("catedratico").value,
            Calificacion: calificacion,
            Ciclo: document.getElementById("ciclo").value,
            Registro: "Pancho Villa",
        });
        console.log("La subcolección no existe");
      } else {
        let intento = 1;
        let registroID = matricula + "-0" + intento;
        
        let registroExiste = false;
        snapshot.forEach(doc => {
          if (doc.id === registroID) {
            registroExiste = true;
            return;
          }
        });
        
        while (registroExiste && intento < 3) {
          intento++;
          registroID = matricula + "-0" + intento;
          registroExiste = false;
          snapshot.forEach(doc => {
            if (doc.id === registroID) {
              registroExiste = true;
              return;
            }
          });
        }

        if (registroExiste && intento >= 3) {
          const mensajeErrorHTML = `
            <div id="mensaje-error" class="mensaje-error">
              <p>Número de Intentos Excedido. Subir Reporte</p>
            </div>
          `;
          document.body.insertAdjacentHTML("beforeend", mensajeErrorHTML);
          const mensajeError = document.getElementById("mensaje-error");
          setTimeout(() => {
            mensajeError.remove();
          }, 4000);      
        } else {
          const docRef = doc(subcoleccionRef, registroID);
          await setDoc(docRef, {
            Clave: document.getElementById("cla_uni").value,
            Matricula: matricula, 
            Catedratico: document.getElementById("catedratico").value,
            Calificacion: calificacion,
            Ciclo: document.getElementById("ciclo").value,
            Registro: "Pancho Villa",
          });
        }
      }
      } else {
          const docRef = doc(collection(db, "Unidades", unidadSeleccionada, "Acreditados"), matricula);
          await setDoc(docRef, {
            Clave: document.getElementById("cla_uni").value,
            Matricula: matricula, 
            Catedratico: document.getElementById("catedratico").value,
            Calificacion: calificacion,
            Ciclo: document.getElementById("ciclo").value,
          Registro: "Pancho Villa",
      });
    }
    console.log("Document written with ID: ", matricula);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

$("#tbCalificaciones").on("click", ".eliminar_", async function () {
  try {
    const producto_id = $(this).data("id");
    const [registro_id, unidad_id] = producto_id.split('|');
    await deleteDoc(doc(db, "Unidades", unidad_id, "Acreditados", registro_id));
  } catch (error) {
    console.log("error", error);
  }
});

$("#tbCalificaciones").on("click", ".editar_", async function () {
  try {
    const ids = $(this).data("id").split('|');
    const registro_id = ids[0];
    const unidad_id = ids[1];
    const registroRef = doc(db, "Unidades", unidad_id, "Acreditados", registro_id);
    await updateDoc(registroRef, {
      Catedratico: document.getElementById("catedratico").value,
      Calificacion: document.getElementById("calificacion").value,
      Ciclo: document.getElementById("ciclo").value,
      Registro: "Pancho Villa",
    });
  } catch (error) {
    console.log("Error:", error);
  }
});

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
