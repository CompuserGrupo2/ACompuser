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
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, onSnapshot, query, addDoc, serverTimestamp } from "firebase/firestore";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

const ListaServicios = ({ navigation, modoInvitado = false }) => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [comentariosSeleccionados, setComentariosSeleccionados] = useState([]);
  const [servicioIdSeleccionado, setServicioIdSeleccionado] = useState(null);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [filtroCalificacion, setFiltroCalificacion] = useState("ninguno");

  const auth = getAuth();
  const usuario = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, "Servicios"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const datosServicios = [];

      for (const docSnapshot of snapshot.docs) {
        const servicioData = { id: docSnapshot.id, ...docSnapshot.data() };
        const calificacionesRef = collection(db, "Servicios", docSnapshot.id, "Calificaciones");

        onSnapshot(calificacionesRef, (calSnapshot) => {
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

  // Filtrado y búsqueda
  useEffect(() => {
    let listaFiltrada = [...servicios];

    if (busqueda.trim() !== "") {
      listaFiltrada = listaFiltrada.filter((s) =>
        s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    listaFiltrada.sort((a, b) => {
      const calA = a.promedioCalificacion === "N/A" ? 0 : parseFloat(a.promedioCalificacion);
      const calB = b.promedioCalificacion === "N/A" ? 0 : parseFloat(b.promedioCalificacion);

      if (filtroCalificacion === "mejores") return calB - calA;
      if (filtroCalificacion === "peores") return calA - calB;
      return 0;
    });

    setServiciosFiltrados(listaFiltrada);
  }, [busqueda, filtroCalificacion, servicios]);

  const abrirComentarios = (calificaciones, servicioId) => {
    setComentariosSeleccionados(calificaciones || []);
    setServicioIdSeleccionado(servicioId);
    setModalVisible(true);
  };

  const enviarCalificacion = async () => {
    if (modoInvitado) {
      return Alert.alert("Invitado", "Debes registrarte o iniciar sesión para calificar.");
    }
    if (!usuario) return Alert.alert("Error", "Debes iniciar sesión para calificar.");
    if (calificacion < 1 || calificacion > 5) return Alert.alert("Error", "Selecciona una calificación.");
    if (enviando) return;

    setEnviando(true);

    try {
      await addDoc(collection(db, "Servicios", servicioIdSeleccionado, "Calificaciones"), {
        Calidad_servicio: calificacion,
        comentario: comentario.trim() || null,
        fecha_calificacion: serverTimestamp(),
        usuario_id: usuario.uid,
        usuario_email: usuario.email,
      });
      Alert.alert("Éxito", "¡Calificación enviada!");
      setComentario("");
      setCalificacion(0);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo enviar la calificación.");
    } finally {
      setEnviando(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="build" size={26} color="#7E84F2" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.costo}>C$ {item.costo}</Text>
            <View style={styles.calificacionContainer}>
              <FontAwesome name="star" size={20} color="#F9A825" />
              <Text style={styles.calificacion}>{item.promedioCalificacion || "Sin calificación"}</Text>

              <TouchableOpacity
                style={styles.comentarioBtn}
                onPress={() => abrirComentarios(item.calificaciones, item.id)}
              >
                <FontAwesome name="comment" size={20} color="#369AD9" />
                <Text style={styles.comentarioCount}>{item.calificaciones?.length || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image source={{ uri: item.foto }} style={styles.preview} resizeMode="contain" />
        </View>
      </View>
    </View>
  );

  if (cargando)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#369AD9" />
        <Text>Cargando servicios...</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={serviciosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.barraBusqueda}>
              <TextInput
                style={styles.inputBusqueda}
                placeholder="Buscar servicio..."
                value={busqueda}
                onChangeText={setBusqueda}
              />
              {busqueda.length > 0 && (
                <TouchableOpacity onPress={() => setBusqueda("")} style={styles.botonBorrar}>
                  <MaterialIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.filtroContainer}>
              <TouchableOpacity
                style={[styles.filtroBtn, filtroCalificacion === "mejores" && styles.filtroActivo]}
                onPress={() => setFiltroCalificacion("mejores")}
              >
                <Text style={filtroCalificacion === "mejores" ? styles.filtroActivoText : styles.filtroTexto}>
                  Mejores calificados
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filtroBtn, filtroCalificacion === "peores" && styles.filtroActivo]}
                onPress={() => setFiltroCalificacion("peores")}
              >
                <Text style={filtroCalificacion === "peores" ? styles.filtroActivoText : styles.filtroTexto}>
                  Peores calificados
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filtroBtn, filtroCalificacion === "ninguno" && styles.filtroActivo]}
                onPress={() => setFiltroCalificacion("ninguno")}
              >
                <Text style={filtroCalificacion === "ninguno" ? styles.filtroActivoText : styles.filtroTexto}>
                  Quitar filtro
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />

      {/* Modal de Comentarios */}
      <Modal
        visible={modalVisible}
        transparent
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

            <ScrollView style={{ maxHeight: "60%" }}>
              {comentariosSeleccionados.length > 0 ? (
                comentariosSeleccionados.map((cal) => (
                  <View key={cal.id} style={styles.comentarioItem}>
                    <Text style={styles.nombreUsuario}>{cal.usuario_email || "Usuario no registrado"}</Text>
                    <Text style={styles.comentarioFecha}>
                      {cal.fecha_calificacion?.toDate?.().toLocaleDateString() || "Sin fecha"}
                    </Text>
                    <View style={styles.calificacionContainer}>
                      <FontAwesome name="star" size={16} color="#F9A825" />
                      <Text style={styles.comentarioPuntuacion}> {cal.Calidad_servicio}</Text>
                    </View>
                    <Text style={styles.comentarioTexto}>{cal.comentario || "Sin comentario"}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.sinComentariosModal}>No hay comentarios aún. ¡Sé el primero!</Text>
              )}
            </ScrollView>

            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Tu calificación:</Text>
              <View style={styles.estrellasContainer}>
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <TouchableOpacity
                    key={estrella}
                    onPress={() => modoInvitado ? Alert.alert("Invitado", "Debes registrarte para calificar.") : setCalificacion(estrella)}
                  >
                    <FontAwesome
                      name={estrella <= calificacion ? "star" : "star-o"}
                      size={28}
                      color="#F9A825"
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.inputComentario}
                placeholder={modoInvitado ? "Debes registrarte para comentar" : "Escribe tu comentario (opcional)"}
                value={comentario}
                onChangeText={modoInvitado ? () => {} : setComentario}
                multiline
                numberOfLines={3}
                editable={!modoInvitado}
              />
              {!modoInvitado && (
                <TouchableOpacity
                  style={[styles.btnEnviar, enviando && { opacity: 0.6 }]}
                  onPress={enviarCalificacion}
                  disabled={enviando}
                >
                  <Text style={styles.btnText}>{enviando ? "Enviando..." : "Enviar Calificación"}</Text>
                </TouchableOpacity>
              )}

              {modoInvitado && (
                <Text style={{ textAlign: "center", color: "#777", marginTop: 10 }}>
                  Estás en modo invitado: solo puedes visualizar calificaciones y comentarios.
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  contentContainer: {
    flexGrow: 1,
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
    marginHorizontal: 10,
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
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  comentarioCount: {
    fontSize: 13,
    color: "#369AD9",
    marginLeft: 4,
    fontWeight: "600",
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
    maxHeight: "85%",
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
    marginVertical: 20,
    fontSize: 15,
  },
  formContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  estrellasContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  inputComentario: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
    textAlignVertical: "top",
    marginBottom: 12,
  },
  btnEnviar: {
    backgroundColor: "#369AD9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nombreUsuario: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 12,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginTop: 11,
  },
  inputBusqueda: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 15,
  },
  botonBorrar: {
    marginLeft: 6,
    padding: 4,
  },
  filtroContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
    gap: 6,
    marginHorizontal: 15,
  },
  filtroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#369AD9",
  },
  filtroActivo: {
    backgroundColor: "#369AD9",
  },
  filtroTexto: {
    color: "#369AD9",
    fontWeight: "600",
  },
  filtroActivoText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

export default ListaServicios;