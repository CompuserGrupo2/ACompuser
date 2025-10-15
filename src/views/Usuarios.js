import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import ListaUsuarios from "../Componentes/Usuarios/ListaUsuarios";
import FormularioUsuarios from "../Componentes/Usuarios/FormularioUsuarios";
import TablaUsuarios from "../Componentes/Usuarios/TablaUsuarios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
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
        setNuevoUsuario({
          contraseña: "",
          correo: "",
          rol: "",
          usuario: "",
        });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
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
        setNuevoUsuario({
          contraseña: "",
          correo: "",
          rol: "",
          usuario: "",
        });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
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
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <FormularioUsuarios
        nuevoUsuario={nuevoUsuario}
        manejoCambio={manejoCambio}
        guardarUsuario={guardarUsuario}
        actualizarUsuario={actualizarUsuario}
        modoEdicion={modoEdicion}
        cargarDatos={cargarDatos}
      />
      <ListaUsuarios usuarios={usuarios} />
      <TablaUsuarios
        usuarios={usuarios}
        eliminarUsuario={eliminarUsuario}
        editarUsuario={editarUsuario}
        cargarDatos={cargarDatos}
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
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Usuarios;