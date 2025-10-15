import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import BotonEliminarUsuario from "./BotonEliminarUsuario.js";

const TablaUsuarios = ({ usuarios, eliminarUsuario, editarUsuario, cargarDatos }) => {
  const renderItem = ({ item }) => (
    <View style={styles.fila}>
      <Text style={styles.celda}>{item.usuario}</Text>
      <Text style={styles.celda}>{item.correo}</Text>
      <Text style={styles.celda}>{item.rol}</Text>
      <View style={styles.celdaAcciones}>
        <TouchableOpacity
          style={styles.botonActualizar}
          onPress={() => editarUsuario(item)}
        >
          <Text>✏️</Text>
        </TouchableOpacity>
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
    alignSelf: "stretch",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
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
    fontSize: 14,
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
    fontSize: 16,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  botonActualizar: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#99c99aff",
  },
});

export default TablaUsuarios;