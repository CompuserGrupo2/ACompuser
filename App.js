import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Servicios from "./src/views/Servicios";
import Clientes from "./src/views/Clientes";

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección Servicios */}
      <Servicios />

      {/* Sección Clientes */}
      <Clientes />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
});
