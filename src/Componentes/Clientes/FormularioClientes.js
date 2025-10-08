import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Alert, TouchableHighlight } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioClientes = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");

  const tiposValidos = ["Regular", "Nuevo", "VIP", "Premium"];

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

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Tipo de Cliente</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoCliente}
          onValueChange={(itemValue) => setTipoCliente(itemValue)}
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
        onPress={guardarCliente}
      >
        <Text style={styles.textoBoton}>Guardar</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  label: { marginBottom: 5, fontWeight: "bold" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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

export default FormularioClientes;
