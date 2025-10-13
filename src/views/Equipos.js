import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ListaEquipos from '../Componentes/Equipos/ListaEquipos';
import TablaEquipos from '../Componentes/Equipos/TablaEquipos';
import FormularioEquipos from '../Componentes/Equipos/FormularioEquipos';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "EquipoComputarizado"));
      const data = [];

      for (const docEquipo of querySnapshot.docs) {
        // Traer clientes de la subcolección
        const clientesSnapshot = await getDocs(collection(db, "EquipoComputarizado", docEquipo.id, "Clientes"));
        const clientes = clientesSnapshot.docs.map(doc => doc.data());

        data.push({ id: docEquipo.id, ...docEquipo.data(), clientes });
      }

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

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <FormularioEquipos cargarDatos={cargarDatos} />
      <ListaEquipos />
      <TablaEquipos
        equipos={equipos}
        eliminarEquipo={eliminarEquipo}
        cargarDatos={cargarDatos}
      />
    </View>
  );

  return (
    <FlatList
      data={[{ id: "single-item" }]} // Solo un elemento para usar el scroll completo
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  contentContainer: { flexGrow: 1 },
});

export default Equipos;
