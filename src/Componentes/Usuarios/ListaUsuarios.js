import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const ListaUsuarios = ({ usuarios }) => {
  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <Text style={styles.usuario}>{item.usuario}</Text>
      <Text style={styles.correo}>{item.correo}</Text>
      <Text style={styles.rol}>{item.rol}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Usuarios</Text>
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
    padding: 15 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 12, 
    color: "#0D0D0D", 
    textAlign: "center" 
  },
  list: {
    flex: 1,
  },
  cardRow: {
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#7E84F2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  usuario: { 
    fontSize: 15, 
    fontWeight: "500", 
    color: "#0D0D0D" 
  },
  correo: { 
    fontSize: 14, 
    color: "#666" 
  },
  rol: { 
    fontSize: 14, 
    color: "#666" 
  },
});

export default ListaUsuarios;
