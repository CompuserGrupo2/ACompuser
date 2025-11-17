import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import BotonEliminarUsuario from "./BotonEliminarUsuario";

const ListaUsuarios = ({ usuarios, eliminarUsuario, editarUsuario }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.usuario}>{item.usuario}</Text>
        <Text style={styles.correo}>{item.correo}</Text>
        <Text style={styles.rol}>{item.rol}</Text>
      </View>
      {/*
        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={styles.botonActualizar}
            onPress={() => editarUsuario(item)}
          >
            <Text style={styles.icono}>✏️</Text>
          </TouchableOpacity>

          <BotonEliminarUsuario
            id={item.id}
            eliminarUsuario={eliminarUsuario}
          />
        </View>
      */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold",
    marginBottom: 12, 
    textAlign: "row" 
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoContainer: { 
    marginBottom: 10 
  },
  usuario: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 4 
  },
  correo: { 
    fontSize: 14, 
    color: "#666" 
  },
  rol: { 
    fontSize: 14, 
    color: "#666" 
  },
  accionesContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  botonActualizar: {
    padding: 4,
    borderRadius: 5,
    backgroundColor: "#99c99aff",
    alignItems: "center",
    justifyContent: "center",
  },
  icono: { fontSize: 16 },
});

export default ListaUsuarios;
