import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioClientes = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");

  const guardarCliente = async () => {
    if (nombre.trim() && apellido.trim() && cedula.trim() && telefono.trim() && tipoCliente.trim()) {
      try {
        await addDoc(collection(db, "Clientes"), {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          cedula: cedula.trim(),
          telefono: telefono.trim(),
          tipo_cliente: tipoCliente.trim(),
        });
        // Limpiar campos después de guardar
        setNombre("");
        setApellido("");
        setCedula("");
        setTelefono("");
        setTipoCliente("");
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar el cliente: ", error);
      }
    } else {
      Alert.alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Clientes</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Cédula" value={cedula} onChangeText={setCedula} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Tipo de Cliente" value={tipoCliente} onChangeText={setTipoCliente} />
      <Button title="Guardar" onPress={guardarCliente} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioClientes;
