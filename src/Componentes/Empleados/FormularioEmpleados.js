import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioEmpleados = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const guardarEmpleado = async () => {
    if (nombre.trim() && apellido.trim() && cedula.trim() && telefono.trim() && direccion.trim()) {
      try {
        await addDoc(collection(db, "Empleados"), {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          cedula: cedula.trim(),
          telefono: telefono.trim(),
          direccion: direccion.trim(),
        });
        setNombre("");
        setApellido("");
        setCedula("");
        setTelefono("");
        setDireccion("");
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar el empleado: ", error);
      }
    } else {
      Alert.alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Empleados</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Cédula" value={cedula} onChangeText={setCedula} />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} />
      <Button title="Guardar" onPress={guardarEmpleado} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioEmpleados;