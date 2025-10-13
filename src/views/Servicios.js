import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import FormularioServicios from "../Componentes/Servicios/FormularioServicios";
import TablaServicios from "../Componentes/Servicios/TablaServicios";

const Servicios = ({ setPantalla }) => {
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
      <TablaServicios servicios={servicios} eliminarServicio={eliminarServicio} cargarDatos={cargarDatos} />
      <View style={styles.buttonContainer}>
        <Button title="Ir a Empleados" onPress={() => setPantalla('empleados')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Servicios;