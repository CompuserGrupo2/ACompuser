import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Database/firebaseconfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // ESTADOS PARA REGISTRO
  const [modalRegistro, setModalRegistro] = useState(false);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [mostrarPasswordRegistro, setMostrarPasswordRegistro] = useState(false);

  // VALIDACIÓN DE NOMBRE DE USUARIO (solo letras, máximo 20 caracteres)
  const validarNombreUsuario = (texto) => {
    if (!texto) return false;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(texto)) {
      Alert.alert("Error", "El nombre solo puede contener letras y espacios.");
      return false;
    }
    if (texto.length > 20) {
      Alert.alert("Error", "El nombre no puede exceder los 20 caracteres.");
      return false;
    }
    return true;
  };

  // VALIDACIÓN DE CORREO (formato válido)
  const validarCorreo = (correo) => {
    if (!correo) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correo)) {
      Alert.alert("Error", "Por favor ingresa un correo válido (ej: usuario@gmail.com).");
      return false;
    }
    return true;
  };

  // VALIDACIÓN DE CONTRASEÑA (mínimo 6 caracteres)
  const validarContraseña = (pass) => {
    if (!pass) return false;
    if (pass.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  // REGISTRAR NUEVO USUARIO CON TODAS LAS VALIDACIONES
  const registrarNuevoUsuario = async () => {
    // Validar campos vacíos
    if (!nuevoUsuario.trim() || !nuevoCorreo.trim() || !nuevoPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    // Validar nombre
    if (!validarNombreUsuario(nuevoUsuario.trim())) return;

    // Validar correo
    if (!validarCorreo(nuevoCorreo.trim())) return;

    // Validar contraseña
    if (!validarContraseña(nuevoPassword)) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, nuevoCorreo.trim(), nuevoPassword);
      const user = userCredential.user;

      // GUARDAR EN FIRESTORE
      await addDoc(collection(db, "Usuarios"), {
        correo: nuevoCorreo.toLowerCase().trim(),
        contraseña: nuevoPassword,
        usuario: nuevoUsuario.trim(),
        rol: "Cliente",
        permisos: ["Usuario"],
        uid: user.uid
      });

      Alert.alert("Éxito", "Usuario registrado correctamente.");

      // CERRAR MODAL Y LIMPIAR
      setModalRegistro(false);
      setNuevoCorreo("");
      setNuevoPassword("");
      setNuevoUsuario("");

      // INICIAR SESIÓN AUTOMÁTICO COMO CLIENTE
      onLoginSuccess({ ...user, rol: "Cliente" });

    } catch (error) {
      console.log(error);
      let msg = "Error al registrar usuario.";

      if (error.code === "auth/email-already-in-use") msg = "Este correo ya está registrado.";
      if (error.code === "auth/invalid-email") msg = "Correo inválido.";
      if (error.code === "auth/weak-password") msg = "La contraseña es muy débil.";

      Alert.alert("Error", msg);
    }
  };

  // LOGIN NORMAL (CORREGIDO: manejarLogin sin acento)
  const manejarLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Por favor completa ambos campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = auth.currentUser;
      const emailLower = email.trim().toLowerCase();

      const q = query(collection(db, "Usuarios"), where("correo", "==", emailLower));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const rol = userData.rol;

        // ENVÍA EL ROL AL NAVEGADOR
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

      {/* BOTÓN ENTRAR - CORREGIDO */}
      <TouchableOpacity style={styles.botonEntrar} onPress={manejarLogin}>
        <Text style={styles.textoBoton}>Entrar</Text>
      </TouchableOpacity>

      {/* BOTÓN CREAR CUENTA */}
      <TouchableOpacity 
        style={styles.botonCrearCuenta}
        onPress={() => setModalRegistro(true)}
      >
        <Text style={styles.textoBoton}>Crear Cuenta</Text>
      </TouchableOpacity>

      {/* MODAL DE REGISTRO */}
      <Modal visible={modalRegistro} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Registrar Nuevo Usuario</Text>

            {/* NOMBRE - MÁXIMO 20 CARACTERES */}
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={nuevoUsuario}
              onChangeText={setNuevoUsuario}
              autoCapitalize="words"
              maxLength={20}
            />

            {/* CORREO */}
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={nuevoCorreo}
              onChangeText={setNuevoCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* CONTRASEÑA CON MOSTRAR/OCULTAR */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                value={nuevoPassword}
                onChangeText={setNuevoPassword}
                secureTextEntry={!mostrarPasswordRegistro}
              />
              <TouchableOpacity onPress={() => setMostrarPasswordRegistro(!mostrarPasswordRegistro)}>
                <Ionicons
                  name={mostrarPasswordRegistro ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#555"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            {/* BOTÓN REGISTRAR */}
            <TouchableOpacity style={styles.botonRegistrar} onPress={registrarNuevoUsuario}>
              <Text style={styles.textoBoton}>Registrar</Text>
            </TouchableOpacity>

            {/* BOTÓN CANCELAR */}
            <TouchableOpacity
              style={styles.botonCancelar}
              onPress={() => setModalRegistro(false)}
            >
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: '#2d50afff',
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

  // BOTÓN ENTRAR (AZUL OSCURO)
  botonEntrar: { 
    backgroundColor: '#436ecaff', 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
  },

  // BOTÓN CREAR CUENTA (VERDE)
  botonCrearCuenta: { 
    backgroundColor: '#10B981', 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
  },

  // BOTÓN REGISTRAR EN MODAL (AZUL CLARO)
  botonRegistrar: { 
    backgroundColor: '#369AD9',
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
  },

  // BOTÓN CANCELAR (ROJO)
  botonCancelar: { 
    backgroundColor: '#e56f6fff', 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: 'center', 
    width: '100%',
    marginTop: 10,
  },

  textoBoton: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },

  modalContenido: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 12
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  }
});

export default Login;