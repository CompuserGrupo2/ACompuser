import React from "react";
import { View, TextInput, Text, StyleSheet, Alert, TouchableHighlight } from "react-native";
import { Picker } from "@react-native-picker/picker";

const FormularioClientes = ({
  nuevoCliente,
  manejoCambio,
  guardarCliente,
  actualizarCliente,
  modoEdicion,
  cargarDatos,
}) => {
  const tiposValidos = ["Regular", "Nuevo", "Vip", "Premium"];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Cliente" : "Registro de Cliente"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoCliente.nombre}
        onChangeText={(valor) => manejoCambio("nombre", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={nuevoCliente.apellido}
        onChangeText={(valor) => manejoCambio("apellido", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={nuevoCliente.cedula}
        onChangeText={(valor) => manejoCambio("cedula", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={nuevoCliente.telefono}
        onChangeText={(valor) => manejoCambio("telefono", valor)}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Tipo de Cliente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={nuevoCliente.tipo_cliente}
          onValueChange={(itemValue) => manejoCambio("tipo_cliente", itemValue)}
        >
          <Picker.Item label="Seleccione tipo" value="" />
          {tiposValidos.map((t) => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>
      </View>
      <TouchableHighlight
        style={styles.boton}
        underlayColor="#0056b3"
        onPress={modoEdicion ? actualizarCliente : guardarCliente}
      >
        <Text style={styles.textoBoton}>
          {modoEdicion ? "Actualizar Cliente" : "Agregar Cliente"}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  label: { marginBottom: 5, fontWeight: "bold" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  boton: { backgroundColor: "#007BFF", padding: 12, borderRadius: 5, alignItems: "center" },
  textoBoton: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default FormularioClientes;