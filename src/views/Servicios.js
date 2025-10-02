import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ListaServicios from "../Componentes/Servicios/ListaServicios";
import FormularioServicios from "../Componentes/Servicios/FormularioServicios";
import TablaServicios from "../Componentes/Servicios/TablaServicios";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServicios(data);
    } catch (error) {
      console.error("Error al obtener servicios: ", error);
    }
  };

  const eliminarServicio = async (id) => {
    try {
      await deleteDoc(doc(db, "Servicios", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioServicios cargarDatos={cargarDatos} />
      <ListaServicios servicios={servicios} />
      <TablaServicios servicios={servicios} eliminarServicio={eliminarServicio} cargarDatos={cargarDatos} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Servicios;
