import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import ListaEquipos from "../Componentes/Equipos/ListaEquipos";
import FormularioEquipos from "../Componentes/Equipos/FormularioEquipos";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoId, setEquipoId] = useState(null);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    color: "",
    marca: "",
    modelo: "",
    tipo: "",
    cliente: null,
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "EquipoComputarizado"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  const manejoCambio = (nombre, valor) => {
    setNuevoEquipo((prev) => ({ ...prev, [nombre]: valor }));
  };

  const guardarEquipo = async () => {
    try {
      if (
        nuevoEquipo.color.trim() &&
        nuevoEquipo.marca.trim() &&
        nuevoEquipo.modelo.trim() &&
        nuevoEquipo.tipo.trim() &&
        nuevoEquipo.cliente
      ) {
        await addDoc(collection(db, "EquipoComputarizado"), nuevoEquipo);
        setNuevoEquipo({ color: "", marca: "", modelo: "", tipo: "", cliente: null });
        setModoEdicion(false);
        setEquipoId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos y seleccione un cliente.");
      }
    } catch (error) {
      console.error("Error al guardar el equipo: ", error);
    }
  };

  const actualizarEquipo = async () => {
    try {
      await updateDoc(doc(db, "EquipoComputarizado", equipoId), nuevoEquipo);
      setNuevoEquipo({ color: "", marca: "", modelo: "", tipo: "", cliente: null });
      setModoEdicion(false);
      setEquipoId(null);
      cargarDatos();
      setModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar equipo: ", error);
    }
  };

  const editarEquipo = (equipo) => {
    setNuevoEquipo(equipo);
    setEquipoId(equipo.id);
    setModoEdicion(true);
    setModalVisible(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      {/* ENCABEZADO */}
      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Text style={styles.headerTitle}>Equipos</Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => {
          setModoEdicion(false);
          setNuevoEquipo({ color: "", marca: "", modelo: "", tipo: "", cliente: null });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Nuevo Equipo</Text>
      </TouchableOpacity>

      <FormularioEquipos
        nuevoEquipo={nuevoEquipo}
        manejoCambio={manejoCambio}
        guardarEquipo={guardarEquipo}
        actualizarEquipo={actualizarEquipo}
        modoEdicion={modoEdicion}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <ListaEquipos
        equipos={equipos}
        eliminarEquipo={eliminarEquipo}
        editarEquipo={editarEquipo}
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

export default Equipos;