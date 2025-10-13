import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Empleados"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setEmpleados(datos);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <Text style={styles.nombre}>{item.nombre} {item.apellido}</Text>
      <Text style={styles.cedula}>{item.cedula}</Text>
      <Text style={styles.telefono}>{item.telefono}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Empleados</Text>
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
    padding: 15 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 12, 
    color: "#0D0D0D", 
    textAlign: "center" 
  },
  list: {
    flex: 1,
  },
  cardRow: {
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#7E84F2",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  nombre: { 
    fontSize: 15, 
    fontWeight: "500", 
    color: "#0D0D0D" 
  },
  cedula: { 
    fontSize: 14, 
    color: "#666" 
  },
  telefono: { 
    fontSize: 14, 
    color: "#666" 
  },
});

export default ListaEmpleados;