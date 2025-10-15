import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";

const FormularioEmpleados = ({
  nuevoEmpleado,
  manejoCambio,
  guardarEmpleado,
  actualizarEmpleado,
  modoEdicion,
  cargarDatos,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Empleado" : "Registro de Empleados"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoEmpleado.nombre}
        onChangeText={(valor) => manejoCambio("nombre", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={nuevoEmpleado.apellido}
        onChangeText={(valor) => manejoCambio("apellido", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={nuevoEmpleado.cedula}
        onChangeText={(valor) => manejoCambio("cedula", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={nuevoEmpleado.telefono}
        onChangeText={(valor) => manejoCambio("telefono", valor)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={nuevoEmpleado.direccion}
        onChangeText={(valor) => manejoCambio("direccion", valor)}
      />
      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarEmpleado : guardarEmpleado}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioEmpleados;