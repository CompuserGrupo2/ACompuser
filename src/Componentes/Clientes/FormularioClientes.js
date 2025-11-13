import React, { useRef, useEffect } from "react";
import {View, TextInput, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Animated, KeyboardAvoidingView, Platform,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BlurView } from "expo-blur";

const FormularioClientes = ({
  nuevoCliente,
  manejoCambio,
  guardarCliente,
  actualizarCliente,
  modoEdicion,
  visible,
  setVisible,
}) => {
  const tiposValidos = ["Regular", "Nuevo", "Vip", "Premium"];

  // Animación
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
      onRequestClose={() => {
        setVisible(false);
      }}
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
              {modoEdicion ? "Actualizar Cliente" : "Registrar Cliente"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre (máx. 20 caracteres)"
              value={nuevoCliente.nombre}
              onChangeText={(valor) => manejoCambio("nombre", valor)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido (máx. 20 caracteres)"
              value={nuevoCliente.apellido}
              onChangeText={(valor) => manejoCambio("apellido", valor)}
            />
            <TextInput
              style={styles.input}
              placeholder="Cédula (máx. 16 caracteres)"
              value={nuevoCliente.cedula}
              onChangeText={(valor) => manejoCambio("cedula", valor)}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (8 dígitos numéricos)"
              keyboardType="phone-pad"
              value={nuevoCliente.telefono}
              onChangeText={(valor) => manejoCambio("telefono", valor)}
            />

            <Text style={styles.label}>Tipo de Cliente</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={nuevoCliente.tipo_cliente}
                onValueChange={(itemValue) =>
                  manejoCambio("tipo_cliente", itemValue)
                }
              >
                <Picker.Item label="Seleccione tipo" value="" />
                {tiposValidos.map((t) => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.boton}
              onPress={modoEdicion ? actualizarCliente : guardarCliente}
            >
              <Text style={styles.textoBoton}>
                {modoEdicion ? "Actualizar" : "Guardar"}
              </Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => {
                setVisible(false);
              }}
            >
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
    color: "#080808ff",
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
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: "#374151",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
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

export default FormularioClientes;