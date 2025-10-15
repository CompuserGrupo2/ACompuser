import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarEquipo from "./BotonEliminarEquipo";

const TablaEquipos = ({ equipos, eliminarEquipo, editarEquipo, cargarDatos }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Equipos</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Color</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Marca</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Modelo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Tipo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Cliente</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <ScrollView>
        {equipos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.color}</Text>
            <Text style={styles.celda}>{item.marca}</Text>
            <Text style={styles.celda}>{item.modelo}</Text>
            <Text style={styles.celda}>{item.tipo}</Text>
            <Text style={styles.celda}>{item.cliente ? item.cliente.nombre : "Sin cliente"}</Text>
            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarEquipo(item)}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
              <BotonEliminarEquipo
                id={item.id}
                eliminarEquipo={eliminarEquipo}
              />
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

export default TablaEquipos;