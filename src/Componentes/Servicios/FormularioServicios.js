import React, { act } from "react";
import { View, TextInput, Button, TouchableOpacity, StyleSheet, Text, Alert, Image, } from "react-native";
import ModalFotos from "./ModalFotos";


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
      <Text style={styles.label}>Foto (URL o nombre del archivo)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. https://miimagen.com/foto.png"
        value={nuevoServicio.foto}
        onChangeText={(valor) => manejoCambio("foto", valor)}
      />
        {nuevoServicio.foto ? (
        <Image
          source={{ uri: nuevoServicio.foto }}
          style={styles.preview}
          resizeMode="contain"

        />
      ) : (
        <Text style={styles.mensajePreview}>La imagen se mostrará aquí</Text>
      )}
      <TouchableOpacity style={styles.boton} onPress={modoEdicion ? actualizarServicio : guardarServicio}>
        <Text style={styles.textoBoton}>{modoEdicion ? "Actualizar" : "Guardar"}</Text>
      </TouchableOpacity>
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
    backgroundColor: '#7C7CFF',
    paddingVertical: 15,
    borderRadius: 10,
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
   preview: {
    width: '80%',
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#e8e8ff',
  },
  mensajePreview: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 15,
    fontStyle: 'italic',
  },
});


export default FormularioServicios;