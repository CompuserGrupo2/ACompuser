import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image} from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons"; // Impor el ícono

const ListaServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // Cargar los servicios y calcular promedio
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const datosServicios = [];

      for (const servicioDoc of querySnapshot.docs) {
        const servicioData = { id: servicioDoc.id, ...servicioDoc.data() };

        const calificacionesRef = collection(
          db,
          "Servicios",
          servicioDoc.id,
          "Calificaciones"
        );
        const calificacionesSnap = await getDocs(calificacionesRef);

        let suma = 0;
        let cantidad = 0;
        const calificacionesLista = [];

        calificacionesSnap.forEach((doc) => {
          const data = doc.data();
          if (data.Calidad_servicio) {
            suma += data.Calidad_servicio;
            cantidad++;
          }
          calificacionesLista.push({
            id: doc.id,
            ...data,
          });
        });

        servicioData.promedioCalificacion =
          cantidad > 0 ? (suma / cantidad).toFixed(1) : "N/A";
        servicioData.calificaciones = calificacionesLista;

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

  // Mostrar detalles de calificaciones al tocar un servicio
  const toggleDetalles = (id) => {
    setServicioSeleccionado(servicioSeleccionado === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardRow}
      onPress={() => toggleDetalles(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.iconContainer}>
        {/* Agregar icono en el catalogo*/}
        <MaterialIcons name="build" size={26} color="#7E84F2" />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
        <View style={{flex: 1}}>
          <Text style={styles.descripcion}>{item.descripcion}</Text>
          <Text style={styles.costo}>C$ {item.costo}</Text>
          <Text style={styles.calificacion}>
            ⭐{" "}
            {item.promedioCalificacion !== "N/A"
              ? item.promedioCalificacion
              : "Sin calificación"}
          </Text>
        </View>
        <View style={{flex: 0}}>
          <Image
            source={{ uri: item.foto }}
            style={styles.preview}
            resizeMode="contain"
          />
        </View>
        </View>

        {/* Mostrar detalles si está seleccionado */}
        {servicioSeleccionado === item.id && item.calificaciones.length > 0 && (
          <View style={styles.detalleContainer}>
            <Text style={styles.subtitulo}>📋 Detalles de calificaciones:</Text>
            {item.calificaciones.map((cal, index) => (
              <View key={index} style={styles.detalleItem}>
                <Text style={styles.detalleTexto}>
                  <Text style={styles.label}>Fecha:</Text>{" "}
                  {cal.fecha_calificacion || "Sin fecha"}
                </Text>
                <Text style={styles.detalleTexto}>
                  <Text style={styles.label}>Puntuación:</Text>{" "}
                  {cal.Calidad_servicio} ⭐
                </Text>
                <Text style={styles.detalleTexto}>
                  <Text style={styles.label}>Comentario:</Text>{" "}
                  {cal.comentario || "Sin comentario"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {servicioSeleccionado === item.id && item.calificaciones.length === 0 && (
          <Text style={styles.sinCalificaciones}>
            No hay calificaciones registradas aún.
          </Text>
        )}
      </View>

    </TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: 40 }} // 👈 espacio al final
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 15, 
    backgroundColor: "#F5F7FA", 
    flex: 1,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0D0D0D",
    textAlign: "center",
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
  },

  iconContainer: {
    backgroundColor: "#E6E8FC",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  preview: {
    width: 95,
    height: 95,
    borderRadius: 12,
    marginLeft: 10,
    backgroundColor: "#F0F1FF",
    borderWidth: 1,
    borderColor: "#E2E5FF",
  },

  descripcion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 3,
  },

  costo: {
    fontSize: 15,
    color: "#369AD9",
    marginBottom: 4,
    fontWeight: "500",
  },

  calificacion: {
    fontSize: 14,
    color: "#F9A825",
    fontWeight: "600",
  },

  detalleContainer: {
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  subtitulo: {
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
    fontSize: 15,
  },

  detalleItem: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 6,
  },

  detalleTexto: {
    fontSize: 14,
    color: "#444",
  },

  label: {
    fontWeight: "600",
    color: "#111",
  },

  sinCalificaciones: {
    marginTop: 8,
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListaServicios;
