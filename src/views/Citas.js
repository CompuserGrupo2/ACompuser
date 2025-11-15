import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import FormularioCitas from "../Componentes/Citas/FormularioCitas";
import ListaCitas from "../Componentes/Citas/ListaCitas";

const Citas = ({ rol, userId }) => {
  const [actualizarLista, setActualizarLista] = useState(0);

  const recargar = () => setActualizarLista((prev) => prev + 1);

  const renderItem = () => (
    <View>
      {rol === "Cliente" && <FormularioCitas cargarCitas={recargar} />}

      <ListaCitas 
        actualizarLista={actualizarLista} 
        rol={rol} 
        userId={userId} 
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
    backgroundColor: "#f0f2f5",
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default Citas;