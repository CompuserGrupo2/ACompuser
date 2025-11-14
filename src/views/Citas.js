import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import FormularioCitas from "../Componentes/Citas/FormularioCitas";
import ListaCitas from "../Componentes/Citas/ListaCitas";
import { LinearGradient } from "expo-linear-gradient";

const Citas = ({ rol, userId }) => {
  const [actualizarLista, setActualizarLista] = useState(0);

  const recargar = () => setActualizarLista((prev) => prev + 1);

  const renderItem = () => (
    <View>
      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Text style={styles.headerTitle}>Citas</Text>
      </LinearGradient>

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
  header: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 26
  },
});

export default Citas;