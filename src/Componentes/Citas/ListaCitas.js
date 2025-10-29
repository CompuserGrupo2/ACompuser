import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform,
} from "react-native";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { confirmarCita, cancelarCita, posponerCita, editarCitaCliente, } from "./accionesCitas";
import DateTimePicker from "@react-native-community/datetimepicker";

const ListaCitas = ({ actualizarLista, rol }) => {
  const [citas, setCitas] = useState([]);

  // Estado para el DateTimePicker
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [accionTipo, setAccionTipo] = useState("");

  const cargarCitas = async () => {
    try {
      const citasQuery = query(collection(db, "Citas"), orderBy("fecha_cita", "asc"));
      const snapshot = await getDocs(citasQuery);
      const datos = snapshot.docs.map((doc) => {
        const data = doc.data();
        const fechaCita = data.fecha_cita?.toDate ? data.fecha_cita.toDate() : new Date(data.fecha_cita);
        return { id: doc.id, ...data, fecha_cita: fechaCita };
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

  // Función para abrir el picker
  const abrirPicker = (tipo, cita) => {
    setCitaSeleccionada({ ...cita, fecha_temp: new Date(cita.fecha_cita) });
    setAccionTipo(tipo);
    setModoPicker("date");
    setMostrarPicker(true);
  };

  // Función que maneja la selección de fecha y hora
  const onChangePicker = (_, selectedDate) => {
    if (!selectedDate) {
      setMostrarPicker(false);
      return;
    }

    if (modoPicker === "date") {
      // Seleccionamos fecha
      setCitaSeleccionada(prev => ({ ...prev, fecha_temp: new Date(selectedDate) }));
      if (Platform.OS === "android") setModoPicker("time");
    } else {
      // Seleccionamos hora
      const nuevaFecha = new Date(citaSeleccionada.fecha_temp);
      nuevaFecha.setHours(selectedDate.getHours());
      nuevaFecha.setMinutes(selectedDate.getMinutes());

      if (accionTipo === "editar") editarCitaCliente(citaSeleccionada.id, nuevaFecha);
      if (accionTipo === "posponer") posponerCita(citaSeleccionada.id, nuevaFecha, "Reprogramada por administrador");

      setMostrarPicker(false);
      cargarCitas();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.fecha}>📅 {item.fecha_cita.toLocaleString()}</Text>
      <Text
        style={[
          styles.estado,
          item.estado === "confirmado"
            ? styles.confirmado
            : item.estado === "cancelada"
            ? styles.cancelada
            : item.estado === "pospuesta"
            ? styles.pospuesta
            : styles.pendiente,
        ]}
      >
        Estado: {item.estado}
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
        contentContainerStyle={{ paddingBottom: 20 }}
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
    marginBottom: 10, 
    textAlign: "center" 
  },
  card: { 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 12 
  },
  fecha: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  estado: { 
    fontSize: 14, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  confirmado: { 
    color: "green" 
  },
  cancelada: { 
    color: "red" 
  },
  pospuesta: { 
    color: "blue" 
  },
  pendiente: { 
    color: "orange" 
  },
  botonesContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  boton: { 
    flex: 1, 
    padding: 8, 
    borderRadius: 5, 
    margin: 3, 
    alignItems: "center" 
  },
  botonConfirmar: { 
    backgroundColor: "#68d681ff" 
  },
  botonCancelar: { 
    backgroundColor: "#ee717dff" 
  },
  botonPosponer: { 
    backgroundColor: "#68dbfeff" 
  },
  botonEditar: { 
    backgroundColor: "#5dc7d7ff" 
  },
  textoBoton: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13 
  },
});

export default ListaCitas;