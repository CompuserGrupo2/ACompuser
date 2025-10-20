import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Database/firebaseconfig"; 
import Login from "../views/Login";

import Usuarios from "../views/Usuarios";
import Clientes from "../views/Clientes";
import Empleados from "../views/Empleados";
import Equipos from "../views/Equipos";
import Servicios from "../views/Servicios";
import ListaServicios from "./Servicios/ListaServicios";
import Home from "../views/Home";
import Citas from "../views/Citas";
import FormularioCalificacion from "./Servicios/FormularioCalificacion";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const DetailsServiciosNavigator = createStackNavigator();

function StackDetailServicios() {
  return (
    <DetailsServiciosNavigator.Navigator
      initialRouteName="Servicios"
      screenOptions={{ headerShown: false }} 
    >
      <DetailsServiciosNavigator.Screen
        name="Servicios"
        component={Servicios}
      />
      <DetailsServiciosNavigator.Screen
        name="Catalogo"
        component={ListaServicios}
      />
      <DetailsServiciosNavigator.Screen name="Citas" component={Citas} />
      <DetailsServiciosNavigator.Screen
        name="calificaciones"
        component={FormularioCalificacion}
      />
    </DetailsServiciosNavigator.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Acerca de la Empresa",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Servicios"
        component={StackDetailServicios}
        options={{
          tabBarLabel: "Servicios",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="wrench" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Catalogo"
        component={ListaServicios}
        options={{
          tabBarLabel: "Catálogo",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="image" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="calificaciones"
        component={FormularioCalificacion}
        options={{
          tabBarLabel: "Calificaciones",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="star" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citas"
        component={Citas}
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Equipos"
        component={Equipos}
        options={{
          tabBarLabel: "Equipos",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="laptop" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Empleados"
        component={Empleados}
        options={{
          tabBarLabel: "Empleados",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Usuarios"
        component={Usuarios}
        options={{
          tabBarLabel: "Usuarios",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Autenticación
export default function Navegacion() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Encabezado cerrar sesión
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienvenid@</Text>
        <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 96,
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  logoutButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
