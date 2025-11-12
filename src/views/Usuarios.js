import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import ListaUsuarios from "../Componentes/Usuarios/ListaUsuarios";
import FormularioUsuarios from "../Componentes/Usuarios/FormularioUsuarios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // AGREGADO

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    contraseña: "",
    correo: "",
    rol: "",
    usuario: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "Usuarios", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoUsuario((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarUsuario = async () => {
    try {
      if (
        nuevoUsuario.contraseña.trim() &&
        nuevoUsuario.correo.trim() &&
        nuevoUsuario.rol.trim() &&
        nuevoUsuario.usuario.trim()
      ) {
        await addDoc(collection(db, "Usuarios"), {
          contraseña: nuevoUsuario.contraseña.trim(),
          correo: nuevoUsuario.correo.trim(),
          rol: nuevoUsuario.rol.trim(),
          usuario: nuevoUsuario.usuario.trim(),
        });
        setNuevoUsuario({ contraseña: "", correo: "", rol: "", usuario: "" });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al guardar el usuario: ", error);
    }
  };

  const actualizarUsuario = async () => {
    try {
      if (
        nuevoUsuario.contraseña.trim() &&
        nuevoUsuario.correo.trim() &&
        nuevoUsuario.rol.trim() &&
        nuevoUsuario.usuario.trim()
      ) {
        await updateDoc(doc(db, "Usuarios", usuarioId), {
          contraseña: nuevoUsuario.contraseña.trim(),
          correo: nuevoUsuario.correo.trim(),
          rol: nuevoUsuario.rol.trim(),
          usuario: nuevoUsuario.usuario.trim(),
        });
        setNuevoUsuario({ contraseña: "", correo: "", rol: "", usuario: "" });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
        setModalVisible(false);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar usuario: ", error);
    }
  };

  const editarUsuario = (usuario) => {
    setNuevoUsuario({
      contraseña: usuario.contraseña,
      correo: usuario.correo,
      rol: usuario.rol,
      usuario: usuario.usuario,
    });
    setUsuarioId(usuario.id);
    setModoEdicion(true);
    setModalVisible(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      {/* ENCABEZADO 100% IGUAL AL DE EQUIPOS */}
      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Text style={styles.headerTitle}>Usuarios</Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => {
          setModoEdicion(false);
          setNuevoUsuario({ contraseña: "", correo: "", rol: "", usuario: "" });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Nuevo Usuario</Text>
      </TouchableOpacity>

      <FormularioUsuarios
        nuevoUsuario={nuevoUsuario}
        manejoCambio={manejoCambio}
        guardarUsuario={guardarUsuario}
        actualizarUsuario={actualizarUsuario}
        modoEdicion={modoEdicion}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <ListaUsuarios
        usuarios={usuarios}
        eliminarUsuario={eliminarUsuario}
        editarUsuario={editarUsuario}
      />
    </View>
  );

  return (
    <FlatList
      data={[{ id: "single-item" }]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
  },
  // ENCABEZADO COPIADO EXACTO DE EQUIPOS.JS
  header: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 26
  },
  boton: {
    backgroundColor: "#369AD9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginTop: 25,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

export default Usuarios;