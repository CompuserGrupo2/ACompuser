import React, { useState, useEffect } from "react";
import {View, Text, ActivityIndicator, Image, Modal, StyleSheet, TouchableOpacity} from "react-native";

import { NavigationContainer, getFocusedRouteNameFromRoute, } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../Database/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";

import Login from "../views/Login";
import Usuarios from "../views/Usuarios";
import Clientes from "../views/Clientes";
import Empleados from "../views/Empleados";
import Equipos from "../views/Equipos";
import Servicios from "../views/Servicios";
import ListaServicios from "./Servicios/ListaServicios";
import Home from "../views/Home";
import Citas from "../views/Citas";
import Estadisticas from "../views/Estadisticas";
import Perfil from "../views/Perfil";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();
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

function CerrarSesionModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cerrar sesión</Text>
          <Text style={styles.modalMessage}>¿Estás seguro que deseas cerrar sesión?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function MyTabsCliente({ cerrarSesion, userId }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCerrarSesion = () => setModalVisible(true);
  const handleConfirm = async () => {
    await cerrarSesion();
    setModalVisible(false);
  };
  const handleCancel = () => setModalVisible(false);
  return (
    <>
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
            tabBarLabel: "Compuser",
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
          name="Perfil"
          component={Perfil}
          options={{
            title: "Perfil",
            tabBarLabel: "Perfil",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
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
          name="CerrarSesionTab"
          component={PantallaVacia}
          options={{
            tabBarLabel: "Cerrar Sesión",
            tabBarIcon: ({ color }) => <FontAwesome name="sign-out" size={24} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleCerrarSesion();
            },
          }}
        />
      </Tab.Navigator>

      {/* Modal */}
      <CerrarSesionModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function MyTabsInvitado({ onLoginRedirect }) {
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalLoginVisible, setModalLoginVisible] = useState(false);
  const [targetTab, setTargetTab] = useState(""); // Para saber si Perfil o Citas

  // Modal para Perfil o Citas
  const handleRestrictedTab = (tabName) => {
    setTargetTab(tabName);
    setModalInfoVisible(true);
  };

  // Modal para Iniciar sesión
  const handleLoginTab = () => {
    setModalLoginVisible(true);
  };

  return (
    <>
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
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Catálogo"
          options={{
            title: "Catálogo",
            tabBarLabel: "Catálogo",
            tabBarIcon: ({ color }) => <FontAwesome name="image" size={24} color={color} />,
          }}
        >
          {() => <ListaServicios modoInvitado={true} />}
        </Tab.Screen>
        <Tab.Screen
          name="Perfil"
          component={PantallaVacia}
          options={{
            title: "Perfil",
            tabBarLabel: "Perfil",
            tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleRestrictedTab("Perfil");
            },
          }}
        />
        <Tab.Screen
          name="Citas"
          component={PantallaVacia}
          options={{
            title: "Citas",
            tabBarLabel: "Citas",
            tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleRestrictedTab("Citas");
            },
          }}
        />
        <Tab.Screen
          name="IniciarSesion"
          component={PantallaVacia}
          options={{
            title: "Iniciar sesión",
            tabBarLabel: "Iniciar sesión",
            tabBarIcon: ({ color }) => <FontAwesome name="sign-in" size={24} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleLoginTab();
            },
          }}
        />
      </Tab.Navigator>

      {/* Modal Perfil y Citas */}
      <Modal transparent visible={modalInfoVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Acceso restringido</Text>
            <Text style={styles.modalMessage}>
              Para acceder a {targetTab}, necesitas registrarte o iniciar sesión.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalInfoVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  setModalInfoVisible(false);
                  onLoginRedirect();
                }}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Iniciar sesión */}
      <Modal transparent visible={modalLoginVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Iniciar sesión</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que quieres iniciar sesión?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalLoginVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  setModalLoginVisible(false);
                  onLoginRedirect();
                }}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
        name="Perfil"
        component={Perfil}
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
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

function MyTabsAdmin2() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ServiciosAdmin"
        component={Servicios}
        options={{
          tabBarLabel: "Servicios",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="wrench" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ClientesAdmin"
        component={Clientes}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EquiposAdmin"
        component={Equipos}
        options={{
          tabBarLabel: "Equipos",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="laptop" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EmpleadosAdmin"
        component={Empleados}
        options={{
          tabBarLabel: "Empleados",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="id-badge" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="UsuariosAdmin"
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


function MyDrawerAdmin({ cerrarSesion, userId }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCerrarSesion = () => setModalVisible(true);
  const handleConfirm = async () => {
    await cerrarSesion();
    setModalVisible(false);
  };
  const handleCancel = () => setModalVisible(false);

  return (
    <>
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
              InicioAdmin: "Compuser",
              Catálogo: "Catálogo",
              Perfil: "Perfil",
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
          name="PanelAdmin"
          options={({ route }) => {
            const tabName = getFocusedRouteNameFromRoute(route) ?? "ServiciosAdmin";

            const titles = {
              ServiciosAdmin: "Servicios",
              ClientesAdmin: "Clientes",
              EquiposAdmin: "Equipos",
              EmpleadosAdmin: "Empleados",
              UsuariosAdmin: "Usuarios",
            };

            const titulo = titles[tabName] || "Zona Administrativa";

            return {
              drawerLabel: "Zona Administrativa",
              drawerIcon: ({ color }) => (
                <Ionicons name="settings-outline" size={24} color={color} />
              ),
              headerTitle: () => <HeaderTitle title={titulo} />,
            };
          }}
        >
          {() => <MyTabsAdmin2 />}
        </Drawer.Screen>
        <Drawer.Screen
          name="CerrarSesionDrawer"
          component={PantallaVacia} // Pantalla vacía, no se navega a ninguna pantalla
          options={{
            title: "Cerrar Sesión",
            drawerIcon: ({ color }) => (
              <FontAwesome name="sign-out" size={24} color={color} />
            ),
          }}
          listeners={{
            drawerItemPress: (e) => {
              e.preventDefault(); // Evita navegar
              handleCerrarSesion(); // Muestra modal
            },
          }}
        />
      </Drawer.Navigator>

      {/* Modal de cierre de sesión */}
      <CerrarSesionModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function PantallaVacia() {
  return null;
}

export default function Navegacion() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Al iniciar la app, cerramos sesión automáticamente para que siempre inicie en Login
    const resetAuth = async () => {
      try {
        await signOut(auth); // esto asegura que no quede usuario logueado de sesiones previas
      } catch (error) {
        console.log("No hay usuario logueado al iniciar");
      }
      setCargando(false); // ya podemos mostrar Login
    };
    resetAuth();
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
      {!usuario ? (
        // Login inicial
        <Login
          onLoginSuccess={(userConRol) => setUsuario(userConRol)} // Cliente o Admin
          onLoginInvitado={() => setUsuario({ rol: "Invitado" })} // Acceder como invitado
        />
      ) : usuario.rol === "Cliente" ? (
        <MyTabsCliente cerrarSesion={() => setUsuario(null)} userId={usuario.uid} />
      ) : usuario.rol === "Admin" ? (
        <MyDrawerAdmin cerrarSesion={() => setUsuario(null)} userId={usuario.uid} />
      ) : usuario.rol === "Invitado" ? (
        <MyTabsInvitado onLoginRedirect={() => setUsuario(null)} />
      ) : null}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff0000",
  },
  confirmButton: {
    backgroundColor: "#0057ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});