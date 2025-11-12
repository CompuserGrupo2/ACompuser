import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { confirmarCita, cancelarCita, posponerCita, editarCitaCliente } from "./accionesCitas";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons"; // ← Iconos reales

const auth = getAuth();

const ListaCitas = ({ actualizarLista, rol }) => {
  const [citas, setCitas] = useState([]);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [accionTipo, setAccionTipo] = useState("");

  const cargarCitas = async () => {
    try {
      const q = query(collection(db, "Citas"), orderBy("fecha_cita", "asc"));
      const snapshot = await getDocs(q);

      const user = auth.currentUser;
      const nombreActual = user?.displayName || 
        (user?.email ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1) : "Anónimo");

      const citas = snapshot.docs.map(doc => {
        const data = doc.data();
        let fechaCita;

        if (data.fecha_cita && typeof data.fecha_cita.toDate === "function") {
          fechaCita = data.fecha_cita.toDate();
        } else if (typeof data.fecha_cita === "string") {
          fechaCita = new Date(data.fecha_cita);
        } else {
          fechaCita = new Date();
        }

        const nombreUsuario = data.nombreUsuario || nombreActual;

        return {
          id: doc.id,
          fecha_cita: fechaCita,
          estado: data.estado || "pendiente",
          nombreUsuario,
        };
      });

      setCitas(citas);
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
      setCitaSeleccionada(prev => ({ ...prev, fecha_temp: new Date(selectedDate) }));
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
    const estadoConfig = {
      confirmado: { icon: "check-circle", color: "#4CAF50", label: "Confirmado" },
      pospuesta: { icon: "access-time", color: "#2196F3", label: "Pospuesto" },
      cancelada: { icon: "cancel", color: "#f44336", label: "Cancelado" },
      pendiente: { icon: "hourglass-empty", color: "#FF9800", label: "Pendiente" },
    };

    const config = estadoConfig[item.estado] || estadoConfig.pendiente;

    return (
      <View style={styles.card}>
        <Text style={styles.nombre}>Cliente: {item.nombreUsuario}</Text>
        <Text style={styles.fecha}>Fecha: {item.fecha_cita.toLocaleString()}</Text>

        {/* ESTADO CON ICONO REAL */}
        <View style={[styles.estadoBadge, { backgroundColor: config.color + "20" }]}>
          <Icon name={config.icon} size={18} color={config.color} style={styles.estadoIcon} />
          <Text style={[styles.estadoTexto, { color: config.color }]}>{config.label}</Text>
        </View>

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
    color: "#2c3e50"
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 12, 
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  nombre: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#2c3e50", 
    marginBottom: 4 
  },
  fecha: { 
    fontSize: 14, 
    color: "#555", 
    marginBottom: 10 
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  estadoIcon: {
    marginRight: 6,
  },
  estadoTexto: {
    fontSize: 14,
    fontWeight: "bold",
  },
  botonesContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 5 
  },
  boton: { 
    flex: 1, 
    padding: 10, 
    borderRadius: 8, 
    marginHorizontal: 4, 
    alignItems: "center" 
  },
  botonConfirmar: { backgroundColor: "#4CAF50" },
  botonCancelar: { backgroundColor: "#f44336" },
  botonPosponer: { backgroundColor: "#2196F3" },
  botonEditar: { backgroundColor: "#FF9800" },
  textoBoton: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13 
  },
});

export default ListaCitas;