import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ListaEquipos from '../Componentes/Equipos/ListaEquipos';
import TablaEquipos from '../Componentes/Equipos/TablaEquipos';
import FormularioEquipos from '../Componentes/Equipos/FormularioEquipos';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "EquipoComputarizado"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipos(data);
    } catch (error) {
      console.error("Error al obtener equipos: ", error);
    }
  };

  const eliminarEquipo = async (id) => {
    try {
      await deleteDoc(doc(db, "EquipoComputarizado", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar equipo computarizado:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioEquipos cargarDatos={cargarDatos} />
      <ListaEquipos equipos={equipos} />
      <TablaEquipos
        equipos={equipos}
        eliminarEquipo={eliminarEquipo}
        cargarDatos={cargarDatos}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Equipos;
