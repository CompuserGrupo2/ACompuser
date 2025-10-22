import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const ListaClientes = ({ clientes }) => {

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.nombre} {item.apellido}</Text>
      <Text style={styles.detalle}>Cédula: {item.cedula}</Text>
      <Text style={styles.detalle}>Teléfono: {item.telefono}</Text>
      <Text style={styles.cliente}>Tipo: {item.tipo_cliente}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Clientes</Text>
      <FlatList
        data={clientes}
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
  header: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "left" 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  detalle: { fontSize: 14, marginBottom: 3, color: "#333" },
  cliente: { fontSize: 14, fontWeight: "bold", color: "#7E84F2", marginTop: 5 }
});

export default ListaClientes;