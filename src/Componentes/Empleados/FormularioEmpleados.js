import React, { useRef, useEffect } from "react";
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

const FormularioEmpleados = ({
  nuevoEmpleado,
  manejoCambio,
  guardarEmpleado,
  actualizarEmpleado,
  modoEdicion,
  visible,
  setVisible,
}) => {
  // Animaciones de aparición
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
              {modoEdicion ? "Actualizar Empleado" : "Registro de Empleados"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre (máx. 20 caracteres)"
              value={nuevoEmpleado.nombre}
              onChangeText={(v) => manejoCambio("nombre", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido (máx. 20 caracteres)"
              value={nuevoEmpleado.apellido}
              onChangeText={(v) => manejoCambio("apellido", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Cédula (máx. 16 caracteres)"
              value={nuevoEmpleado.cedula}
              onChangeText={(v) => manejoCambio("cedula", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (8 dígitos numéricos)"
              value={nuevoEmpleado.telefono}
              onChangeText={(v) => manejoCambio("telefono", v)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Dirección (máx. 120 caracteres)"
              value={nuevoEmpleado.direccion}
              onChangeText={(v) => manejoCambio("direccion", v)}
            />

            <TouchableOpacity
              style={styles.boton}
              onPress={modoEdicion ? actualizarEmpleado : guardarEmpleado}
            >
              <Text style={styles.textoBoton}>
                {modoEdicion ? "Actualizar" : "Guardar"}
              </Text>
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

export default FormularioEmpleados;
