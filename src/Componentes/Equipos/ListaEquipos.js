import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "EquipoComputarizado"));
      const datos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipos(datos);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.marca} {item.modelo}</Text>
      <Text style={styles.detalle}>Color: {item.color}</Text>
      <Text style={styles.detalle}>Tipo: {item.tipo}</Text>
      <Text style={styles.cliente}>
        Cliente: {item.cliente ? `${item.cliente.nombre} ${item.cliente.apellido}` : "Sin cliente"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Equipos</Text>
      <FlatList
        data={equipos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15
  },
  
  header: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "left" 
  },
  
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  
  titulo: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 6 
  },

  detalle: { 
    fontSize: 14, 
    marginBottom: 3, 
    color: "#333" 
  },

  cliente: 
  { fontSize: 14, 
    fontWeight: "bold", 
    color: "#7E84F2", 
    marginTop: 5 
  }
});

export default ListaEquipos;
