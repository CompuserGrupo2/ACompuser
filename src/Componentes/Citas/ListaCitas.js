    import React, { useEffect, useState } from "react";
import {View,Text,FlatList,TouchableOpacity,StyleSheet,Platform,} from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {confirmarCita,cancelarCita,posponerCita,editarCitaCliente,} from "./accionesCitas";
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";

const ListaCitas = ({ actualizarLista, rol }) => {
  const [citas, setCitas] = useState([]);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [accionTipo, setAccionTipo] = useState("");

  // === FORMATO DE FECHA Y HORA ===
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
      const citasQuery = query(collection(db, "Citas"), orderBy("fecha_cita", "asc"));
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
        };
      });

      setCitas(datos);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [actualizarLista]);

  const handleConfirmar = async (id) => {
    await confirmarCita(id);
    cargarCitas();
  };

  const handleCancelar = async (id) => {
    await cancelarCita(id);
    cargarCitas();
  };

  const abrirPicker = (tipo, cita) => {
    setCitaSeleccionada({ ...cita, fecha_temp: new Date(cita.fecha_cita) });
    setAccionTipo(tipo);
    setModoPicker("date");
    setMostrarPicker(true);
  };

  const onChangePicker = (_, selectedDate) => {
    if (!selectedDate) {
      setMostrarPicker(false);
      return;
    }

    if (modoPicker === "date") {
      setCitaSeleccionada((prev) => ({ ...prev, fecha_temp: new Date(selectedDate) }));
      if (Platform.OS === "android") setModoPicker("time");
    } else {
      const nuevaFecha = new Date(citaSeleccionada.fecha_temp);
      nuevaFecha.setHours(selectedDate.getHours());
      nuevaFecha.setMinutes(selectedDate.getMinutes());

      if (accionTipo === "editar") editarCitaCliente(citaSeleccionada.id, nuevaFecha);
      if (accionTipo === "posponer") posponerCita(citaSeleccionada.id, nuevaFecha, "Reprogramada");

      setMostrarPicker(false);
      cargarCitas();
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

    return (
      <View style={styles.card}>
        <Text style={styles.nombre}>Cliente: {item.nombreUsuario}</Text>

        {/* FECHA Y HORA ESTÉTICAS */}
        <Text style={styles.fechaDia}>{formatFecha(item.fecha_cita)}</Text>
        <Text style={styles.fechaHora}>{formatHora(item.fecha_cita)}</Text>

        {/* ESTADO CON ICONO ANIMADO */}
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

        {/* BOTONES SEGÚN ROL */}
        <View style={styles.botonesContainer}>
          {rol === "Admin" ? (
            <>
              <TouchableOpacity
                style={[styles.boton, styles.botonConfirmar]}
                onPress={() => handleConfirmar(item.id)}
              >
                <Text style={styles.textoBoton}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonPosponer]}
                onPress={() => abrirPicker("posponer", item)}
              >
                <Text style={styles.textoBoton}>Posponer</Text>
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
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        ListHeaderComponent={<Text style={styles.titulo}>Lista de Citas</Text>}
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
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
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
    fontSize: 18,
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
    fontSize: 14,
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
    padding: 10,
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
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
