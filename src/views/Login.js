import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Database/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const manejarLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa ambos campos.");
      return;
    }

    try {
      // Iniciar sesión con Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      // Normalizamos el correo a minúsculas
      const emailLower = email.trim().toLowerCase();

      // Buscar rol del usuario en Firestore
      const q = query(collection(db, "Usuarios"), where("correo", "==", emailLower));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const rol = userData.rol;

        // Notificar éxito junto con rol
        onLoginSuccess({ ...user, rol });
      } else {
        Alert.alert("Error", "No se encontró información del usuario en la base de datos.");
      }

    } catch (error) {
      console.log(error);
      let mensaje = "Error al iniciar sesión.";
      if (error.code === "auth/invalid-email") mensaje = "Correo inválido.";
      else if (error.code === "auth/user-not-found") mensaje = "Usuario no encontrado.";
      else if (error.code === "auth/wrong-password") mensaje = "Contraseña incorrecta.";
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
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!mostrarPassword}
      />
      <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Ionicons
            name={mostrarPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#555"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.boton} onPress={manejarLogin}>
        <Text style={styles.textoBoton}>Entrar</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 25, 
    alignItems: 'center', 
    backgroundColor: '#fff',
    marginBottom: 130
  },

  logo: { 
    width: 250, 
    height: 150, 
    resizeMode: 'contain', 
    marginBottom: 10 
  },

  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E3A8A',
    marginBottom: 15
  },

  input: { 
    borderWidth: 1, 
    borderColor: "#D1D5DB", 
    backgroundColor: '#FFFFFF',
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 15, 
    width: '100%',
    fontSize: 16
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    width: '100%',
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  boton: { 
    backgroundColor: '#2563EB', 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  textoBoton: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});

export default Login;
