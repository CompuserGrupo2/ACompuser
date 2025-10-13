import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../Database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const SelectorClientes = ({ onClienteSeleccionado }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);

  useEffect(() => {
    const cargarClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(datos);
    };
    cargarClientes();
  }, []);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={clienteActual}
        onValueChange={(itemValue) => {
          setClienteActual(itemValue);
          onClienteSeleccionado(itemValue);
        }}
      >
        <Picker.Item label="Selecciona un cliente" value={null} />
        {clientes.map(cliente => (
          <Picker.Item key={cliente.id} label={cliente.nombre} value={cliente} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 }
});

export default SelectorClientes;
