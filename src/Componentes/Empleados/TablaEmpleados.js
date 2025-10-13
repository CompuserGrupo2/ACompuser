import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BotonEliminarEmpleado from "./BotonEliminarEmpleado.js";
import BotonEditarEmpleado from "./BotonEditarEmpleado.js";

const TablaEmpleados = ({ empleados, eliminarEmpleado, cargarDatos }) => {
  const renderItem = ({ item }) => (
    <View style={styles.fila}>
      <Text style={styles.celda}>{item.nombre}</Text>
      <Text style={styles.celda}>{item.apellido}</Text>
      <Text style={styles.celda}>{item.cedula}</Text>
      <Text style={styles.celda}>{item.telefono}</Text>
      <Text style={styles.celda}>{item.direccion}</Text>
      <View style={styles.celdaAcciones}>
        <BotonEditarEmpleado 
          id={item.id} 
          nombreInicial={item.nombre} 
          apellidoInicial={item.apellido} 
          cedulaInicial={item.cedula} 
          telefonoInicial={item.telefono} 
          direccionInicial={item.direccion} 
          cargarDatos={cargarDatos} 
        />
        <BotonEliminarEmpleado id={item.id} eliminarEmpleado={eliminarEmpleado} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Empleados</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Cédula</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Teléfono</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Dirección</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <FlatList
        data={empleados}
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
    fontSize: 11,
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
    fontSize: 12,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
});

export default TablaEmpleados;