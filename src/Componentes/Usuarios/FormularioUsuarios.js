import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const FormularioUsuarios = ({
  nuevoUsuario,
  manejoCambio,
  guardarUsuario,
  actualizarUsuario,
  modoEdicion,
  visible,
  setVisible,
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Animaciones
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <BlurView intensity={40} tint="dark" style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Animated.View
            style={[
              styles.panel,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.titulo}>
              {modoEdicion ? "Actualizar Usuario" : "Registro de Usuarios"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario (máx. 30 caracteres)"
              value={nuevoUsuario.usuario}
              onChangeText={(v) => manejoCambio("usuario", v)}
            />
            <View style={styles.passwordContainer}>
            <TextInput
              key={mostrarPassword}
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
              placeholder="Crea una contraseña (mínimo 6 caracteres)"
              value={nuevoUsuario.contraseña}
              onChangeText={(v) => manejoCambio("contraseña", v)}
              secureTextEntry={!mostrarPassword}
            />
            <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
                <Ionicons
                  name={mostrarPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#555"
                  style={{ marginRight: 8 }}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo electrónico"
              value={nuevoUsuario.correo}
              onChangeText={(v) => manejoCambio("correo", v.toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={nuevoUsuario.rol}
                onValueChange={(valor) => manejoCambio("rol", valor)}
              >
                <Picker.Item label="Seleccione un rol" value="" />
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Cliente" value="Cliente" />
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.boton}
              onPress={modoEdicion ? actualizarUsuario : guardarUsuario}
            >
              <Text style={styles.textoBoton}>{modoEdicion ? "Actualizar" : "Guardar"}</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  panel: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000ff",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingRight: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 15,
  },
  boton: {
    backgroundColor: "#369AD9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelar: {
    textAlign: "center",
    marginTop: 15,
    color: "#9CA3AF",
  },
});

export default FormularioUsuarios;
