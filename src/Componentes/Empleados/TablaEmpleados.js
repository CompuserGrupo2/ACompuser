import React from "react";
import {View,Text,StyleSheet,FlatList,TouchableOpacity,ScrollView,} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import BotonEliminarEmpleado from "./BotonEliminarEmpleado.js";

const TablaEmpleados = ({ empleados, eliminarEmpleado, editarEmpleado }) => {
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.fila,
        { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#eaf6f6" },
      ]}
    >
      <Text style={[styles.celda, styles.celdaNombre]} numberOfLines={1}>
        {item.nombre}
      </Text>
      <Text style={[styles.celda, styles.celdaApellido]} numberOfLines={1}>
        {item.apellido}
      </Text>
      <Text style={[styles.celda, styles.celdaCedula]} numberOfLines={1}>
        {item.cedula}
      </Text>
      <Text style={[styles.celda, styles.celdaTelefono]} numberOfLines={1}>
        {item.telefono}
      </Text>
      <Text style={[styles.celda, styles.celdaDireccion]} numberOfLines={1}>
        {item.direccion}
      </Text>
      <View style={styles.celdaAcciones}>
        <TouchableOpacity
          style={styles.botonActualizar}
          onPress={() => editarEmpleado(item)}
        >
          <Icon name="edit" size={18} color="#fff" />
        </TouchableOpacity>
        <BotonEliminarEmpleado id={item.id} eliminarEmpleado={eliminarEmpleado} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Empleados</Text>
      <ScrollView horizontal>
        <View style={[styles.fila, styles.encabezado]}>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaNombre]}>
            Nombre
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaApellido]}>
            Apellido
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaCedula]}>
            Cédula
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaTelefono]}>
            Teléfono
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaDireccion]}>
            Dirección
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaAcciones]}>
            Acciones
          </Text>
        </View>
      </ScrollView>
      <ScrollView horizontal>
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignSelf: "stretch",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  encabezado: {
    backgroundColor: "#59C1D9",
    borderBottomWidth: 2,
    borderColor: "#fff",
    paddingVertical: 12,
  },
  celda: {
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 4,
  },
  celdaNombre: {
    flex: 1.5,
    maxWidth: 80,
  },
  celdaApellido: {
    flex: 1.5,
    maxWidth: 80,
  },
  celdaCedula: {
    flex: 2,
    maxWidth: 100,
  },
  celdaTelefono: {
    flex: 1.5,
    maxWidth: 80,
  },
  celdaDireccion: {
    flex: 2.5,
    maxWidth: 120,
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  textoEncabezado: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  botonActualizar: {
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
  },
});

export default TablaEmpleados;