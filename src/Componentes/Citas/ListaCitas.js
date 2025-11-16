import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Alert, TextInput } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { confirmarCita, cancelarCita, posponerCita, editarCitaCliente } from "./accionesCitas";
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ListaCitas = ({ actualizarLista, rol, userId }) => {
  const [citas, setCitas] = useState([]);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [accionTipo, setAccionTipo] = useState("");
  const [filtro, setFiltro] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("ninguno");
  const [filtroFecha, setFiltroFecha] = useState(null);

  const formatFecha = (date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).replace(/\./g, "");
  };

  const formatHora = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const cargarCitas = async () => {
    try {
      let citasQuery;

      if (rol === "Admin") {
        citasQuery = query(collection(db, "Citas"), orderBy("fecha_cita", "asc"));
      } else if (userId) {
        citasQuery = query(
          collection(db, "Citas"),
          where("userId", "==", userId),
          orderBy("fecha_cita", "asc")
        );
      } else {
        setCitas([]);
        return;
      }

      const snapshot = await getDocs(citasQuery);

      const datos = snapshot.docs.map((doc) => {
        const data = doc.data();
        let fechaCita;

        if (data.fecha_cita && typeof data.fecha_cita.toDate === "function") {
          fechaCita = data.fecha_cita.toDate();
        } else if (typeof data.fecha_cita === "string") {
          fechaCita = new Date(data.fecha_cita);
        } else {
          fechaCita = new Date();
        }

        return {
          id: doc.id,
          fecha_cita: fechaCita,
          estado: data.estado || "pendiente",
          nombreUsuario: data.nombreUsuario || "Usuario no registrado",
          userId: data.userId,
        };
      });

      setCitas(datos);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [actualizarLista, userId, rol]);

  const citasFiltradas = citas.filter((cita) => {
    const porBusqueda =
      busqueda.trim() === "" ||
      cita.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase());

    const porEstado =
      filtroEstado === "ninguno" || filtroEstado === cita.estado;

    const porFecha =
      !filtroFecha ||
      cita.fecha_cita.toDateString() === filtroFecha.toDateString();

    return porBusqueda && porEstado && porFecha;
  });

  const handleConfirmar = async (id) => {
    await confirmarCita(id);
    cargarCitas();
  };

  const handleCancelar = async (id) => {
    await cancelarCita(id);
    cargarCitas();
  };

  const handlePosponer = (item) => {
    Alert.alert(
      "¿Posponer cita?",
      `¿Estás seguro de reprogramar la cita de ${item.nombreUsuario}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => abrirPicker("posponer", item),
        },
      ]
    );
  };

  const abrirPicker = (tipo, cita) => {
    setCitaSeleccionada({ ...cita, fecha_temp: new Date(cita.fecha_cita) });
    setAccionTipo(tipo);
    setModoPicker("date");
    setMostrarPicker(true);
  };

  const onChangePicker = async (_, selectedDate) => {
    if (!selectedDate) {
      setMostrarPicker(false);
      return;
    }

    if (modoPicker === "date") {
      setCitaSeleccionada((prev) => ({
        ...prev,
        fecha_temp: new Date(selectedDate),
      }));
      if (Platform.OS === "android") setModoPicker("time");
    } else {
      const nuevaFecha = new Date(citaSeleccionada.fecha_temp);
      nuevaFecha.setHours(selectedDate.getHours());
      nuevaFecha.setMinutes(selectedDate.getMinutes());

      try {
        if (accionTipo === "editar") {
          await editarCitaCliente(citaSeleccionada.id, nuevaFecha);
          Alert.alert("Éxito", "Cita editada correctamente");
        }
        if (accionTipo === "posponer") {
          await posponerCita(citaSeleccionada.id, nuevaFecha, "Reprogramada por el administrador");
          Alert.alert("Éxito", "Cita pospuesta con éxito");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo actualizar la cita");
      } finally {
        setMostrarPicker(false);
        cargarCitas(); // ← SE ACTUALIZA AL INSTANTE
      }
    }
  };

  const renderItem = ({ item }) => {
    const animaciones = {
      confirmado: require("../../../assets/animaciones/Check Mark - Success.json"),
      pospuesta: require("../../../assets/animaciones/Clock.json"),
      cancelada: require("../../../assets/animaciones/Cross, Close, Cancel Icon Animation.json"),
      pendiente: require("../../../assets/animaciones/Sandy Loading.json"),
    };

    const colores = {
      confirmado: "#4CAF50",
      pospuesta: "#2196F3",
      cancelada: "#f44336",
      pendiente: "#FF9800",
    };

    const anim = animaciones[item.estado] || animaciones.pendiente;
    const color = colores[item.estado] || colores.pendiente;
    const esPendiente = item.estado === "pendiente";

    return (
      <View style={styles.card}>
        <Text style={styles.nombre}>Cliente: {item.nombreUsuario}</Text>
        <Text style={styles.fechaDia}>{formatFecha(item.fecha_cita)}</Text>
        <Text style={styles.fechaHora}>{formatHora(item.fecha_cita)}</Text>

        <View style={styles.estadoContainer}>
          <LottieView
            source={anim}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
            colorFilters={[{ keypath: "**", color }]}
          />
          <Text style={[styles.estadoTexto, { color }]}>
            {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
          </Text>
        </View>

        <View style={styles.botonesContainer}>
          {rol === "Admin" ? (
            <>
              {esPendiente && (
                <TouchableOpacity
                  style={[styles.boton, styles.botonConfirmar]}
                  onPress={() => handleConfirmar(item.id)}
                >
                  <Text style={styles.textoBoton}>Confirmar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.boton, styles.botonPosponer]}
                onPress={() => handlePosponer(item)}
              >
                <Text style={styles.textoBoton}>Posponer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={() => handleCancelar(item.id)}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.boton, styles.botonEditar]}
                onPress={() => abrirPicker("editar", item)}
              >
                <Text style={styles.textoBoton}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={() => handleCancelar(item.id)}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={citasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No hay citas disponibles.
          </Text>
        }
        ListHeaderComponent={
          <>
          {rol === "Admin" && (
            <View style={styles.barraBusqueda}>
              <TextInput
                style={styles.inputBusqueda}
                placeholder="Buscar cita..."
                value={busqueda}
                onChangeText={setBusqueda}
              />
              {busqueda.length > 0 && (
                <TouchableOpacity onPress={() => setBusqueda("")} style={styles.botonBorrar}>
                  <MaterialIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          )}
            <View style={styles.filtroContainer}>
              <TouchableOpacity
                style={[
                  styles.filtroBtn,
                  filtroEstado === "confirmado" && styles.filtroActivo,
                ]}
                onPress={() => setFiltroEstado("confirmado")}
              >
                <Text
                  style={[
                    filtroEstado === "confirmado"
                      ? styles.filtroActivoText
                      : styles.filtroTexto,
                  ]}
                >
                  Confirmados
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filtroBtn,
                  filtroEstado === "pendiente" && styles.filtroActivo,
                ]}
                onPress={() => setFiltroEstado("pendiente")}
              >
                <Text
                  style={[
                    filtroEstado === "pendiente"
                      ? styles.filtroActivoText
                      : styles.filtroTexto,
                  ]}
                >
                  Pendientes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filtroBtn,
                  filtroEstado === "cancelada" && styles.filtroActivo,
                ]}
                onPress={() => setFiltroEstado("cancelada")}
              >
                <Text
                  style={[
                    filtroEstado === "cancelada"
                      ? styles.filtroActivoText
                      : styles.filtroTexto,
                  ]}
                >
                  Canceladas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filtroBtn,
                  filtroEstado === "ninguno" && styles.filtroActivo,
                ]}
                onPress={() => {
                  setFiltroEstado("ninguno");
                  setFiltroFecha(null);
                }}
              >
                <Text
                  style={[
                    filtroEstado === "ninguno"
                      ? styles.filtroActivoText
                      : styles.filtroTexto,
                  ]}
                >
                  Quitar filtro
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />

      {mostrarPicker && (
        <DateTimePicker
          value={citaSeleccionada?.fecha_temp || new Date()}
          mode={modoPicker}
          display="default"
          onChange={onChangePicker}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    marginHorizontal: 14,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  fechaDia: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },
  fechaHora: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 10,
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  estadoTexto: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  boton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  botonConfirmar: { backgroundColor: "#4CAF50" },
  botonCancelar: { backgroundColor: "#f44336" },
  botonPosponer: { backgroundColor: "#2196F3" },
  botonEditar: { backgroundColor: "#FF9800" },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default ListaCitas;