import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

export default function Encabezado({ titulo, setPantalla }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [animacion] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 1;
    Animated.timing(animacion, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const cerrarMenu = (pantalla) => {
    // Cambiar pantalla
    setPantalla(pantalla);
    // Animar cierre del menú
    Animated.timing(animacion, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  const alturaMenu = animacion.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // altura del menú desplegado
  });

  return (
    <View>
      {/* Encabezado principal */}
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo}</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuBoton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Menú desplegable */}
      <Animated.View style={[styles.menuDesplegable, { height: alturaMenu }]}>
        <TouchableOpacity style={styles.item} onPress={() => cerrarMenu("cliente")}>
          <Text style={styles.textoItem}>Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => cerrarMenu("servicios")}>
          <Text style={styles.textoItem}>Servicios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => cerrarMenu("catalogo")}>
          <Text style={styles.textoItem}>Catálogo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => cerrarMenu("calificacion")}>
          <Text style={styles.textoItem}>Calificaciones</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007bff",
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuBoton: {
    padding: 5,
  },
  menuIcon: {
    fontSize: 24,
    color: "white",
  },
  menuDesplegable: {
    overflow: "hidden",
    backgroundColor: "#e5e5e5",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  textoItem: {
    fontSize: 16,
    color: "#333",
  },
});
