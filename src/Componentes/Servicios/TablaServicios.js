import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarServicio from "./BotonEliminarServicio.js";

const TablaServicios = ({ servicios, eliminarServicio, editarServicio }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Servicios</Text>

      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Descripción</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Costo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      <ScrollView>
        {servicios.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.descripcion}</Text>
            <Text style={styles.celda}>C${item.costo}</Text>
            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarServicio(item)}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
              <BotonEliminarServicio id={item.id} eliminarServicio={eliminarServicio} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  botonActualizar: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#99c99aff",
  },
});

export default TablaServicios;