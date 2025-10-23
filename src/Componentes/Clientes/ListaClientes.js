import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import BotonEliminarClientes from "./BotonEliminarClientes";

const ListaClientes = ({ clientes, editarCliente, cargarDatos }) => {

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.detalle}>Cédula: {item.cedula}</Text>
        <Text style={styles.detalle}>Teléfono: {item.telefono}</Text>
        <Text style={styles.cliente}>Tipo: {item.tipo_cliente}</Text>
      </View>

      {/* Botones de acción (Editar / Eliminar) */}
      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={styles.botonActualizar}
          onPress={() => editarCliente(item)}
        >
          <Text style={styles.icono}>✏️</Text>
        </TouchableOpacity>

        <BotonEliminarClientes
          clienteId={item.id}
          cargarDatos={cargarDatos}
        />
      </View>
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
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 10,
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
  cliente: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#7E84F2", 
    marginTop: 5 
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#99c99aff",
  },
  icono: {
    fontSize: 16,
  },
});

export default ListaClientes;
