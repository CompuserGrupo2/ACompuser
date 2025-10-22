import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
        placeholder="Correo"
        value={nuevoUsuario.correo}
        onChangeText={(valor) => manejoCambio("correo", valor.toLowerCase())}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={nuevoUsuario.contraseña}
        onChangeText={(valor) => manejoCambio("contraseña", valor)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={nuevoUsuario.usuario}
        onChangeText={(valor) => manejoCambio("usuario", valor)}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={nuevoUsuario.rol}
          onValueChange={(valor) => manejoCambio("rol", valor)}
          >
          <Picker.Item label="Seleccione un rol" value="" />
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="Cliente" value="Cliente" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.boton} onPress={modoEdicion ? actualizarUsuario : guardarUsuario}>
        <Text style={styles.textoBoton}>{modoEdicion ? "Actualizar" : "Guardar"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  boton: {
    backgroundColor: '#369AD9',
    paddingVertical: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginTop: 10,
  },
  textoBoton: {
    color: '#f7f7ff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default FormularioUsuarios;