import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableHighlight } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioEquipos = ({ cargarDatos }) => {
  const [color, setColor] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("");

  const guardarEquipo = async () => {
    if (color.trim() && marca.trim() && modelo.trim() && tipo.trim()) {
      try {
        await addDoc(collection(db, "EquipoComputarizado"), {
          color: color.trim(),
          marca: marca.trim(),
          modelo: modelo.trim(),
          tipo: tipo.trim(),
        });
        setColor("");
        setMarca("");
        setModelo("");
        setTipo("");
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar el equipo: ", error);
      }
    } else {
      Alert.alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Equipos</Text>
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={marca}
        onChangeText={setMarca}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={modelo}
        onChangeText={setModelo}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TouchableHighlight
        style={styles.boton}
        underlayColor="#0056b3"   // color al presionar
        onPress={guardarEquipo}
      >
        <Text style={styles.textoBoton}>Guardar</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10
  },
  boton: {
    backgroundColor: "#007BFF",  // azul por defecto
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});

export default FormularioEquipos;