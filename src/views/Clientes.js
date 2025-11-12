import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../Componentes/Clientes/FormularioClientes";
import ListaClientes from "../Componentes/Clientes/ListaClientes";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 

const Clientes = ({ setPantalla }) => {
  const [clientes, setClientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
      {/* ENCABEZADO */}
      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Text style={styles.headerTitle}>Clientes</Text>
      </LinearGradient>

      <TouchableOpacity
        style={{
          backgroundColor: "#369AD9",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 15,
          marginTop: 25,
          borderRadius: 10,
          marginBottom: 20,
          marginHorizontal: 20,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Nuevo Cliente</Text>
      </TouchableOpacity>

      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
        cargarDatos={cargarDatos}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <ListaClientes
        clientes={clientes}
        editarCliente={(cliente) => {
          editarCliente(cliente);
          setModalVisible(true);
        }}
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
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 26
  },
});

export default Clientes;