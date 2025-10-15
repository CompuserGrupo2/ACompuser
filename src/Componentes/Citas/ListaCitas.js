import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaCitas = ({ actualizarLista }) => {
  const [citas, setCitas] = useState([]);

  const cargarCitas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Citas"));
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCitas(datos);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [actualizarLista]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.fecha}>📅 {new Date(item.fecha_cita).toLocaleString()}</Text>
      <Text
        style={[
          styles.estado,
          item.estado === "confirmado" ? styles.confirmado : styles.pendiente,
        ]}
      >
        Estado: {item.estado}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={citas}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListHeaderComponent={<Text style={styles.titulo}>Lista de Citas</Text>}
    />
  );
};

const styles = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginBottom: 12 },
  fecha: { fontSize: 16, marginBottom: 5 },
  estado: { fontSize: 14, fontWeight: "bold" },
  confirmado: { color: "green" },
  pendiente: { color: "orange" },
});

export default ListaCitas;
