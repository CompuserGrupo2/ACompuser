import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Button } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ListaUsuarios from "../Componentes/Usuarios/ListaUsuarios";
import FormularioUsuarios from "../Componentes/Usuarios/FormularioUsuarios";
import TablaUsuarios from "../Componentes/Usuarios/TablaUsuarios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

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

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <FormularioUsuarios cargarDatos={cargarDatos} />
      <ListaUsuarios usuarios={usuarios} />
      <TablaUsuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} cargarDatos={cargarDatos} />
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
