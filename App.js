import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Servicios from "./src/views/Servicios";
import Encabezado from "./src/Componentes/Encabezado";
import ListaServicios from "./src/Componentes/Servicios/ListaServicios";
import FormularioCalificacion from "./src/Componentes/Servicios/FormularioCalificacion";
import Equipos from "./src/views/Equipos";
import Clientes from "./src/views/Clientes";
import Empleados from "./src/views/Empleados";

export default function App() {
  const [pantalla, setPantalla] = useState("catalogo");

  const renderPantalla = () => {
    switch (pantalla) {
      case "cliente":
        return <Clientes setPantalla={setPantalla} />;
      case "servicios":
        return <Servicios setPantalla={setPantalla} />;
      case "catalogo":
        return <ListaServicios />;
      case "calificacion":
        return <FormularioCalificacion />;
      case "equipo":
        return <Equipos />;
      case "empleados":
        return <Empleados setPantalla={setPantalla} />;
      default:
        return <Servicios setPantalla={setPantalla} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con menú desplegable */}
      <Encabezado titulo="ACompuser" setPantalla={setPantalla} />

      {/* Contenido dinámico */}
      <View style={styles.contenido}>{renderPantalla()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  contenido: { flex: 1 },
});
