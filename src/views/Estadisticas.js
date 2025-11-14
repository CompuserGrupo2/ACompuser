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
import { LineChart } from "react-native-chart-kit"; 
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width - 40;
const MONTHS_TO_SHOW = 6;


const RatingBar = ({ name, rating, color, maxRating = 5.0 }) => {
    const barWidth = (rating / maxRating) * 100;

    return (
        <View style={styles.ratingBarContainer}>
            <View style={styles.ratingBarHeader}>
                <Text style={styles.ratingBarName} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.ratingBarValue}>
                    {rating} ⭐
                </Text>
            </View>
            
            <View style={styles.ratingBarBackground}>
                <View style={[
                    styles.ratingBarForeground, 
                    { width: `${barWidth}%`, backgroundColor: color }
                ]} />
            </View>
        </View>
    );
};

const getColorForRank = (index) => {
    const colors = [
      "#007AFF",
      "#34C759",
      "#FF9500",
      "#FF3B30",
      "#5856D6",
    ];
    return colors[index % colors.length];
};

const Estadisticas = ({ rol }) => {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  
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
          nombreUsuario: raw.nombreUsuario || "Usuario",
          userId: raw.userId || null,
          fecha_cita: fechaCita,
          estado: raw.estado || "pendiente",
        };
      });
      setCitas(data);
    });

    return () => unsub();
  }, [rol]);

  
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

  
  useEffect(() => {
    if (servicios.length === 0) {
        setCargando(false);
        return;
    }

    setCargando(true);
    const listeners = [];
    let completedListeners = 0;

    servicios.forEach((s) => {
      const collectionRef = collection(db, "Servicios", s.id, "Calificaciones");

      const unsub = onSnapshot(collectionRef, (snapshot) => {
        
        const newCalificacionesForService = snapshot.docs.map((doc) => ({
          servicioId: s.id,
          calidad_servicio: doc.data().Calidad_servicio || 0,
        }));
        
        // Actualización funcional para garantizar el estado en tiempo real
        setCalificaciones(prevCalfs => {
            // Filtra las calificaciones que NO sean del servicio actual (s.id)
            const remainingCalificaciones = prevCalfs.filter(c => c.servicioId !== s.id);
            
            // Combina las restantes con las nuevas calificaciones de este servicio
            return [...remainingCalificaciones, ...newCalificacionesForService];
        });

        // Manejo del estado de carga inicial
        if (completedListeners < servicios.length) {
            completedListeners++;
            if (completedListeners === servicios.length) {
                setCargando(false);
            }
        }
      });
      listeners.push(unsub);
    });

    // Detiene todos los listeners cuando el componente se desmonta o servicios cambia
    return () => listeners.forEach(unsub => unsub());

  }, [servicios]);


  
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
      .slice(0, 5)
      .map((s, index) => ({ ...s, color: getColorForRank(index) }));
  };

  const getTopClientes = () => {
    const conteo = {};

    citas.forEach((c) => {
      if (!conteo[c.nombreUsuario]) conteo[c.nombreUsuario] = 0;
      conteo[c.nombreUsuario]++;
    });

    return Object.keys(conteo)
      .map((nombre) => ({ nombre, count: conteo[nombre] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  
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

  
  return (
    <ScrollView style={styles.container}>
       {/* ENCABEZADO */}
      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Text style={styles.headerTitle}>Dashboards</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tendencia de Citas (Últimos {MONTHS_TO_SHOW} meses)</Text>
        <LineChart 
          data={{ labels: citasData.labels, datasets: [{ data: citasData.data }] }}
          width={screenWidth - 20} 
          height={200} 
          yAxisSuffix=" citas" 
          chartConfig={{
            ...chartConfig,
            decimalPlaces: 0, 
            color: (opacity = 1) => `rgba(255,149,0, ${opacity})`, 
            labelColor: (opacity = 1) => `rgba(60,60,67, ${opacity})`,
          }}
          bezier
          style={{}} 
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calificación Promedio de Servicios (Top 5)</Text>
        {topServicios.length > 0 ? (
            topServicios.map((s, i) => (
                <RatingBar
                    key={i}
                    name={s.nombre}
                    rating={s.avg}
                    color={s.color}
                />
            ))
        ) : (
          <Text style={styles.emptyText}>No hay calificaciones para mostrar.</Text>
        )}
      </View>

      {topClientes.length > 0 && (
        <LinearGradient
          colors={['#007aff', '#5ac8fa']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.highlightCard]}
        >
          <Text style={styles.highlightTitle}>Cliente Destacado 🏆</Text>
          <Text style={styles.highlightName}>{topClientes[0].nombre}</Text>
          <Text style={styles.highlightValue}>Con {topClientes[0].count} citas registradas.</Text>
        </LinearGradient>
      )}

      {topClientes.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Otros Clientes Frecuentes</Text>
          {topClientes.slice(1).map((c, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.rank}>{i + 2}</Text>
              <Text style={styles.rowName}>{c.nombre}</Text>
              <Text style={styles.rowValue}>{c.count} citas</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
  },
    header: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 26,
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
  emptyText: {
    fontSize: 16,
    color: "#8e8e93",
    textAlign: 'center',
    paddingVertical: 10,
  },
  customHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 15, 
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
  chartStyle: {
    borderRadius: 16,
  },
  ratingBarContainer: {
    marginBottom: 10,
    paddingVertical: 5,
  },
  ratingBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingBarName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3a3a3c',
    flexShrink: 1,
    paddingRight: 10,
  },
  ratingBarValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF9500',
  },
  ratingBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e5ea',
    overflow: 'hidden',
  },
  ratingBarForeground: {
    height: '100%',
    borderRadius: 4,
  },

  
  highlightCard: {
    backgroundColor: 'transparent',
    padding: 25,
    marginVertical: 10,
    borderRadius: 16,
    shadowOpacity: 0,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
  },
  highlightName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 5,
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginTop: 5,
  },

  
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