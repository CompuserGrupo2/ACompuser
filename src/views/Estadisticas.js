// Estadisticas.js - Versión estilo iOS limpia y elegante
// Totalmente rediseñado con estética iOS y con corrección para mostrar el nombre de usuario

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../Database/firebaseconfig";
import { BarChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width - 40;
const MONTHS_TO_SHOW = 6;

const Estadisticas = ({ rol }) => {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  /* ===================== FETCH CITAS ===================== */
  useEffect(() => {
    if (rol !== "Admin") return;

    const unsub = onSnapshot(collection(db, "Citas"), (snap) => {
      const data = snap.docs.map((doc) => {
        const raw = doc.data();
        let fechaCita = null;

        if (raw.fecha_cita) {
          const d = new Date(raw.fecha_cita);
          if (!isNaN(d.getTime())) fechaCita = d;
          else if (raw.fecha_cita.seconds) fechaCita = new Date(raw.fecha_cita.seconds * 1000);
        }

        return {
          id: doc.id,
          nombreUsuario: raw.nombreUsuario || "Usuario", // ✔ se toma su nombre
          userId: raw.userId || null,
          fecha_cita: fechaCita,
          estado: raw.estado || "pendiente",
        };
      });
      setCitas(data);
    });

    return () => unsub();
  }, [rol]);

  /* FETCH SERVICIOS */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Servicios"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        descripcion: doc.data().descripcion || "Servicio",
        costo: parseFloat(doc.data().costo) || 0,
      }));
      setServicios(data);
    });
    return () => unsub();
  }, []);

  /* FETCH CALIFICACIONES */
  useEffect(() => {
    if (servicios.length === 0) return setCargando(false);

    const fetchCalificaciones = async () => {
      setCargando(true);

      const all = await Promise.all(
        servicios.map(async (s) => {
          try {
            const snapshot = await getDocs(collection(db, "Servicios", s.id, "Calificaciones"));
            return snapshot.docs.map((doc) => ({
              servicioId: s.id,
              calidad_servicio: doc.data().Calidad_servicio || 0,
            }));
          } catch {
            return [];
          }
        })
      );

      setCalificaciones(all.flat());
      setCargando(false);
    };

    fetchCalificaciones();
  }, [servicios]);

  /* ===================== CÁLCULOS ===================== */

  const getCitasPorMes = () => {
    const meses = Array(MONTHS_TO_SHOW).fill(0);
    const labels = [];
    const hoy = new Date();

    citas.forEach((c) => {
      if (!c.fecha_cita || isNaN(c.fecha_cita.getTime())) return;

      const diff =
        hoy.getFullYear() * 12 + hoy.getMonth() -
        (c.fecha_cita.getFullYear() * 12 + c.fecha_cita.getMonth());

      if (diff >= 0 && diff < MONTHS_TO_SHOW) meses[MONTHS_TO_SHOW - 1 - diff]++;
    });

    for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
      const mes = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      labels.push(mes.toLocaleString("es-ES", { month: "short" }).toUpperCase());
    }

    return { labels, data: meses };
  };

  const getTopServicios = () => {
    const proms = {};

    calificaciones.forEach((c) => {
      if (!proms[c.servicioId]) proms[c.servicioId] = { sum: 0, count: 0 };
      proms[c.servicioId].sum += c.calidad_servicio;
      proms[c.servicioId].count++;
    });

    return Object.keys(proms)
      .map((id) => ({
        nombre: servicios.find((s) => s.id === id)?.descripcion,
        avg: parseFloat((proms[id].sum / proms[id].count).toFixed(1)),
      }))
      .filter((x) => x.nombre)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  };

  const getTopClientes = () => {
    const conteo = {};

    citas.forEach((c) => {
      if (!conteo[c.nombreUsuario]) conteo[c.nombreUsuario] = 0;
      conteo[c.nombreUsuario]++; // ✔ AHORA SE USA SU NOMBRE
    });

    return Object.keys(conteo)
      .map((nombre) => ({ nombre, count: conteo[nombre] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  /* ===================== LOADING ===================== */

  if (cargando)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Cargando estadísticas…</Text>
      </View>
    );

  const citasData = getCitasPorMes();
  const topServicios = getTopServicios();
  const topClientes = getTopClientes();

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,122,255, ${opacity})`,
    labelColor: () => "#3a3a3c",
    propsForBackgroundLines: {
      stroke: "#e5e5ea",
    },
    propsForBars: {
      borderRadius: 10,
    },
  };

  /* ===================== RENDER ===================== */

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Resumen general</Text>
      </View>

      {/* GRÁFICO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Citas por Mes</Text>
        <BarChart
          data={{ labels: citasData.labels, datasets: [{ data: citasData.data }] }}
          width={screenWidth - 20}
          height={240}
          fromZero
          chartConfig={chartConfig}
          style={styles.chartStyle}
        />
      </View>

      {/* SERVICIOS MEJOR CALIFICADOS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Servicios Mejor Calificados</Text>
        {topServicios.map((s, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Text style={styles.rowName}>{s.nombre}</Text>
            <Text style={styles.rowValue}>{s.avg} ⭐</Text>
          </View>
        ))}
      </View>

      {/* CLIENTES FRECUENTES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Clientes con Más Citas</Text>
        {topClientes.map((c, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Text style={styles.rowName}>{c.nombre}</Text>
            <Text style={styles.rowValue}>{c.count}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

/* ===================== ESTILOS IOS ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8e8e93",
  },

  /* HEADER */
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f7",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  subtitle: {
    fontSize: 16,
    color: "#8e8e93",
    marginTop: 2,
  },

  /* CARD */
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1c1c1e",
  },

  /* GRÁFICO */
  chartStyle: {
    borderRadius: 16,
  },

  /* LISTAS */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  rank: {
    width: 28,
    fontSize: 16,
    fontWeight: "700",
    color: "#007aff",
  },
  rowName: {
    flex: 1,
    fontSize: 16,
    color: "#3a3a3c",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007aff",
  },
});

export default Estadisticas;