import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import ListaEmpleados from "../Componentes/Empleados/ListaEmpleados";
import FormularioEmpleados from "../Componentes/Empleados/FormularioEmpleados";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    direccion: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Empleados"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener empleados: ", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await deleteDoc(doc(db, "Empleados", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoEmpleado((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarEmpleado = async () => {
    try {
      if (
        nuevoEmpleado.nombre.trim() &&
        nuevoEmpleado.apellido.trim() &&
        nuevoEmpleado.cedula.trim() &&
        nuevoEmpleado.telefono.trim() &&
        nuevoEmpleado.direccion.trim()
      ) {
        await addDoc(collection(db, "Empleados"), {
          nombre: nuevoEmpleado.nombre.trim(),
          apellido: nuevoEmpleado.apellido.trim(),
          cedula: nuevoEmpleado.cedula.trim(),
          telefono: nuevoEmpleado.telefono.trim(),
          direccion: nuevoEmpleado.direccion.trim(),
        });
        setNuevoEmpleado({
          nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          direccion: "",
        });
        setModoEdicion(false);
        setEmpleadoId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al guardar el empleado: ", error);
    }
  };

  const actualizarEmpleado = async () => {
    try {
      if (
        nuevoEmpleado.nombre.trim() &&
        nuevoEmpleado.apellido.trim() &&
        nuevoEmpleado.cedula.trim() &&
        nuevoEmpleado.telefono.trim() &&
        nuevoEmpleado.direccion.trim()
      ) {
        await updateDoc(doc(db, "Empleados", empleadoId), {
          nombre: nuevoEmpleado.nombre.trim(),
          apellido: nuevoEmpleado.apellido.trim(),
          cedula: nuevoEmpleado.cedula.trim(),
          telefono: nuevoEmpleado.telefono.trim(),
          direccion: nuevoEmpleado.direccion.trim(),
        });
        setNuevoEmpleado({
          nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          direccion: "",
        });
        setModoEdicion(false);
        setEmpleadoId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar empleado: ", error);
    }
  };

  const editarEmpleado = (empleado) => {
    setNuevoEmpleado({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      cedula: empleado.cedula,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
    });
    setEmpleadoId(empleado.id);
    setModoEdicion(true);
    setModalVisible(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      {/* ENCABEZADO  */}
      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Text style={styles.headerTitle}>Empleados</Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => {
          setModoEdicion(false);
          setNuevoEmpleado({
            nombre: "",
            apellido: "",
            cedula: "",
            telefono: "",
            direccion: "",
          });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Nuevo Empleado</Text>
      </TouchableOpacity>

      <FormularioEmpleados
        nuevoEmpleado={nuevoEmpleado}
        manejoCambio={manejoCambio}
        guardarEmpleado={guardarEmpleado}
        actualizarEmpleado={actualizarEmpleado}
        modoEdicion={modoEdicion}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <ListaEmpleados
        empleados={empleados}
        eliminarEmpleado={eliminarEmpleado}
        editarEmpleado={editarEmpleado}
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
  },
});

export default Empleados;