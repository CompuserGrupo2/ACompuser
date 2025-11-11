import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// importa más gráficos según los vayas creando

const Estadisticas = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.titulo}>Dashboard de Estadísticas</Text>

      <View style={styles.graficoContainer}>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff'
  },
  contentContainer: {
    padding: 20
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  graficoContainer: {
    marginBottom: 30
  },
});

export default Estadisticas;
