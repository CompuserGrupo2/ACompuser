import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import ListaEquipos from "../Componentes/Equipos/ListaEquipos";
import FormularioEquipos from "../Componentes/Equipos/FormularioEquipos";
import { Ionicons } from "@expo/vector-icons";

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

  const validarDatos = async (datos) => {
    try{
      const response = await fetch("https://qvl4nb6q3d.execute-api.us-east-2.amazonaws.com/validarequipo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if(resultado.success) {
        return resultado.data; //Datos limpios y validados
      } else {
        Alert.alert("Errores en los datos", resultado.errors.join("\n"));
        return null;
      }
    } catch (error) {
      console.error("Error al validar con Lambda:", error);
      Alert.alert("Error", "No se pudo validar la información con el servidor.");
      return null;
    }
  };

  const guardarEquipo = async () => {
    const datosValidados = await validarDatos(nuevoEquipo);
    if(datosValidados) {
      try {
        await addDoc(collection(db, "EquipoComputarizado"), {
          color: datosValidados.color,
          marca: datosValidados.marca,
          modelo: datosValidados.modelo,
          tipo: datosValidados.tipo,
          cliente: datosValidados.cliente,
        });
        cargarDatos();
        setNuevoEquipo({color: "", marca: "", modelo: "", tipo: "", cliente: null})
        setModoEdicion(false);
        setEquipoId(null);
        setModalVisible(false);
        Alert.alert("Éxito", "Equipo registrado correctamente.");
      } catch (error) {
        console.error("Error al registrar equipo:", error);
      }
    }
  };

  const actualizarEquipo = async () => {
    const datosValidados = await validarDatos(nuevoEquipo);
    if (datosValidados) {
      try {
        await updateDoc(doc(db, "EquipoComputarizado", equipoId), {
          color: datosValidados.color,
          marca: datosValidados.marca,
          modelo: datosValidados.modelo,
          tipo: datosValidados.tipo,
          cliente: datosValidados.cliente,
        });
        setNuevoEquipo({ color: "", marca: "", modelo: "", tipo: "", cliente: null });
        setModoEdicion(false);
        setEquipoId(null);
        cargarDatos();
        setModalVisible(false);
        Alert.alert("Éxito", "Equipo actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar equipo: ", error);
      }
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