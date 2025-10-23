import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarServicio from "./BotonEliminarServicio.js";

const TablaServicios = ({ servicios, eliminarServicio, editarServicio }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Lista de Servicios</Text>

      {servicios.map((item) => (
        <View key={item.id} style={styles.card}>
          {/* Información del servicio */}
          <View style={styles.infoContainer}>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.costo}>C${item.costo}</Text>
          </View>

          {/* Acciones editar / eliminar */}
          <View style={styles.accionesContainer}>
            <TouchableOpacity
              style={styles.botonActualizar}
              onPress={() => editarServicio(item)}
            >
              <Text style={styles.icono}>✏️</Text>
            </TouchableOpacity>

            <BotonEliminarServicio
              id={item.id}
              eliminarServicio={eliminarServicio}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
  },
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
  infoContainer: {
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  costo: {
    fontSize: 14,
    color: "#333",
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
  icono: {
    fontSize: 16,
  },
});

export default TablaServicios;
