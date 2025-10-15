import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioCitas = ({ cargarCitas }) => {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");

  const guardarCita = async () => {
    if (!fecha) {
      Alert.alert("Por favor, seleccione una fecha y hora.");
      return;
    }

    try {
      await addDoc(collection(db, "Citas"), {
        fecha_cita: fecha.toISOString(),
        estado: "pendiente",
      });

      Alert.alert("✅ Cita agendada con éxito");
      setFecha(new Date());
      cargarCitas();
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      Alert.alert("Error al guardar la cita", error.message);
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
      <TouchableOpacity style={styles.inputFecha} onPress={() => mostrarSelector("date")}>
        <Text>{fecha.toLocaleString()}</Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode={modoPicker}
          display="default"
          onChange={onChange}
        />
      )}

      <TouchableOpacity style={styles.boton} onPress={guardarCita}>
        <Text style={styles.textoBoton}>Agendar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: "#f5f7fa", 
    borderRadius: 10, 
    marginBottom: 20 
  },

  titulo: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center" 
  },

  label: { 
    fontWeight: "bold", 
    marginBottom: 5 
  },

  inputFecha: { 
    padding: 12, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    marginBottom: 20, 
    backgroundColor: "#fff" 
  },

  boton: { 
    backgroundColor: "#4a90e2", 
    padding: 10, 
    borderRadius: 5, 
    
    alignItems: "center" 
  },

  textoBoton: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});

export default FormularioCitas;
