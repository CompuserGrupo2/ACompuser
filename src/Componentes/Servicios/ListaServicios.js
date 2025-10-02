import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaServicios = () => {
  const [servicios, setServicios] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setServicios(datos);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
      <Text style={styles.costo}>C$ {item.costo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo de Servicios</Text>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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

  // Estilo tipo catálogo pero compacto
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#7E84F2",
    elevation: 2, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  descripcion: { 
    fontSize: 15, 
    fontWeight: "500", 
    color: "#0D0D0D", 
    flex: 1 
  },
  costo: { 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "#369AD9" 
  },
});

export default ListaServicios;
