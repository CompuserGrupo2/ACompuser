import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarServicio from "./BotonEliminarServicio.js";
import BotonEditarServicio from "./BotonEditarServicio.js";

const TablaServicios = ({ servicios, eliminarServicio, cargarDatos }) => {
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
              <BotonEditarServicio id={item.id} descripcionInicial={item.descripcion} costoInicial={item.costo} cargarDatos={cargarDatos} />
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
    fontSize: 15,
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
});

export default TablaServicios;
