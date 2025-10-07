import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const ListaServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const datosServicios = [];

      // 🔸 Recorremos cada servicio para calcular su promedio de calificaciones
      for (const servicioDoc of querySnapshot.docs) {
        const servicioData = { id: servicioDoc.id, ...servicioDoc.data() };

        const calificacionesRef = collection(db, "Servicios", servicioDoc.id, "Calificaciones");
        const calificacionesSnap = await getDocs(calificacionesRef);

        let suma = 0;
        let cantidad = 0;

        calificacionesSnap.forEach((calificacionDoc) => {
          const data = calificacionDoc.data();
          if (data.Calidad_servicio) {
            suma += data.Calidad_servicio;
            cantidad++;
          }
        });

        servicioData.promedioCalificacion =
          cantidad > 0 ? (suma / cantidad).toFixed(1) : "N/A";

        datosServicios.push(servicioData);
      }

      setServicios(datosServicios);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.costo}>C$ {item.costo}</Text>

        {/* ⭐ Mostrar promedio de calificaciones */}
        <Text style={styles.calificacion}>
          ⭐ {item.promedioCalificacion !== "N/A" ? item.promedioCalificacion : "Sin calificación"}
        </Text>
      </View>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#369AD9" />
        <Text>Cargando servicios...</Text>
      </View>
    );
  }

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
  container: { padding: 15 },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0D0D0D",
    textAlign: "center",
  },

  cardRow: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#7E84F2",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  descripcion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 3,
  },

  costo: {
    fontSize: 15,
    color: "#369AD9",
    marginBottom: 5,
  },

  calificacion: {
    fontSize: 14,
    color: "#F9A825",
    fontWeight: "500",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListaServicios;
