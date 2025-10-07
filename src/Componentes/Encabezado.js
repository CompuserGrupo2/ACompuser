import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Encabezado({ titulo }) {
  return (
    <View style={styles.header}>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007bff",
    paddingVertical: 30,
    alignItems: "center",
  },
  titulo: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
