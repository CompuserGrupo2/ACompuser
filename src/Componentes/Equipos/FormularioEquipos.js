import React from "react";
import { View, TextInput, Text, Alert, StyleSheet, TouchableHighlight } from "react-native";
import SelectorClientes from "./SelectorClientes";

const FormularioEquipos = ({
  nuevoEquipo,
  manejoCambio,
  guardarEquipo,
  actualizarEquipo,
  modoEdicion,
  cargarDatos,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Equipo" : "Registro de Equipos"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={nuevoEquipo.color}
        onChangeText={(valor) => manejoCambio("color", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={nuevoEquipo.marca}
        onChangeText={(valor) => manejoCambio("marca", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={nuevoEquipo.modelo}
        onChangeText={(valor) => manejoCambio("modelo", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={nuevoEquipo.tipo}
        onChangeText={(valor) => manejoCambio("tipo", valor)}
      />
      <SelectorClientes
        onClienteSeleccionado={(cliente) => manejoCambio("cliente", cliente)}
        clienteSeleccionado={nuevoEquipo.cliente}
      />
      <TouchableHighlight
        style={styles.boton}
        underlayColor="#0056b3"
        onPress={modoEdicion ? actualizarEquipo : guardarEquipo}
      >
        <Text style={styles.textoBoton}>
          {modoEdicion ? "Actualizar" : "Guardar"}
        </Text>
      </TouchableHighlight>
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
  boton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormularioEquipos;