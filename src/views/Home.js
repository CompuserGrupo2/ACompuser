import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Linking, TouchableOpacity } from 'react-native';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
    <Image source={require('../../Imagenes/LogoAC2.jpg')} style={styles.logo} />

      {/* Misión */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Nuestra Misión</Text>
        <Text style={styles.text}>
          Brindar soluciones tecnológicas confiables y accesibles en hardware, software y soporte,
          ofreciendo un servicio de calidad que facilite la vida digital de nuestros clientes y potencie su productividad.
        </Text>
      </View>

      {/* Visión */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Nuestra Visión</Text>
        <Text style={styles.text}>
            Ser la empresa líder en soluciones de cómputo y tecnología, reconocida por la innovación, 
            el servicio al cliente y la confianza, impulsando la transformación digital.
        </Text>
      </View>

      {/* Objetivo */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Objetivo</Text>
        <Text style={styles.text}>
          Garantizar el acceso a servicios tecnológicos, optimizando el rendimiento de los equipos 
          de nuestros clientes y asegurando una experiencia digital segura, eficiente y sostenible.
        </Text>
      </View>

        {/* Contacto */}
        <View style={styles.info}>
          <Text style={styles.subtitle}>Contáctenos</Text>
          <View style={styles.contactRow}>

            {/* WhatsApp */}
            <TouchableOpacity
              style={styles.contactColumn}
              onPress={() => Linking.openURL('https://wa.me/50557994806')}
            >
              <AntDesign name="phone" size={30} color="black" />
              <Text style={styles.contactValue}>+505 5799 4806</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactColumn}
              onPress={() => Linking.openURL('mailto:compusergrupo@gmail.com')}
            >
              <MaterialCommunityIcons name="gmail" size={30} color="black" />
              <Text style={styles.contactValue}>compusergrupo@gmail.com</Text>
            </TouchableOpacity>

          </View>
        </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },

  logo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 2,
    marginTop: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 25,
  },

  section: {
    marginBottom: 25,
    width: '100%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#fff'
  },
  info: {
    marginBottom: 25,
    alignItems: 'center',
    marginTop: 35,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    textAlign: 'justify',
  },

  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  
  contactColumn: {
    flex: 1,
    alignItems: 'center',
  },
  contactValue: {
    fontSize: 15,
    color: '#3a85ffe1',
    textAlign: 'center',
  },
});
