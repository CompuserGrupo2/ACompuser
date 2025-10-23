import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../Componentes/Clientes/FormularioClientes";
import ListaClientes from "../Componentes/Clientes/ListaClientes";

const Clientes = ({ setPantalla }) => {
  const [clientes, setClientes] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    tipo_cliente: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  const manejoCambio = (nombre, valor) => {
    setNuevoCliente((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarCliente = async () => {
    try {
      if (
        nuevoCliente.nombre.trim() &&
        nuevoCliente.apellido.trim() &&
        nuevoCliente.cedula.trim() &&
        nuevoCliente.telefono.trim() &&
        nuevoCliente.tipo_cliente
      ) {
        await addDoc(collection(db, "Clientes"), nuevoCliente);
        setNuevoCliente({
          nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          tipo_cliente: "",
        });
        setModoEdicion(false);
        setClienteId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al guardar el cliente: ", error);
    }
  };

  const actualizarCliente = async () => {
    try {
      await updateDoc(doc(db, "Clientes", clienteId), nuevoCliente);
      setNuevoCliente({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        tipo_cliente: "",
      });
      setModoEdicion(false);
      setClienteId(null);
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar cliente: ", error);
    }
  };

  const editarCliente = (cliente) => {
    setNuevoCliente(cliente);
    setClienteId(cliente.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
        cargarDatos={cargarDatos}
      />

      {/* 🔹 Solo usamos la lista ahora */}
      <ListaClientes
        clientes={clientes}
        editarCliente={editarCliente}
        cargarDatos={cargarDatos}
      />
    </View>
  );

  return (
    <FlatList
      data={[{ id: "single-item" }]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default Clientes;
