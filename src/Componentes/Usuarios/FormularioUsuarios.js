import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";

const FormularioUsuarios = ({
  nuevoUsuario,
  manejoCambio,
  guardarUsuario,
  actualizarUsuario,
  modoEdicion,
  cargarDatos,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Usuario" : "Registro de Usuarios"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={nuevoUsuario.contraseña}
        onChangeText={(valor) => manejoCambio("contraseña", valor)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={nuevoUsuario.correo}
        onChangeText={(valor) => manejoCambio("correo", valor)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Rol"
        value={nuevoUsuario.rol}
        onChangeText={(valor) => manejoCambio("rol", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={nuevoUsuario.usuario}
        onChangeText={(valor) => manejoCambio("usuario", valor)}
      />
      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarUsuario : guardarUsuario}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioUsuarios;