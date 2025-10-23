import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const ListaEmpleados = ({ empleados }) => {

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.nombre} {item.apellido}</Text>
      <Text style={styles.detalle}>Cédula: {item.cedula}</Text>
      <Text style={styles.detalle}>Teléfono: {item.telefono}</Text>
      <Text style={styles.tipo}>Dirección: {item.direccion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Empleados</Text>
      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6
  },
  detalle: {
    fontSize: 14,
    marginBottom: 3,
    color: "#333"
  },
  tipo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7E84F2",
    marginTop: 5
  },
});

export default ListaEmpleados;
