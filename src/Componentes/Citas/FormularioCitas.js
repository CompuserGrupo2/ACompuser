import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../../Database/firebaseconfig";

const FormularioCitas = ({ cargarCitas }) => {
  const [fecha, setFecha] = useState(null);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");

  const guardarCita = async () => {
    if (!fecha) {
      Alert.alert("Por favor, seleccione una fecha y hora.");
      return;
    }

    const ahora = new Date();

    if (fecha < ahora) {
      Alert.alert(
        "Fecha no válida",
        "No puedes agendar una cita en una fecha u hora pasada."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión para agendar una cita.");
        return;
      }

      const nombreUsuario = user.displayName || user.email.split("@")[0];

      await addDoc(collection(db, "Citas"), {
        fecha_cita: Timestamp.fromDate(fecha),
        estado: "pendiente",
        nombreUsuario: nombreUsuario,
        userId: user.uid, // ← UID REAL (100% SEGURO)
        creado_en: Timestamp.fromDate(new Date()),
      });

      Alert.alert("¡Éxito!", "Cita agendada correctamente");
      setFecha(null);
      cargarCitas();
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      Alert.alert("Error", "No se pudo agendar la cita");
    }
  };

  const mostrarSelector = (modo) => {
    setModoPicker(modo);
    setMostrarPicker(true);
  };

  const onChange = (_, selectedDate) => {
    setMostrarPicker(false);
    if (selectedDate) {
      if (modoPicker === "date") {
        const nuevaFecha = new Date(selectedDate);
        setFecha(nuevaFecha);
        if (Platform.OS === "android") mostrarSelector("time");
      } else {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setHours(selectedDate.getHours());
        nuevaFecha.setMinutes(selectedDate.getMinutes());
        setFecha(nuevaFecha);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agendar Cita</Text>

      <Text style={styles.label}>Fecha y Hora</Text>
      <TouchableOpacity
        style={styles.inputFecha}
        onPress={() => mostrarSelector("date")}
      >
        <Text>
          {fecha ? fecha.toLocaleString("es-ES") : "Seleccione fecha y hora"}
        </Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={fecha || new Date()}
          mode={modoPicker}
          display="default"
          onChange={onChange}
        />
      )}

      <TouchableOpacity style={styles.boton} onPress={guardarCita}>
        <Text style={styles.textoBoton}>Agendar Cita</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f7fa",
    borderRadius: 10,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputFecha: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  boton: {
    backgroundColor: "#5b9ce5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FormularioCitas;