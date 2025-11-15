import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AcercaDeLaEmpresa = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.fullContainer}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../../Imagenes/LogoAC2.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>ACompuser</Text>
        <Text style={styles.text}>
          Somos una empresa dedicada a brindar soluciones integrales de soporte técnico y mantenimiento de equipos de cómputo, garantizando la continuidad operativa de su negocio.
        </Text>
        <Text style={styles.text}>
          ¡Esta es su pantalla de inicio como administrador! Use el menú lateral para navegar.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuButton: {
    position: 'absolute',
    left: 15,
    top: Platform.OS === 'android' ? 38 : 53,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    paddingTop: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
    lineHeight: 24,
  },
});

export default AcercaDeLaEmpresa;