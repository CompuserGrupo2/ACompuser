import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker"; //libreria de selector de lista

const FormularioCalificacion = ({ cargarDatos }) => {
  const [calidad, setCalidad] = useState("");
  const [comentario, setComentario] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [cargando, setCargando] = useState(true);

  // Cargar los servicios disponibles de Firestore
  const cargarServicios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        descripcion: doc.data().descripcion,
      }));
      setServicios(lista);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // Guardar calificación dentro del servicio seleccionado
  const agregarCalificacion = async () => {
    if (!servicioSeleccionado || !calidad || !comentario) {
      alert("Por favor completa todos los campos y selecciona un servicio.");
      return;
    }

    try {
      await addDoc(collection(db, "Servicios", servicioSeleccionado, "Calificaciones"), {
        Calidad_servicio: Number(calidad),
        comentario,
        fecha_calificacion: new Date().toISOString().split("T")[0],
      });
      alert("Calificación registrada correctamente ✅");
      setCalidad("");
      setComentario("");
      setServicioSeleccionado("");
      cargarDatos && cargarDatos();
    } catch (error) {
      console.error("Error al agregar calificación:", error);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#369AD9" />
        <Text>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Calificación</Text>

      {/* Selector de servicios */}
      <View style={styles.selectorContainer}>
        <Picker
          selectedValue={servicioSeleccionado}
          onValueChange={(itemValue) => setServicioSeleccionado(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Selecciona un servicio --" value="" />
          {servicios.map((servicio) => (
            <Picker.Item
              key={servicio.id}
              label={servicio.descripcion}
              value={servicio.id}
            />
          ))}
        </Picker>
      </View>
        
        {/* Calidad */}
      <TextInput
        style={styles.input}
        placeholder="Calidad del servicio (1-5)"
        keyboardType="numeric"
        value={calidad}
        onChangeText={setCalidad}
      />

        {/* Comentario */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Comentario"
        multiline
        numberOfLines={3}
        value={comentario}
        onChangeText={setComentario}
      />

      <TouchableOpacity style={styles.boton} onPress={agregarCalificacion}>
        <Text style={styles.textoBoton}>Guardar Calificación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 18, 
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#fbfcfdff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D0D0D",
    marginBottom: 10,
    textAlign: "left", 
  },
  selectorContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#faf7f7f8",
    borderRadius: 8,
    borderColor: "#7E84F2",
    borderWidth: 1,
    color: "#0D0D0D",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#bdbdc7ff",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  boton: {
    backgroundColor: "#369AD9",
    padding: 10,
    borderRadius: 1,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FormularioCalificacion;
