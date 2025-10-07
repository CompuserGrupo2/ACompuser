import React from "react"; 
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarCliente from "./BotonEliminarCliente.js";
import BotonEditarCliente from "./BotonEditarCliente.js";

const TablaClientes = ({ clientes, eliminarCliente, cargarDatos }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Clientes</Text>

      {/* Encabezado fijo */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Cédula</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Teléfono</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Tipo Cliente</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* 👇 Scroll para la tabla de datos */}
      <ScrollView style={styles.scrollArea}>
        {clientes.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.apellido}</Text>
            <Text style={styles.celda}>{item.cedula}</Text>
            <Text style={styles.celda}>{item.telefono}</Text>
            <Text style={styles.celda}>{item.tipo_cliente}</Text>
            <View style={styles.celdaAcciones}>
              <BotonEditarCliente 
                id={item.id} 
                nombreInicial={item.nombre} 
                apellidoInicial={item.apellido}
                cedulaInicial={item.cedula}
                direccionInicial={item.direccion}
                telefonoInicial={item.telefono}
                tipoClienteInicial={item.tipo_cliente}
                cargarDatos={cargarDatos} 
              />
              <BotonEliminarCliente id={item.id} eliminarCliente={eliminarCliente} />
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
    textAlign: "center"
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
    fontSize: 15,
    textAlign: "center",
  },

  // 👇 Scroll con altura limitada para que se pueda desplazar
  scrollArea: {
    maxHeight: 350, // ajusta este número según la altura que quieras mostrar
  },
});

export default TablaClientes;
