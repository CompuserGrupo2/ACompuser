import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from "firebase/auth";

const Logout = () => {

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Logout

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
    height: 96,
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
})