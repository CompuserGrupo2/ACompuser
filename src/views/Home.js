import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get('window');

const Home = () => {
  
  const [usuarioNombre, setUsuarioNombre] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const usuario = auth.currentUser;
    if (usuario) {
      // Si Firebase tiene displayName lo usamos, sino mostramos el correo
      setUsuarioNombre(usuario.displayName || usuario.email);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}> 

      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.header}>
        <Image
          source={require('../../Imagenes/Mouse_Compuser.png')}
          style={styles.headerLogo}
        />
        <Text style={styles.headerTitle}>Compuser</Text>
      </LinearGradient>

      <Text style={styles.bienvenida}>
        ¡Bienvenido, {usuarioNombre || "Usuario"}! 👋
      </Text>

      <Animatable.View animation="fadeInDown" duration={1000} style={styles.carouselContainer}>
        <Swiper
          autoplay
          autoplayTimeout={8}
          showsButtons
          dotColor="#ccc"
          activeDotColor="#007bff"
          style={styles.wrapper}
        >
          <Image source={require('../../Imagenes/CPU.jpg')} style={styles.carouselImage} />
          <Image source={require('../../Imagenes/Impresora.jpg')} style={styles.carouselImage} />
          <Image source={require('../../Imagenes/Laptop.jpg')} style={styles.carouselImage} />
        </Swiper>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={30} color="#d9dd02ff" />
        <Text style={styles.subtitle}>Nuestra Misión</Text>
        <Text style={styles.text}>
          Brindar soluciones tecnológicas confiables y accesibles en hardware, software y soporte,
          ofreciendo un servicio de calidad que facilite la vida digital de nuestros clientes y potencie su productividad.
        </Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
        <MaterialCommunityIcons name="rocket-outline" size={30} color="#00aaff" />
        <Text style={styles.subtitle}>Nuestra Visión</Text>
        <Text style={styles.text}>
          Ser la empresa líder en soluciones de cómputo y tecnología, reconocida por la innovación,
          el servicio al cliente y la confianza, impulsando la transformación digital.
        </Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
        <MaterialCommunityIcons name="target" size={30} color="#ff0000ff" />
        <Text style={styles.subtitle}>Objetivo</Text>
        <Text style={styles.text}>
          Garantizar el acceso a servicios tecnológicos, optimizando el rendimiento de los equipos
          de nuestros clientes y asegurando una experiencia digital segura, eficiente y sostenible.
        </Text>
      </Animatable.View>

      <LinearGradient colors={['#0057ff', '#00c6ff']} style={styles.footer}>
        <Text style={styles.footerText}>Síguenos en nuestras redes</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/50557994806')}>
            <MaterialCommunityIcons name="whatsapp" size={38} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('mailto:compusergrupo@gmail.com')}>
            <MaterialCommunityIcons name="gmail" size={38} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/share/1DMrA1Da4X/')}>
            <MaterialCommunityIcons name="facebook" size={38} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/_thyiris?igsh=MWJvbXk4ZWV4aHhvMQ==')}>
            <MaterialCommunityIcons name="instagram" size={38} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://www.tiktok.com/@ldavidor7?_r=1&_t=ZS-91HEYZnwb4R')}>
            <FontAwesome5 name="tiktok" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.footerCopy}>© 2025 Compuser — Todos los derechos reservados.</Text>
      </LinearGradient>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    
  },
  headerLogo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 6
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8
  },
  carouselContainer: {
    width: '100%',
    height: 200,
    marginBottom: 25,
  },
  carouselImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    marginTop: 5,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    textAlign: 'justify',
  },
  footer: {
    marginTop: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  footerCopy: {
    color: '#fff',
    fontSize: 12,
    marginTop: 20,
    opacity: 0.8,
  },
  bienvenida: {
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
  marginVertical: 15,
  color: "#369AD9",
},
});
