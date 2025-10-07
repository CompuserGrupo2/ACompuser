import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Servicios from "./src/views/Servicios";
import Encabezado from "./src/Componentes/Encabezado";
import ListaServicios from "./src/Componentes/Servicios/ListaServicios";
import FormularioCalificacion from "./src/Componentes/Servicios/FormularioCalificacion";

export default function App() {
  const [pantalla, setPantalla] = useState("servicios");

  const renderPantalla = () => {
    switch (pantalla) {
      case "servicios":
        return <Servicios />;
      case "catalogo":
        return <ListaServicios />;
      case "calificacion":
        return <FormularioCalificacion />;
      default:
        return <Servicios />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Encabezado titulo="ACompuser" />

      {/* Menú de botones */}
      <View style={styles.menu}>
        {/* Servicios */}
        <TouchableOpacity
          style={[styles.boton, pantalla === "servicios" && styles.activo]}
          onPress={() => setPantalla("servicios")}
        >
          <Text style={styles.textoBoton}>Servicios</Text>
        </TouchableOpacity>

        {/* Catálogo */}
        <TouchableOpacity
          style={[styles.boton, pantalla === "catalogo" && styles.activo]}
          onPress={() => setPantalla("catalogo")}
        >
          <Text style={styles.textoBoton}>Catálogo</Text>
        </TouchableOpacity>

        {/* Calificaciones */}
        <TouchableOpacity
          style={[styles.boton, pantalla === "calificacion" && styles.activo]}
          onPress={() => setPantalla("calificacion")}
        >
          <Text style={styles.textoBoton}>Calificaciones</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.contenido}>{renderPantalla()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5e5e5",
    paddingVertical: 10,
  },

  boton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  textoBoton: {
    fontSize: 14,
    color: "#333",
  },

  activo: {
    borderBottomWidth: 2,
    borderBottomColor: "#7E84F2",
  },

  contenido: {
    flex: 1,
  },
});
