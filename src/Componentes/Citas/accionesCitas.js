import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../Database/firebaseconfig";

// Confirmar cita
export const confirmarCita = async (idCita) => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    await updateDoc(citaRef, {
      estado: "confirmado",
    });
    console.log("Cita confirmada correctamente");
  } catch (error) {
    console.error("Error al confirmar cita:", error);
  }
};

// Cancelar cita
export const cancelarCita = async (idCita) => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    await updateDoc(citaRef, {
      estado: "cancelada",
    });
    console.log("Cita cancelada correctamente");
  } catch (error) {
    console.error("Error al cancelar cita:", error);
  }
};

// Posponer cita (ADMIN)
export const posponerCita = async (idCita, nuevaFecha, motivo = "") => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    const snapshot = await getDoc(citaRef);

    if (!snapshot.exists()) throw new Error("Cita no encontrada");

    await updateDoc(citaRef, {
      fecha_cita: Timestamp.fromDate(nuevaFecha), 
      estado: "pospuesta",
      motivo_posposicion: motivo || "Pospuesta por el administrador",
    });

    console.log("Cita pospuesta correctamente a:", nuevaFecha);
  } catch (error) {
    console.error("Error al posponer cita:", error);
  }
};

// Editar cita (CLIENTE)
export const editarCitaCliente = async (idCita, nuevaFecha) => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    const snapshot = await getDoc(citaRef);

    if (!snapshot.exists()) throw new Error("Cita no encontrada");

    await updateDoc(citaRef, {
      fecha_cita: Timestamp.fromDate(nuevaFecha),
      estado: "pendiente",
    });

    console.log("Cita editada correctamente a:", nuevaFecha);
  } catch (error) {
    console.error("Error al editar cita:", error);
  }
};