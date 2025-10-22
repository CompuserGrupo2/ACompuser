import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import ListaEquipos from "../Componentes/Equipos/ListaEquipos";
import TablaEquipos from "../Componentes/Equipos/TablaEquipos";
import FormularioEquipos from "../Componentes/Equipos/FormularioEquipos";

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoId, setEquipoId] = useState(null);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    color: "",
    marca: "",
    modelo: "",
    tipo: "",
    cliente: null,
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "EquipoComputarizado"));
      const data = querySnapshot.docs.map(docEquipo => ({
        id: docEquipo.id,
        ...docEquipo.data()
      }));
      setEquipos(data);
    } catch (error) {
      console.error("Error al obtener equipos: ", error);
    }
  };

  const eliminarEquipo = async (id) => {
    try {
      await deleteDoc(doc(db, "EquipoComputarizado", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar equipo computarizado:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoEquipo(prev => ({ ...prev, [nombre]: valor }));
  };

  const guardarEquipo = async () => {
    try {
      if (
        nuevoEquipo.color.trim() &&
        nuevoEquipo.marca.trim() &&
        nuevoEquipo.modelo.trim() &&
        nuevoEquipo.tipo.trim() &&
        nuevoEquipo.cliente
      ) {
        await addDoc(collection(db, "EquipoComputarizado"), {
          color: nuevoEquipo.color.trim(),
          marca: nuevoEquipo.marca.trim(),
          modelo: nuevoEquipo.modelo.trim(),
          tipo: nuevoEquipo.tipo.trim(),
          cliente: nuevoEquipo.cliente,
        });
        setNuevoEquipo({ color: "", marca: "", modelo: "", tipo: "", cliente: null });
        setModoEdicion(false);
        setEquipoId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos y seleccione un cliente.");
      }
    } catch (error) {
      console.error("Error al guardar el equipo: ", error);
    }
  };

  const actualizarEquipo = async () => {
    try {
      if (
        nuevoEquipo.color.trim() &&
        nuevoEquipo.marca.trim() &&
        nuevoEquipo.modelo.trim() &&
        nuevoEquipo.tipo.trim() &&
        nuevoEquipo.cliente
      ) {
        await updateDoc(doc(db, "EquipoComputarizado", equipoId), {
          color: nuevoEquipo.color.trim(),
          marca: nuevoEquipo.marca.trim(),
          modelo: nuevoEquipo.modelo.trim(),
          tipo: nuevoEquipo.tipo.trim(),
          cliente: nuevoEquipo.cliente,
        });
        setNuevoEquipo({ color: "", marca: "", modelo: "", tipo: "", cliente: null });
        setModoEdicion(false);
        setEquipoId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos y seleccione un cliente.");
      }
    } catch (error) {
      console.error("Error al actualizar equipo: ", error);
    }
  };

  const editarEquipo = (equipo) => {
    setNuevoEquipo({ ...equipo });
    setEquipoId(equipo.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <FormularioEquipos
        nuevoEquipo={nuevoEquipo}
        manejoCambio={manejoCambio}
        guardarEquipo={guardarEquipo}
        actualizarEquipo={actualizarEquipo}
        modoEdicion={modoEdicion}
        cargarDatos={cargarDatos}
      />
      <ListaEquipos equipos={equipos} />
      <TablaEquipos
        equipos={equipos}
        eliminarEquipo={eliminarEquipo}
        editarEquipo={editarEquipo}
        cargarDatos={cargarDatos}
      />
    </View>
  );

  return (
    <FlatList
      data={[{ id: "single-item" }]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  contentContainer: {
    flexGrow: 1
  },
});

export default Equipos;
