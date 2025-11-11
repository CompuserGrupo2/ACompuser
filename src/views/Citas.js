import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import FormularioCitas from "../Componentes/Citas/FormularioCitas";
import ListaCitas from "../Componentes/Citas/ListaCitas";

const Citas = ({ rol }) => {
  const [actualizarLista, setActualizarLista] = useState(false);

  return (
    <View style={styles.container}>
      {/* El formulario solo se muestra para CLIENTES */}
      {rol === "Cliente" && (
        <FormularioCitas cargarCitas={() => setActualizarLista(!actualizarLista)} />
      )}
      
      <ListaCitas actualizarLista={actualizarLista} rol={rol} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, padding: 15, backgroundColor: "#f0f2f5" },
});

export default Citas;