import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Database/firebaseconfig';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const manejarLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa ambos campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Notifica al componente principal que el login fue exitoso
    } catch (error) {
      console.log(error);
      let mensaje = "Error al iniciar sesión.";

      if (error.code === "auth/invalid-email") {
        mensaje = "Correo inválido.";
      } else if (error.code === "auth/user-not-found") {
        mensaje = "Usuario no encontrado.";
      } else if (error.code === "auth/wrong-password") {
        mensaje = "Contraseña incorrecta.";
      }

      Alert.alert("Error", mensaje);
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={require('../../Imagenes/LogoAC2.jpg')}
        style={styles.logo}
      />

      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={manejarLogin}
      >
        <Text style={styles.textoBoton}>Entrar</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffffff',
    alignItems: 'center', 
    marginBottom: 130
  },

  logo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10, 
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
    width: '100%', 
  },

  boton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', 
  },
  
  textoBoton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
