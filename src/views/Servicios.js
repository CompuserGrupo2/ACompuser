import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioServicios from "../Componentes/Servicios/FormularioServicios";
import TablaServicios from "../Componentes/Servicios/TablaServicios";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

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

  const validarDatos = async (datos) => {
    try{
      const response = await fetch("https://qvl4nb6q3d.execute-api.us-east-2.amazonaws.com/validarservicio", {
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

  const guardarServicio = async () => {
    const datosValidados = await validarDatos(nuevoServicio);
    if(datosValidados) {
      try {
        await addDoc(collection(db, "Servicios"), {
          descripcion: datosValidados.descripcion,
          costo: parseFloat(datosValidados.costo),
          foto: datosValidados.foto,
        });
        cargarDatos();
        setNuevoServicio({descripcion: "", costo: "", foto: "",})
        setModoEdicion(false);
        setServicioId(null);
        setModalVisible(false);
        Alert.alert("Éxito", "Servicio registrado correctamente.");
      } catch (error) {
        console.error("Error al registrar servicio:", error);
      }
    }
  };

  const actualizarServicio = async () => {
    const datosValidados = await validarDatos(nuevoServicio);
    if (datosValidados) {
      try {
        await updateDoc(doc(db, "Servicios", servicioId), {
          descripcion: datosValidados.descripcion,
          costo: parseFloat(datosValidados.costo),
          foto: datosValidados.foto,
        });
        setNuevoServicio({ descripcion: "", costo: "", foto: ""});
        setModoEdicion(false);
        setServicioId(null);
        cargarDatos();
        setModalVisible(false);
        Alert.alert("Éxito", "Servicio actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar servicio: ", error);
      }
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