import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioUsuarios = ({ cargarDatos }) => {
  const [contraseña, setContraseña] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [usuario, setUsuario] = useState("");

  const guardarUsuario = async () => {
    if (contraseña.trim() && correo.trim() && rol.trim() && usuario.trim()) {
      try {
        await addDoc(collection(db, "Usuarios"), {
          contraseña: contraseña.trim(),
          correo: correo.trim(),
          rol: rol.trim(),
          usuario: usuario.trim(),
        });
        setContraseña("");
        setCorreo("");
        setRol("");
        setUsuario("");
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar el usuario: ", error);
      }
    } else {
      Alert.alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Usuarios</Text>
      <TextInput style={styles.input} placeholder="Contraseña" value={contraseña} onChangeText={setContraseña} secureTextEntry />
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Rol" value={rol} onChangeText={setRol} />
      <TextInput style={styles.input} placeholder="Usuario" value={usuario} onChangeText={setUsuario} />
      <Button title="Guardar" onPress={guardarUsuario} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioUsuarios;
