import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";

const BotonEditarUsuario = ({ id, contraseñaInicial, correoInicial, rolInicial, usuarioInicial, cargarDatos }) => {
  const [visible, setVisible] = useState(false);
  const [contraseña, setContraseña] = useState(contraseñaInicial);
  const [correo, setCorreo] = useState(correoInicial);
  const [rol, setRol] = useState(rolInicial);
  const [usuario, setUsuario] = useState(usuarioInicial);

  const guardarCambios = async () => {
    try {
      const usuarioRef = doc(db, "Usuarios", id);
      await updateDoc(usuarioRef, {
        contraseña,
        correo,
        rol,
        usuario,
      });
      setVisible(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al editar usuario:", error);
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
            <Text style={styles.titulo}>Editar Usuario</Text>

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={contraseña}
              onChangeText={setContraseña}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Rol"
              value={rol}
              onChangeText={setRol}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={usuario}
              onChangeText={setUsuario}
            />

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

export default BotonEditarUsuario;
