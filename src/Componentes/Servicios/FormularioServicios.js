import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";

const FormularioServicios = ({
  nuevoServicio,
  manejoCambio,
  guardarServicio,
  actualizarServicio,
  modoEdicion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Servicio" : "Registro de Servicios"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción del servicio"
        value={nuevoServicio.descripcion}
        onChangeText={(valor) => manejoCambio("descripcion", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Costo"
        value={nuevoServicio.costo}
        onChangeText={(valor) => manejoCambio("costo", valor)}
        keyboardType="numeric"
      />
      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarServicio : guardarServicio}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default FormularioServicios;