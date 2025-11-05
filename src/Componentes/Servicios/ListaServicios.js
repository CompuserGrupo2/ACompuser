// src/Componentes/Servicios/ListaServicios.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, onSnapshot, query } from "firebase/firestore";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const ListaServicios = ({ navigation }) => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [comentariosSeleccionados, setComentariosSeleccionados] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "Servicios"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const datosServicios = [];

      for (const docSnapshot of snapshot.docs) {
        const servicioData = { id: docSnapshot.id, ...docSnapshot.data() };

        const calificacionesRef = collection(db, "Servicios", docSnapshot.id, "Calificaciones");
        const calificacionesSnap = await onSnapshot(calificacionesRef, (calSnapshot) => {
          let suma = 0;
          let cantidad = 0;
          const calificacionesLista = [];

          calSnapshot.forEach((calDoc) => {
            const data = calDoc.data();
            if (data.Calidad_servicio) {
              suma += data.Calidad_servicio;
              cantidad++;
            }
            calificacionesLista.push({ id: calDoc.id, ...data });
          });

          servicioData.promedioCalificacion = cantidad > 0 ? (suma / cantidad).toFixed(1) : "N/A";
          servicioData.calificaciones = calificacionesLista;

          setServicios((prev) => {
            const index = prev.findIndex((s) => s.id === servicioData.id);
            if (index !== -1) {
              const newArr = [...prev];
              newArr[index] = servicioData;
              return newArr;
            }
            return [...prev.filter((s) => s.id !== servicioData.id), servicioData];
          });
        });

        datosServicios.push(servicioData);
      }

      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const abrirComentarios = (calificaciones) => {
    setComentariosSeleccionados(calificaciones || []);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      {/* Ícono del servicio */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="build" size={26} color="#7E84F2" />
      </View>

      {/* Información del servicio */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.costo}>C$ {item.costo}</Text>
            <View style={styles.calificacionContainer}>
              <FontAwesome name="star" size={16} color="#F9A825" />
              <Text style={styles.calificacion}>
                {" "}{item.promedioCalificacion || "Sin calificación"}
              </Text>
            </View>
          </View>
          <Image source={{ uri: item.foto }} style={styles.preview} resizeMode="contain" />
        </View>
      </View>

      {/* Ícono de comentarios */}
      <TouchableOpacity
        style={styles.comentarioBtn}
        onPress={() => abrirComentarios(item.calificaciones)}
      >
        <FontAwesome name="comment" size={24} color="#369AD9" />
        <Text style={styles.comentarioCount}>
          {item.calificaciones?.length || 0}
        </Text>
      </TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Modal de Comentarios */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Comentarios</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            {comentariosSeleccionados.length > 0 ? (
              <FlatList
                data={comentariosSeleccionados}
                keyExtractor={(item) => item.id}
                renderItem={({ item: cal }) => (
                  <View style={styles.comentarioItem}>
                    <Text style={styles.comentarioFecha}>
                      {cal.fecha_calificacion || "Sin fecha"}
                    </Text>
                    <View style={styles.calificacionContainer}>
                      <FontAwesome name="star" size={16} color="#F9A825" />
                      <Text style={styles.comentarioPuntuacion}>
                        {" "}{cal.Calidad_servicio}
                      </Text>
                    </View>
                    <Text style={styles.comentarioTexto}>
                      {cal.comentario || "Sin comentario"}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.sinComentariosModal}>
                No hay comentarios aún.
              </Text>
            )}
          </View>
        </View>
      </Modal>
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
  calificacionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calificacion: {
    fontSize: 14,
    color: "#F9A825",
    fontWeight: "600",
    marginLeft: 4,
  },
  comentarioBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  comentarioCount: {
    fontSize: 12,
    color: "#369AD9",
    fontWeight: "600",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 15,
    padding: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  comentarioItem: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  comentarioFecha: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  comentarioPuntuacion: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F9A825",
    marginLeft: 4,
  },
  comentarioTexto: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  sinComentariosModal: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: 20,
    fontSize: 15,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListaServicios;