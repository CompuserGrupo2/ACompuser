// Servicios.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioServicios from "../Componentes/Servicios/FormularioServicios";
import TablaServicios from "../Componentes/Servicios/TablaServicios";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); 
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioId, setServicioId] = useState(null);
  const [nuevoServicio, setNuevoServicio] = useState({
    descripcion: "",
    costo: "",
    foto: "",
  });

  const cargarDatos = async (retornar = false) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        descripcion: doc.data().descripcion || "",
        costo: doc.data().costo || 0,
        foto: doc.data().foto || '',
      }));
      setServicios(data);

      if (retornar) return data;
    } catch (error) {
      console.error("Error al obtener servicios: ", error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const generarExcel = async () => {
    try {
      const servicios = await cargarDatos(true);
      if (servicios.length === 0) {
        throw new Error("No hay datos en la colección 'servicios'.");
      }

      const response = await fetch("https://z3blln1wq7.execute-api.us-east-2.amazonaws.com/generarReporteServicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: servicios })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);

      const fileUri = FileSystem.documentDirectory + "reporte_servicios.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Descargar Reporte de Servicios'
        });
      } else {
        alert("Compartir no disponible.");
      }
      alert("Excel de servicios generado y listo para descargar.");
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error: " + error.message);
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

  const manejoCambio = (nombre, valor) => {
    setNuevoServicio((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarServicio = async () => {
    try {
      if (nuevoServicio.descripcion.trim() && nuevoServicio.costo.trim() && nuevoServicio.foto.trim()) {
        await addDoc(collection(db, "Servicios"), {
          descripcion: nuevoServicio.descripcion.trim(),
          costo: parseFloat(nuevoServicio.costo),
          foto: nuevoServicio.foto.trim(),
        });
        setNuevoServicio({ descripcion: "", costo: "", foto: "" });
        setModoEdicion(false);
        setServicioId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al guardar el servicio: ", error);
    }
  };

  const actualizarServicio = async () => {
    try {
      if (nuevoServicio.descripcion.trim() && nuevoServicio.costo.trim() && nuevoServicio.foto.trim()) {
        await updateDoc(doc(db, "Servicios", servicioId), {
          descripcion: nuevoServicio.descripcion.trim(),
          costo: parseFloat(nuevoServicio.costo),
          foto: nuevoServicio.foto.trim(),
        });
        setNuevoServicio({ descripcion: "", costo: "", foto: "" });
        setModoEdicion(false);
        setServicioId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar servicio: ", error);
    }
  };

  const editarServicio = (servicio) => {
    setNuevoServicio({
      descripcion: servicio.descripcion,
      costo: servicio.costo.toString(),
      foto: servicio.foto,
    });
    setServicioId(servicio.id);
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
        <Text style={styles.headerTitle}>Servicios</Text>
      </LinearGradient>

      {/* Botón Servicio */}
      <TouchableOpacity
        style={styles.boton}
        onPress={() => {
          setModoEdicion(false);
          setNuevoServicio({ descripcion: "", costo: "", foto: "" });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Nuevo Servicio</Text>
      </TouchableOpacity>

      {/* Modal del formulario */}
      <FormularioServicios
        nuevoServicio={nuevoServicio}
        manejoCambio={manejoCambio}
        guardarServicio={guardarServicio}
        actualizarServicio={actualizarServicio}
        modoEdicion={modoEdicion}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      {/* Botón Generar Excel */}
      <View style={styles.botonContainer}>
        <TouchableOpacity style={styles.botonGenerar} onPress={generarExcel}>
          <Ionicons name="download-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.textoBoton}>Generar Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de servicios */}
      <TablaServicios
        servicios={servicios}
        eliminarServicio={eliminarServicio}
        editarServicio={editarServicio}
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
    backgroundColor: "#f8f9fa",
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
  botonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  botonGenerar: {
    backgroundColor: "#27AE60",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Servicios;