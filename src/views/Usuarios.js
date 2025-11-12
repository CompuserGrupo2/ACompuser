import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
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
    const datosValidados = await validarDatos(nuevoUsuario);
    if(datosValidados) {
      try {
        await addDoc(collection(db, "Usuarios"), {
          contraseña: datosValidados.contraseña,
          correo: datosValidados.correo,
          rol: datosValidados.rol,
          usuario: datosValidados.usuario,
        });
        cargarDatos();
        setNuevoUsuario({contraseña: "", correo: "", rol: "", usuario: "",})
        setModoEdicion(false);
        setUsuarioId(null);
        setModalVisible(false);
        Alert.alert("Éxito", "Usuario registrado correctamente.");
      } catch (error) {
        console.error("Error al registrar usuario:", error);
      }
    }
  };

  const actualizarUsuario = async () => {
    const datosValidados = await validarDatos(nuevoUsuario);
    if (datosValidados) {
      try {
        await updateDoc(doc(db, "Usuarios", usuarioId), {
          contraseña: datosValidados.contraseña,
          correo: datosValidados.correo,
          rol: datosValidados.rol,
          usuario: datosValidados.usuario,
        });
        setNuevoUsuario({ contraseña: "", correo: "", rol: "", usuario: "" });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
        setModalVisible(false);
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar usuario: ", error);
      }
    }
  };

  const validarDatos = async (datos) => {
    try{
      const response = await fetch("https://qvl4nb6q3d.execute-api.us-east-2.amazonaws.com/validarusuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if(resultado.success) {
        return resultado.data; //Datos limpios y validados
      } else {
        Alert.alert("Errores en los datos", resultado.errors.join("\n"));
        return null;
      }
    } catch (error) {
      console.error("Error al validar con Lambda:", error);
      Alert.alert("Error", "No se pudo validar la información con el servidor.");
      return null;
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