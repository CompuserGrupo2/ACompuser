import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import Estadisticas from "../views/Estadisticas"; // ← Añadido

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

function StackDetailServicios() {
  return (
    <StackNav.Navigator initialRouteName="ListaServiciosStack" screenOptions={{ headerShown: false }}>
      <StackNav.Screen name="ListaServiciosStack" component={Servicios} />
      <StackNav.Screen name="Catalogo" component={ListaServicios} />
      <StackNav.Screen name="Citas" component={Citas} />
      <StackNav.Screen name="calificaciones" component={FormularioCalificacion} />
    </StackNav.Navigator>
  );
}

function CerrarSesionScreen({ cerrarSesion }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

function MyTabsCliente({ cerrarSesion, userId }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home} // ← CORREGIDO: era component={={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalogo"
        component={ListaServicios}
        options={{
          tabBarLabel: "Catálogo",
          tabBarIcon: ({ color }) => <FontAwesome name="image" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Citas"
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
        }}
      >
        {() => <Citas rol="Cliente" userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="CerrarSesion"
        options={{
          tabBarLabel: "Cerrar Sesión",
          tabBarIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />,
        }}
      >
        {() => <CerrarSesionScreen cerrarSesion={cerrarSesion} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MyTabsAdmin({ cerrarSesion, userId }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Servicios"
        component={StackDetailServicios}
        options={{
          tabBarLabel: "Servicios",
          tabBarIcon: ({ color }) => <FontAwesome name="wrench" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalogo"
        component={ListaServicios}
        options={{
          tabBarLabel: "Catálogo",
          tabBarIcon: ({ color }) => <FontAwesome name="image" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Citas"
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
        }}
      >
        {() => <Citas rol="Admin" userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Equipos"
        component={Equipos}
        options={{
          tabBarLabel: "Equipos",
          tabBarIcon: ({ color }) => <FontAwesome name="laptop" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Empleados"
        component={Empleados}
        options={{
          tabBarLabel: "Empleados",
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Usuarios"
        component={Usuarios}
        options={{
          tabBarLabel: "Usuarios",
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
      
      {/* ESTADÍSTICAS */}
      <Tab.Screen
        name="Estadisticas"
        options={{
          tabBarLabel: "Estadísticas",
          tabBarIcon: ({ color }) => <FontAwesome name="bar-chart" size={24} color={color} />,
        }}
      >
        {() => <Estadisticas rol="Admin" />}
      </Tab.Screen>

      <Tab.Screen
        name="CerrarSesion"
        options={{
          tabBarLabel: "Cerrar Sesión",
          tabBarIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />,
        }}
      >
        {() => <CerrarSesionScreen cerrarSesion={cerrarSesion} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function Navegacion() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
      setCargando(false);
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

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? (
        usuario.rol === "Cliente" ? (
          <MyTabsCliente cerrarSesion={cerrarSesion} userId={usuario.uid} />
        ) : (
          <MyTabsAdmin cerrarSesion={cerrarSesion} userId={usuario.uid} />
        )
      ) : (
        <Login onLoginSuccess={(userConRol) => setUsuario(userConRol)} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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