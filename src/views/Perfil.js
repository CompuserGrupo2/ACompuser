import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, updatePassword, deleteUser,EmailAuthProvider,reauthenticateWithCredential } from "firebase/auth";
import { db } from "../Database/firebaseconfig";
import { doc, getDocs, collection, query, where, updateDoc, deleteDoc } from "firebase/firestore";

const Perfil = () => {
  const auth = getAuth();
  const usuarioActual = auth.currentUser;

  const [datos, setDatos] = useState(null);
  const [docId, setDocId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [animacionActualizar] = useState(new Animated.Value(300));
  const [animacionEliminar] = useState(new Animated.Value(300));
  const [cargando, setCargando] = useState(true);

  const [form, setForm] = useState({
    usuario: "",
    contraseñaActual: "",
    nuevaContraseña: "",
  });

  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarActual, setMostrarActual] = useState(false);

  const [contraseñaEliminar, setContraseñaEliminar] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  // Cargar datos del usuario desde Firestore
  const cargarDatos = async () => {
    if (!usuarioActual) return;

    try {
      const q = query(collection(db, "Usuarios"), where("correo", "==", usuarioActual.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        setDatos(data);
        setDocId(docSnap.id);
        setForm((f) => ({
          ...f,
          usuario: data.usuario || "",
        }));
      } else {
        console.log("No se encontró usuario en Firestore");
        setDatos(null);
      }
    } catch (e) {
      console.log("Error cargando perfil:", e);
      Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModal = () => {
    setModalVisible(true);
    Animated.timing(animacionActualizar, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const cerrarModal = () => {
    setForm((f) => ({ ...f, contraseñaActual: "", nuevaContraseña: "" })); // <<--- Limpiamos campos
    Animated.timing(animacionActualizar, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const abrirModalEliminar = () => {
    setModalEliminar(true);
    Animated.timing(animacionEliminar, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const cerrarModalEliminar = () => {
    setContraseñaEliminar("");
    setMostrarEliminar(false);
    Animated.timing(animacionEliminar, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setModalEliminar(false));
  };

  const actualizarDatos = async () => {
    if (!form.usuario.trim()) return Alert.alert("Error", "El nombre es obligatorio.");
    if (!form.nuevaContraseña.trim()) return Alert.alert("Error", "La nueva contraseña es obligatoria.");
    if (form.nuevaContraseña && form.nuevaContraseña.length < 6)
      return Alert.alert("Error", "La nueva contraseña debe tener mínimo 6 caracteres.");
    if (!docId) return Alert.alert("Error", "No se pudo obtener el ID del usuario.");

    try {
      await updateDoc(doc(db, "Usuarios", docId), {
        usuario: form.usuario,
        contraseña: form.nuevaContraseña.trim() !== "" ? form.nuevaContraseña : datos.contraseña,
      });

      if (form.nuevaContraseña.trim() !== "") {
        if (!form.contraseñaActual.trim()) {
          return Alert.alert("Error", "Debes ingresar tu contraseña actual para cambiarla.");
        }

        const credenciales = EmailAuthProvider.credential(
          usuarioActual.email,
          form.contraseñaActual
        );

        await reauthenticateWithCredential(usuarioActual, credenciales); // Reautenticación
        await updatePassword(usuarioActual, form.nuevaContraseña); // Cambio de contraseña en Auth
      }

      Alert.alert("Éxito", "Datos actualizados correctamente.");
      cerrarModal();
      cargarDatos();
    } catch (e) {
      console.log("Error actualizando:", e);
      if (e.code === "auth/wrong-password") {
        Alert.alert("Error", "La contraseña actual es incorrecta.");
      } else if (e.code === "auth/requires-recent-login") {
        Alert.alert("Error", "Debes volver a iniciar sesión para cambiar la contraseña.");
      } else {
        Alert.alert("Error", "No se pudieron actualizar los datos, verifique que la contraseña actual sea correcta.");
      }
    }
  };

  const confirmarEliminacion = async () => {
    if (!contraseñaEliminar.trim()) return Alert.alert("Error", "Ingresa tu contraseña actual.");

    try {
      const credenciales = EmailAuthProvider.credential(usuarioActual.email, contraseñaEliminar);
      await reauthenticateWithCredential(usuarioActual, credenciales);

      await deleteDoc(doc(db, "Usuarios", docId));
      await deleteUser(usuarioActual);

      Alert.alert("Cuenta eliminada", "Tu cuenta y todos tus datos han sido eliminados.");
      cerrarModalEliminar();
    } catch (e) {
      if (e.code === "auth/wrong-password") Alert.alert("Error", "La contraseña actual es incorrecta.");
      else if (e.code === "auth/requires-recent-login") Alert.alert("Error", "Debes volver a iniciar sesión para eliminar la cuenta.");
      else Alert.alert("Error", "No se pudo eliminar la cuenta.");
    }
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0057ff" />
      </View>
    );
  }

  if (!datos) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se encontraron datos del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* PERFIL */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{datos.usuario[0].toUpperCase()}</Text>
        </View>

        <Text style={styles.nombre}>{datos.usuario}</Text>
        <Text style={styles.correo}>{datos.correo}</Text>

        <View style={styles.rolContainer}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#369AD9" />
          <Text style={styles.rolTexto}>{datos.rol}</Text>
        </View>

        <TouchableOpacity style={styles.botonActualizar} onPress={abrirModal}>
          <Text style={styles.botonTexto}>Actualizar datos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonEliminar} onPress={abrirModalEliminar}>
          <Text style={styles.botonTextoEliminar}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL ACTUALIZAR  */}
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.overlay}>
          <Animated.View style={[styles.modal, { transform: [{ translateY: animacionActualizar  }] }]}>
            <Text style={styles.modalTitulo}>Actualizar datos</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={form.usuario}
              onChangeText={(v) => setForm({ ...form, usuario: v })}
            />

            {/* Contraseña actual para reautenticación */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingrese contraseña actual"
                secureTextEntry={!mostrarActual}
                value={form.contraseñaActual}
                onChangeText={(v) => setForm({ ...form, contraseñaActual: v })}
              />
              <TouchableOpacity onPress={() => setMostrarActual(!mostrarActual)}>
                <Ionicons
                  name={mostrarActual ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#555"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            {/* Nueva contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingrese nueva contraseña"
                secureTextEntry={!mostrarNueva}
                value={form.nuevaContraseña}
                onChangeText={(v) => setForm({ ...form, nuevaContraseña: v })}
              />
              <TouchableOpacity onPress={() => setMostrarNueva(!mostrarNueva)}>
                <Ionicons
                  name={mostrarNueva ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#555"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalBoton} onPress={actualizarDatos}>
              <Text style={styles.modalBotonTexto}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={cerrarModal}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal visible={modalEliminar} transparent animationType="none">
        <View style={styles.overlay}>
          <Animated.View style={[styles.modal, { transform: [{ translateY: animacionEliminar  }] }]}>
            <Text style={styles.modalTitulo}>Eliminar cuenta</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu contraseña actual"
                secureTextEntry={!mostrarEliminar}
                value={contraseñaEliminar}
                onChangeText={setContraseñaEliminar}
              />
              <TouchableOpacity onPress={() => setMostrarEliminar(!mostrarEliminar)}>
                <Ionicons name={mostrarEliminar ? "eye-off-outline" : "eye-outline"} size={24} color="#555" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.modalBoton, { backgroundColor: "#e53935" }]} onPress={confirmarEliminacion}>
              <Text style={styles.modalBotonTexto}>Eliminar cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={cerrarModalEliminar}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>

    
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#369AD9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarTexto: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  nombre: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  correo: { fontSize: 15, color: "#666", marginBottom: 10 },
  rolContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    padding: 6,
    backgroundColor: "#E8F4FD",
    borderRadius: 10,
  },
  rolTexto: { marginLeft: 5, color: "#369AD9", fontWeight: "bold" },
  botonActualizar: {
    backgroundColor: "#369AD9",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  botonTexto: { color: "white", fontWeight: "bold" },
  botonEliminar: {
    backgroundColor: "#e53935",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  botonTextoEliminar: {
    color: "white",
    fontWeight: "bold"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end"
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F8F9FA"
  },
  modalBoton: {
    backgroundColor: "#369AD9",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  modalBotonTexto: {
    color: "white",
    fontWeight: "bold"
  },
  cancelar: {
    textAlign: "center",
    marginTop: 15,
    color: "#666"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F8F9FA",
    marginBottom: 10
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10
  },
});
