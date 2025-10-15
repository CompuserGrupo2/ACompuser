import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import FormularioCitas from "../Componentes/Citas/FormularioCitas";
import ListaCitas from "../Componentes/Citas/ListaCitas";

const Citas = () => {
  const [actualizarLista, setActualizarLista] = useState(false);

  return (
    <View style={styles.container}>
      <FormularioCitas cargarCitas={() => setActualizarLista(!actualizarLista)} />
      <ListaCitas actualizarLista={actualizarLista} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f0f2f5" },
});

export default Citas;
