import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";

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
      <TouchableOpacity style={styles.boton} onPress={modoEdicion ? actualizarEmpleado : guardarEmpleado}>
        <Text style={styles.textoBoton}>{modoEdicion ? "Actualizar" : "Guardar"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  
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

export default FormularioEmpleados;