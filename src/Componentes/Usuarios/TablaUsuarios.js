import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BotonEliminarUsuario from "./BotonEliminarUsuario.js";
import BotonEditarUsuario from "./BotonEditarUsuario.js";

const TablaUsuarios = ({ usuarios, eliminarUsuario, cargarDatos }) => {
  const renderItem = ({ item }) => (
    <View style={styles.fila}>
      <Text style={styles.celda}>{item.usuario}</Text>
      <Text style={styles.celda}>{item.correo}</Text>
      <Text style={styles.celda}>{item.rol}</Text>
      <View style={styles.celdaAcciones}>
        <BotonEditarUsuario 
          id={item.id} 
          contraseñaInicial={item.contraseña} 
          correoInicial={item.correo} 
          rolInicial={item.rol} 
          usuarioInicial={item.usuario} 
          cargarDatos={cargarDatos} 
        />
        <BotonEliminarUsuario id={item.id} eliminarUsuario={eliminarUsuario} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Usuarios</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Usuario</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Correo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Rol</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    alignSelf: "stretch"
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#59C1D9",
  },
  celda: {
    flex: 1,
    fontSize: 11,
    textAlign: "center",
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
});

export default TablaUsuarios;