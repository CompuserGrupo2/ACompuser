import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Button } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ListaEmpleados from "../Componentes/Empleados/ListaEmpleados";
import FormularioEmpleados from "../Componentes/Empleados/FormularioEmpleados";
import TablaEmpleados from "../Componentes/Empleados/TablaEmpleados";

const Empleados = ({ setPantalla }) => {
  const [empleados, setEmpleados] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Empleados"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener empleados: ", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      await deleteDoc(doc(db, "Empleados", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const renderItem = () => (
    <View>
      <FormularioEmpleados cargarDatos={cargarDatos} />
      <ListaEmpleados empleados={empleados} />
      <TablaEmpleados empleados={empleados} eliminarEmpleado={eliminarEmpleado} cargarDatos={cargarDatos} />
      <View style={styles.buttonContainer}>
        <Button title="Volver a Servicios" onPress={() => setPantalla('servicios')} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ id: "single-item" }]} // Usamos un solo elemento para renderizar el contenido
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={<View style={{ height: 20 }} />} // Espacio adicional al final
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Empleados;