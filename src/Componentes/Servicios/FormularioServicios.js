import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioServicios = ({ cargarDatos }) => {
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");

  const guardarServicio = async () => {
    if (descripcion.trim() && costo.trim()) {
      try {
        await addDoc(collection(db, "Servicios"), {
          descripcion: descripcion.trim(),
          costo: parseFloat(costo),
        });
        setDescripcion("");
        setCosto("");
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar el servicio: ", error);
      }
    } else {
      Alert.alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Servicios</Text>
      <TextInput style={styles.input} placeholder="Descripción del servicio" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Costo" value={costo} onChangeText={setCosto} keyboardType="numeric" />
      <Button title="Guardar" onPress={guardarServicio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioServicios;