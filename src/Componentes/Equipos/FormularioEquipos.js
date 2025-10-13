import React, { useState } from "react";
import { View, TextInput, Text, Alert, StyleSheet, TouchableHighlight } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import SelectorClientes from "./SelectorClientes";

const FormularioEquipos = ({ cargarDatos }) => {
  const [color, setColor] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const guardarEquipo = async () => {
    if (color && marca && modelo && tipo && clienteSeleccionado) {
      try {
        // Guardar equipo con los datos del cliente seleccionados
        await addDoc(collection(db, "EquipoComputarizado"), {
          color,
          marca,
          modelo,
          tipo,
          cliente: {
            nombre: clienteSeleccionado.nombre,
            apellido: clienteSeleccionado.apellido,
            telefono: clienteSeleccionado.telefono
          }
        });

        // Limpiar formulario
        setColor(""); 
        setMarca(""); 
        setModelo(""); 
        setTipo(""); 
        setClienteSeleccionado(null);
        cargarDatos();
      } catch (error) {
        console.error("Error al guardar el equipo:", error);
      }
    } else {
      Alert.alert("Por favor completa todos los campos y selecciona un cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Equipos</Text>

      <TextInput style={styles.input} placeholder="Color" value={color} onChangeText={setColor} />
      <TextInput style={styles.input} placeholder="Marca" value={marca} onChangeText={setMarca} />
      <TextInput style={styles.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
      <TextInput style={styles.input} placeholder="Tipo" value={tipo} onChangeText={setTipo} />

      <SelectorClientes onClienteSeleccionado={setClienteSeleccionado} />

      <TouchableHighlight style={styles.boton} underlayColor="#0056b3" onPress={guardarEquipo}>
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
    backgroundColor: "#007BFF", 
    padding: 12, 
    borderRadius: 5, 
    alignItems: "center" 
  },

  textoBoton: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});

export default FormularioEquipos;
