import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";

const BotonEditarClientes = ({ equipoId, clienteId, cliente, cargarDatos }) => {
  const [visible, setVisible] = useState(false);
  const [nombre, setNombre] = useState(cliente.nombre);
  const [apellido, setApellido] = useState(cliente.apellido);
  const [cedula, setCedula] = useState(cliente.cedula);
  const [telefono, setTelefono] = useState(cliente.telefono);
  const [tipoCliente, setTipoCliente] = useState(cliente.tipo_cliente);

  const guardarCambios = async () => {
    try {
      const clienteRef = doc(db, "EquipoComputarizado", equipoId, "Clientes", clienteId);
      await updateDoc(clienteRef, { nombre, apellido, cedula, telefono, tipo_cliente: tipoCliente });
      setVisible(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.boton} onPress={() => setVisible(true)}>
        <Text style={styles.textoBoton}>✏️</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Editar Cliente</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
            <TextInput style={styles.input} placeholder="Cédula" value={cedula} onChangeText={setCedula} />
            <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} />
            <TextInput style={styles.input} placeholder="Tipo Cliente" value={tipoCliente} onChangeText={setTipoCliente} />

            <View style={styles.fila}>
              <TouchableOpacity style={[styles.botonAccion, styles.cancelar]} onPress={() => setVisible(false)}>
                <Text style={styles.textoAccion}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonAccion, styles.confirmar]} onPress={guardarCambios}>
                <Text style={styles.textoAccion}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: { padding: 4, borderRadius: 5, backgroundColor: "#99c99a", alignItems: "center" },
  textoBoton: { color: "white", fontSize: 14 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10, width: "100%" },
  fila: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  botonAccion: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 5, alignItems: "center" },
  cancelar: { backgroundColor: "#b4afafff" },
  confirmar: { backgroundColor: "#4caf50" },
  textoAccion: { color: "white", fontWeight: "bold" },
});

export default BotonEditarClientes;
