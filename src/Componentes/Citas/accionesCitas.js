import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../Database/firebaseconfig";

export const confirmarCita = async (idCita) => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    await updateDoc(citaRef, { estado: "confirmado" });
    console.log("Cita confirmada correctamente");
  } catch (error) {
    console.error("Error al confirmar cita:", error);
    throw error;
  }
};

export const cancelarCita = async (idCita) => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    await updateDoc(citaRef, { estado: "cancelada" });
    console.log("Cita cancelada correctamente");
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    throw error;
  }
};

export const posponerCita = async (idCita, nuevaFecha, motivo = "") => {
  try {
    const citaRef = doc(db, "Citas", idCita);
    const snapshot = await getDoc(citaRef);

    if (!snapshot.exists()) throw new Error("Cita no encontrada");

    await updateDoc(citaRef, {
      fecha_cita: Timestamp.fromDate(nuevaFecha),
      estado: "pospuesta",
      motivo_posposicion: motivo || "Reprogramada por el administrador",
    });

    console.log("Cita pospuesta correctamente a:", nuevaFecha);
  } catch (error) {
    console.error("Error al posponer cita:", error);
    throw error;
  }
};

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
    throw error;
  }
};