import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image,} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
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
import AcercaDeLaEmpresa from "../views/AcercaDeLaEmpresa";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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
  <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
      headerShown: true,
        headerTintColor: '#fff',
        headerTitleAlign: 'center',

        headerBackground: () => (
          <LinearGradient
            colors={['#0057ff', '#00c6ff']}
            style={{ flex: 1 }}
          />
        ),
        headerTitle: ({ children }) => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require('../../Imagenes/Mouse_Compuser.png')}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
                marginRight: 8,
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
              {children}
            </Text>
          </View>
        ),
      }}
      >
      <Tab.Screen
        name="Home"
        component={Home}  
        options={{
          title: "Compuser",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catálogo"
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

function MyTabsAdmin({ userId }) {
  return (
    <Tab.Navigator
      initialRouteName="InicioAdmin"
      screenOptions={{
        headerShown: false,
        headerTintColor: "#000", 
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold", 
        },
      }}
    >
      <Tab.Screen
        name="InicioAdmin"
        component={AcercaDeLaEmpresa}
        options={{
          title: "Compuser",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catálogo"
        component={ListaServicios}
        options={{
          tabBarLabel: "Catálogo",
          tabBarIcon: ({ color }) => <FontAwesome name="image" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Citas"
        children={() => <Citas rol="Admin" userId={userId} />}
        options={{
          tabBarLabel: "Citas",
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        children={() => <Estadisticas rol="Admin" />}
        options={{
          tabBarLabel: "Estadísticas",
          tabBarIcon: ({ color }) => <FontAwesome name="bar-chart" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function MyDrawerAdmin({ cerrarSesion, userId }) {
  return (
    <Drawer.Navigator
      initialRouteName="PanelPrincipal" 
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#B2EBF2",
        drawerActiveTintColor: "#8547b7ff",

        headerBackground: () => (
          <LinearGradient colors={["#0057ff", "#00c6ff"]} style={{ flex: 1 }} />
        ),
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="PanelPrincipal"
        options={{
          title: "Panel Administrativo",
          drawerIcon: ({ color }) => (
            <Ionicons name="apps-outline" size={24} color={color} />
          ),
        }}
      >
        {() => <MyTabsAdmin userId={userId} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="ServiciosStack"
        component={StackDetailServicios}
        options={{
          title: "Servicios",
          drawerIcon: ({ color }) => <FontAwesome name="wrench" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ClientesDrawer"
        component={Clientes}
        options={{
          title: "Clientes",
          drawerIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="EquiposDrawer"
        component={Equipos}
        options={{
          title: "Equipos",
          drawerIcon: ({ color }) =>
            <FontAwesome name="laptop" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="EmpleadosDrawer"
        component={Empleados}
        options={{
          title: "Empleados",
          drawerIcon: ({ color }) =>
            <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="UsuariosDrawer"
        component={Usuarios}
        options={{
          title: "Usuarios",
          drawerIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="CerrarSesionDrawer"
        children={() => <CerrarSesionScreen cerrarSesion={cerrarSesion} />}
        options={{
          title: "Cerrar Sesión",
          drawerIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />,
        }}
      />

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
          <MyDrawerAdmin cerrarSesion={cerrarSesion} userId={usuario.uid} />
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