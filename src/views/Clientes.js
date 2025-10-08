import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import FormularioClientes from '../Componentes/Clientes/FormularioClientes';
import ListaClientes from '../Componentes/Clientes/ListaClientes';
import TablaClientes from '../Componentes/Clientes/TablaClientes';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "Clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos} />
      <ListaClientes clientes={clientes} />
      <TablaClientes clientes={clientes} eliminarCliente={eliminarCliente} cargarDatos={cargarDatos} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Clientes;
