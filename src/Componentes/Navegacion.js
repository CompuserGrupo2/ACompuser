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

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

// Stack interno para Servicios (Admin)
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

// Componente de Cerrar Sesión
function CerrarSesionScreen({ cerrarSesion }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tabs CLIENTE
function MyTabsCliente({ cerrarSesion }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          headerShown: false,
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
        {() => <Citas rol="Cliente" />}
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

// Tabs ADMIN
function MyTabsAdmin({ cerrarSesion }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          headerShown: false,
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
        {() => <Citas rol="Admin" />}
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

// Componente principal de navegación
export default function Navegacion() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUsuario(user);
      else setUsuario(null);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUsuario(null); // esto vuelve automáticamente al login
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

  // Mostrar login o tabs según usuario
  return (
    <NavigationContainer>
      {usuario ? (
        usuario.rol === "Cliente" ? (
          <MyTabsCliente cerrarSesion={cerrarSesion} />
        ) : (
          <MyTabsAdmin cerrarSesion={cerrarSesion} />
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