import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../Componentes/Clientes/FormularioClientes";
import ListaClientes from "../Componentes/Clientes/ListaClientes";
import { Ionicons } from "@expo/vector-icons";

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

  const validarDatos = async (datos) => {
    try {
      const response = await fetch("https://qvl4nb6q3d.execute-api.us-east-2.amazonaws.com/validarcliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if (resultado.success) {
        return resultado.data;
      } else {
        const mensajeErrores = resultado.errors ? resultado.errors.join("\n") : resultado.message || "Error desconocido";
        Alert.alert("Errores en los datos", mensajeErrores);
        return null;
      }
    } catch (error) {
      console.error("Error al validar con Lambda:", error);
      Alert.alert("Error", "No se pudo validar la información con el servidor.");
      return null;
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
    const datosValidados = await validarDatos(nuevoCliente);
    if(datosValidados) {
      try {
        await addDoc(collection(db, "Clientes"), {
          nombre: datosValidados.nombre,
          apellido: datosValidados.apellido,
          cedula: datosValidados.cedula,
          telefono: datosValidados.telefono,
          tipo_cliente: datosValidados.tipo_cliente,
        });
        cargarDatos();
        setNuevoCliente({nombre: "", apellido: "", cedula: "", telefono: "", tipo_cliente: ""})
        setModoEdicion(false);
        setClienteId(null);
        setModalVisible(false);
        Alert.alert("Éxito", "Cliente registrado correctamente.");
      } catch (error) {
        console.error("Error al registrar cliente:", error);
      }
    }
  };

  const actualizarCliente = async () => {
    const datosValidados = await validarDatos(nuevoCliente);
    if (datosValidados) {
      try {
        await updateDoc(doc(db, "Clientes", clienteId), {
          nombre: datosValidados.nombre,
          apellido: datosValidados.apellido,
          cedula: datosValidados.cedula,
          telefono: datosValidados.telefono,
          tipo_cliente: datosValidados.tipo_cliente,
        });
        setNuevoCliente({ nombre: "", apellido: "", cedula: "",  telefono: "", tipo_cliente: ""});
        setModoEdicion(false);
        setClienteId(null);
        cargarDatos();
        setModalVisible(false);
        Alert.alert("Éxito", "Cliente actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar cliente: ", error);
      }
    }
  };

  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      cedula: cliente.cedula,
      telefono: cliente.telefono.toString(),
      tipo_cliente: cliente.tipo_cliente,
    });
    setClienteId(cliente.id);
    setModoEdicion(true);
    setModalVisible(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <TouchableOpacity
        style={ styles.boton }
        onPress={() => {
          setModoEdicion(false);
          setClienteId(null);
          setNuevoCliente({
            nombre: "",
            apellido: "",
            cedula: "",
            telefono: "",
            tipo_cliente: "",
          });
          setModalVisible(true);
        }}
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
        setVisible={(valor) => {
          setModalVisible(valor);
          if (!valor) {
            setModoEdicion(false);
            setClienteId(null);
            setNuevoCliente({
              nombre: "",
              apellido: "",
              cedula: "",
              telefono: "",
              tipo_cliente: "",
            });
          }
        }}
      />

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
  boton: {
    backgroundColor: "#369AD9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginTop: 25,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  }
});

export default Clientes;