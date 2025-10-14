import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import Clientes from "../views/Clientes";
import Empleados from "../views/Empleados";
import Equipos from "../views/Equipos";
import Servicios from "../views/Servicios";
import ListaServicios from "./Servicios/ListaServicios";
import Home from "../views/Home";
import FormularioCalificacion from "./Servicios/FormularioCalificacion";

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const DetailsServiciosNavigator = createStackNavigator();

function StackDetailServicios(){
  return(
    <DetailsServiciosNavigator.Navigator
      initialRouteName="Servicios"
    >
      <DetailsServiciosNavigator.Screen
        name="Servicios"
        component={Servicios}
      />
      <DetailsServiciosNavigator.Screen
        name="Catalogo"
        component={ListaServicios}
      />
      <DetailsServiciosNavigator.Screen
        name="calificaciones"
        component={FormularioCalificacion}
      />
    </DetailsServiciosNavigator.Navigator>
  )
}

function MyTabs(){
  return(
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'purple',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({color, size})=> (
            <AntDesign name="home" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Servicios"
        component={Servicios}
        options={{
          tabBarLabel: 'Servicios',
          tabBarIcon: ({color, size})=> (
            <FontAwesome name="wrench" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Catalogo"
        component={ListaServicios}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({color, size})=> (
            <FontAwesome name="image" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="calificaciones"
        component={FormularioCalificacion}
        options={{
          tabBarLabel: 'Calificaciones',
          tabBarIcon: ({color, size})=> (
            <FontAwesome name="star" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({color, size})=> (
            <FontAwesome name="users" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Equipos"
        component={Equipos}
        options={{
          tabBarLabel: 'Equipos',
          tabBarIcon: ({color, size})=> (
            <FontAwesome name="laptop" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Empleados"
        component={Empleados}
        options={{
          tabBarLabel: 'Empleados',
          tabBarIcon: ({color, size})=> (
            <FontAwesome name="users" size={24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  )
};

export default function Navegacion(){
  return(
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  )
}