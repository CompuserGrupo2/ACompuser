import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import BotonEliminarUsuario from "./BotonEliminarUsuario.js";

const TablaUsuarios = ({ usuarios, eliminarUsuario, editarUsuario }) => {
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.fila,
        { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#eaf6f6" },
      ]}
    >
      <Text style={[styles.celda, styles.celdaUsuario]} numberOfLines={1}>
        {item.usuario}
      </Text>
      <Text style={[styles.celda, styles.celdaCorreo]} numberOfLines={1}>
        {item.correo}
      </Text>
      <Text style={[styles.celda, styles.celdaRol]} numberOfLines={1}>
        {item.rol}
      </Text>
      <View style={[styles.celda, styles.celdaAcciones]}>
        <TouchableOpacity
          style={styles.botonActualizar}
          onPress={() => editarUsuario(item)}
        >
          <Icon name="edit" size={14} color="#fff" />
        </TouchableOpacity>
        <BotonEliminarUsuario id={item.id} eliminarUsuario={eliminarUsuario} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Usuarios</Text>
      <ScrollView horizontal>
        <View style={[styles.fila, styles.encabezado]}>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaUsuario]}>
            Usuario
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaCorreo]}>
            Correo
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaRol]}>
            Rol
          </Text>
          <Text style={[styles.celda, styles.textoEncabezado, styles.celdaAcciones]}>
            Acciones
          </Text>
        </View>
      </ScrollView>
      <ScrollView horizontal>
        <FlatList
          data={usuarios}
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
  celdaUsuario: {
    flex: 1.5,
    maxWidth: 100,
  },
  celdaCorreo: {
    flex: 2.5,
    maxWidth: 160,
  },
  celdaRol: {
    flex: 1.2,
    maxWidth: 80,
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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

export default TablaUsuarios;