import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

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
        tabBarActiveTintColor: "blue",
        headerShown: true,
        headerTintColor: '#fff', 
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackground: () => (
          <LinearGradient
            colors={['#0057ff', '#00c6ff']}
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home} 
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

function MyDrawerAdmin({ cerrarSesion, userId }) {
  const CitasAdmin = (props) => <Citas {...props} rol="Admin" userId={userId} />;
  const EstadisticasAdmin = (props) => <Estadisticas {...props} rol="Admin" />;
  const LogoutScreen = (props) => <CerrarSesionScreen {...props} cerrarSesion={cerrarSesion} />;
return (
<Drawer.Navigator
  initialRouteName="AcercaDeLaEmpresa"
  screenOptions={{
    headerShown: true,
    drawerActiveBackgroundColor: '#B2EBF2',
    drawerActiveTintColor: '#8547b7ff',
    headerStyle: { backgroundColor: '#fcfdfeff' },
    headerTintColor: '#0e0e0eff',
  }}
>
  <Drawer.Screen
    name="AcercaDeLaEmpresa"
    component={AcercaDeLaEmpresa}
    options={{
      title: "Acerca de la Empresa",
      drawerIcon: ({ color }) => (
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={color}
        />
      ),
      drawerLabelStyle: { fontWeight: 'bold' },
      headerShown: true,
      headerTitleAlign: "left",
    }}
  />

    <Drawer.Screen
      name="ServiciosStack"
      component={StackDetailServicios}
      options={{
        title: "Servicios",
        drawerIcon: ({ color }) => (
          <FontAwesome name="wrench" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="CitasAdmin"
      component={CitasAdmin}
      options={{
        title: "Citas",
        drawerIcon: ({ color }) => (
          <FontAwesome name="calendar" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="CatalogoDrawer"
      component={ListaServicios}
      options={{
        title: "Catálogo",
        drawerIcon: ({ color }) => (
          <FontAwesome name="image" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="ClientesDrawer"
      component={Clientes}
      options={{
        title: "Clientes",
        drawerIcon: ({ color }) => (
          <FontAwesome name="users" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="EquiposDrawer"
      component={Equipos}
      options={{
        title: "Equipos",
        drawerIcon: ({ color }) => (
          <FontAwesome name="laptop" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="EmpleadosDrawer"
      component={Empleados}
      options={{
        title: "Empleados",
        drawerIcon: ({ color }) => (
          <FontAwesome name="users" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="UsuariosDrawer"
      component={Usuarios}
      options={{
        title: "Usuarios",
        drawerIcon: ({ color }) => (
          <FontAwesome name="user" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="EstadisticasDrawer"
      component={EstadisticasAdmin}
      options={{
        title: "Estadísticas",
        drawerIcon: ({ color }) => (
          <FontAwesome name="bar-chart" size={24} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="CerrarSesionDrawer"
      component={LogoutScreen}
      options={{
        title: "Cerrar Sesión",
        drawerIcon: ({ color }) => (
          <FontAwesome name="sign-out" size={24} color={color} />
        ),
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
    header: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 26
  },
});