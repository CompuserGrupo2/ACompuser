import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../Database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioServicios from "../Componentes/Servicios/FormularioServicios";
import TablaServicios from "../Componentes/Servicios/TablaServicios";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioId, setServicioId] = useState(null);
  const [nuevoServicio, setNuevoServicio] = useState({
    descripcion: "",
    costo: "",
    foto: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Servicios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        descripcion: doc.data().descripcion || "",
        costo: doc.data().costo || 0,
        foto: doc.data().foto || '',
      }));
      setServicios(data);
    } catch (error) {
      console.error("Error al obtener servicios: ", error);
    }
  };

  const eliminarServicio = async (id) => {
    try {
      await deleteDoc(doc(db, "Servicios", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoServicio((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarServicio = async () => {
    try {
      if (nuevoServicio.descripcion.trim() && nuevoServicio.costo.trim && nuevoServicio.foto.trim()) {
        await addDoc(collection(db, "Servicios"), {
          descripcion: nuevoServicio.descripcion.trim(),
          costo: parseFloat(nuevoServicio.costo),
          foto: nuevoServicio.foto.trim(),
        });
        setNuevoServicio({ descripcion: "", costo: "", foto: "", });
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al guardar el servicio: ", error);
    }
  };

  const actualizarServicio = async () => {
    try {
      if (nuevoServicio.descripcion.trim() && nuevoServicio.costo.trim && nuevoServicio.foto.trim()) {
        await updateDoc(doc(db, "Servicios", servicioId), {
          descripcion: nuevoServicio.descripcion.trim(),
          costo: parseFloat(nuevoServicio.costo),
          foto: nuevoServicio.foto.trim(),
        });
        setNuevoServicio({ descripcion: "", costo: "", foto: ""});
        setModoEdicion(false);
        setServicioId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar servicio: ", error);
    }
  };

  const editarServicio = (servicio) => {
    setNuevoServicio({
      descripcion: servicio.descripcion,
      costo: servicio.costo.toString(),
      foto: servicio.foto,
    });
    setServicioId(servicio.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioServicios
        nuevoServicio={nuevoServicio}
        manejoCambio={manejoCambio}
        guardarServicio={guardarServicio}
        actualizarServicio={actualizarServicio}
        modoEdicion={modoEdicion}
      />
      <TablaServicios
        servicios={servicios}
        eliminarServicio={eliminarServicio}
        editarServicio={editarServicio}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Servicios;