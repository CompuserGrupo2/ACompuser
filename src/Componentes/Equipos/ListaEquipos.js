import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "EquipoComputarizado"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setEquipos(datos);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <Text style={styles.color}>{item.color}</Text>
      <Text style={styles.marca}>{item.marca}</Text>
      <Text style={styles.modelo}>{item.modelo}</Text>
      <Text style={styles.tipo}>{item.tipo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo de Equipos</Text>

      <FlatList
        data={equipos}
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
    textAlign: "left", 
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

export default ListaEquipos;