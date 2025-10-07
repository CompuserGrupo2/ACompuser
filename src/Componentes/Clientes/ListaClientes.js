import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setClientes(datos);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <Text style={styles.celda}>{item.nombre}</Text>
      <Text style={styles.celda}>{item.apellido}</Text>
      <Text style={styles.celda}>{item.cedula}</Text>
      <Text style={styles.celda}>{item.telefono}</Text>
      <Text style={styles.celda}>{item.tipo_cliente}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Clientes</Text>

      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Cédula</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Teléfono</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Tipo Cliente</Text>
      </View>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },

  cardRow: {
    flexDirection: "row",
    paddingVertical: 6,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

export default ListaClientes;
