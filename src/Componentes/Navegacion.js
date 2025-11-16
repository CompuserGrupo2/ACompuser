import React, { useState, useEffect } from "react";
import {View, Text, ActivityIndicator, Image, } from "react-native";

import { NavigationContainer, getFocusedRouteNameFromRoute, } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

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
import Estadisticas from "../views/Estadisticas";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HeaderTitle = ({ title }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image
      source={require("../../Imagenes/Mouse_Compuser.png")}
      style={{
        width: 40,
        height: 40,
        resizeMode: "contain",
        marginRight: 8,
      }}
    />
    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
      {title}
    </Text>
  </View>
);

function StackDetailServicios() {
  return (
    <StackNav.Navigator screenOptions={{ headerShown: false }}>
      <StackNav.Screen name="ListaServiciosStack" component={Servicios} />
      <StackNav.Screen name="Catalogo" component={ListaServicios} />
      <StackNav.Screen name="Citas" component={Citas} />
      <StackNav.Screen
        name="calificaciones"
        component={FormularioCalificacion}
      />
    </StackNav.Navigator>
  );
}

function CerrarSesionDrawer({ cerrarSesion }) {
  useEffect(() => {
    cerrarSesion();
  }, []);

  return null; 
}

function MyTabsCliente({ cerrarSesion, userId }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerBackground: () => (
          <LinearGradient colors={["#0057ff", "#00c6ff"]} style={{ flex: 1 }} />
        ),
        headerTitle: ({ children }) => <HeaderTitle title={children} />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Inicio",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Catálogo"
        component={ListaServicios}
        options={{
          title: "Catalogo",
          tabBarLabel: "Catalogo",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="image" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citas"
        options={{
          title: "Citas",
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
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
        {() => <CerrarSesionDrawer cerrarSesion={cerrarSesion} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MyTabsAdmin({ userId }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="InicioAdmin"
        component={Home}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Catálogo"
        component={ListaServicios}
        options={{
          tabBarLabel: "Catálogo",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="image" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citas"
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      >
        {() => <Citas rol="Admin" userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarLabel: "Estadísticas",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={24} color={color} />
          ),
        }}
      >
        {() => <Estadisticas rol="Admin" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MyDrawerAdmin({ cerrarSesion, userId }) {
  return (
    <Drawer.Navigator
      initialRouteName="PanelPrincipal"
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#d0f6fbff",
        drawerActiveTintColor: "#0057ff",
        headerBackground: () => (
          <LinearGradient colors={["#0057ff", "#00c6ff"]} style={{ flex: 1 }} />
        ),
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Drawer.Screen
        name="PanelPrincipal"
        options={({ route }) => {
          const tabName = getFocusedRouteNameFromRoute(route) ?? "InicioAdmin";

          const titles = {
            InicioAdmin: "Inicio",
            Catálogo: "Catálogo",
            Citas: "Citas",
            Dashboard: "Estadísticas",
          };

          const titulo = titles[tabName] || "Compuser";

          return {
            drawerLabel: "Zona Comercial",
            drawerIcon: ({ color }) => (
              <Ionicons name="apps-outline" size={24} color={color} />
            ),
            headerTitle: () => <HeaderTitle title={titulo} />,
          };
        }}
      >
        {() => <MyTabsAdmin userId={userId} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="ServiciosStack"
        component={StackDetailServicios}
        options={{
          drawerLabel: "Servicios",
          drawerIcon: ({ color }) => (
            <FontAwesome name="wrench" size={24} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Servicios" />,
        }}
      />
      <Drawer.Screen
        name="ClientesDrawer"
        component={Clientes}
        options={{
          drawerLabel: "Clientes",
          drawerIcon: ({ color }) => (
            <FontAwesome name="users" size={24} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Clientes" />,
        }}
      />
      <Drawer.Screen
        name="EquiposDrawer"
        component={Equipos}
        options={{
          drawerLabel: "Equipos",
          drawerIcon: ({ color }) => (
            <FontAwesome name="laptop" size={24} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Equipos" />,
        }}
      />
      <Drawer.Screen
        name="EmpleadosDrawer"
        component={Empleados}
        options={{
          drawerLabel: "Empleados",
          drawerIcon: ({ color }) => (
            <FontAwesome name="id-badge" size={24} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Empleados" />,
        }}
      />
      <Drawer.Screen
        name="UsuariosDrawer"
        component={Usuarios}
        options={{
          drawerLabel: "Usuarios",
          drawerIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
          headerTitle: () => <HeaderTitle title="Usuarios" />,
        }}
      />
      <Drawer.Screen
        name="CerrarSesionDrawer"
        options={{
          title: "Cerrar Sesión",
          drawerIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />,
        }}
      >
        {() => <CerrarSesionDrawer cerrarSesion={cerrarSesion} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function Navegacion() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user || null);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0057ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? (
        usuario.rol === "Cliente" ? (
          <MyTabsCliente cerrarSesion={cerrarSesion} userId={usuario.uid} />
        ) : (
          <MyDrawerAdmin cerrarSesion={cerrarSesion} userId={usuario.uid} />
        )
      ) : (
        <Login onLoginSuccess={(userConRol) => setUsuario(userConRol)} />
      )}
    </NavigationContainer>
  );
}