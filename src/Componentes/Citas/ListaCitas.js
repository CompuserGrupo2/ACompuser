import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ← NUEVO
import { confirmarCita, cancelarCita, posponerCita, editarCitaCliente } from "./accionesCitas";
import DateTimePicker from "@react-native-community/datetimepicker";

const auth = getAuth(); // ← Usuario actual

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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>Cliente: {item.nombreUsuario}</Text>
      <Text style={styles.fecha}>Fecha: {item.fecha_cita.toLocaleString()}</Text>
      <Text style={[styles.estado,
        item.estado === "confirmado" ? styles.confirmado :
        item.estado === "cancelada" ? styles.cancelada :
        item.estado === "pospuesta" ? styles.pospuesta : styles.pendiente
      ]}>
        {item.estado}
      </Text>

      <View style={styles.botonesContainer}>
        {rol === "Admin" ? (
          <>
            <TouchableOpacity style={[styles.boton, styles.botonConfirmar]} onPress={() => handleConfirmar(item.id)}>
              <Text style={styles.textoBoton}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.boton, styles.botonPosponer]} onPress={() => abrirPicker("posponer", item)}>
              <Text style={styles.textoBoton}>Posponer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={[styles.boton, styles.botonEditar]} onPress={() => abrirPicker("editar", item)}>
              <Text style={styles.textoBoton}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.boton, styles.botonCancelar]} onPress={() => handleCancelar(item.id)}>
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

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
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 4 },
  fecha: { fontSize: 14, color: "#555", marginBottom: 6 },
  estado: { fontSize: 14, fontWeight: "bold", textTransform: "capitalize" },
  confirmado: { color: "#4CAF50" },
  cancelada: { color: "#f44336" },
  pospuesta: { color: "#2196F3" },
  pendiente: { color: "#FF9800" },
  botonesContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  boton: { flex: 1, padding: 8, borderRadius: 5, marginHorizontal: 3, alignItems: "center" },
  botonConfirmar: { backgroundColor: "#4CAF50" },
  botonCancelar: { backgroundColor: "#f44336" },
  botonPosponer: { backgroundColor: "#2196F3" },
  botonEditar: { backgroundColor: "#FF9800" },
  textoBoton: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});

export default ListaCitas;