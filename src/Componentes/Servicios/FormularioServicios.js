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
  Image,
} from "react-native";
import { BlurView } from "expo-blur";

const FormularioServicios = ({
  nuevoServicio,
  manejoCambio,
  guardarServicio,
  actualizarServicio,
  modoEdicion,
  visible,
  setVisible,
}) => {
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
              {modoEdicion ? "Actualizar Servicio" : "Registro de Servicios"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Descripción del servicio (máx. 100 caracteres)"
              value={nuevoServicio.descripcion}
              onChangeText={(v) => manejoCambio("descripcion", v)}
            />

            <TextInput
              style={styles.input}
              placeholder="Costo del servicio (solo números, máx. 2 decimales)"
              value={nuevoServicio.costo}
              onChangeText={(v) => manejoCambio("costo", v)}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="URL de la imagen"
              value={nuevoServicio.foto}
              onChangeText={(v) => manejoCambio("foto", v)}
              autoCapitalize="none"
            />

            {nuevoServicio.foto ? (
              <Image
                source={{ uri: nuevoServicio.foto }}
                style={styles.preview}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.mensajePreview}>La imagen se mostrará aquí</Text>
            )}

            <TouchableOpacity
              style={styles.boton}
              onPress={modoEdicion ? actualizarServicio : guardarServicio}
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
    fontSize: 16,
  },
  preview: {
    width: 120,
    height: 120,
    alignSelf: "center",
    borderRadius: 12,
    marginVertical: 15,
    backgroundColor: "#f0f4f8",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mensajePreview: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 15,
    fontStyle: "italic",
    paddingVertical: 35,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
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
    fontSize: 16,
  },
});

export default FormularioServicios;