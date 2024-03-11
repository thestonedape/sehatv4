import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { app } from '../firebaseConfig';
import { useUser } from "@clerk/clerk-expo";

import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  const navigation = useNavigation();
  const [minRating, setMinRating] = useState(4);
  const [nearbyDoctors, setnearbyDoctors] = useState([]);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const initialDoctorCount = 2;
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Waiting for current location...');
  const [loaded] = useFonts({
    'Urbanist-Bold': require('../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-ExtraBold': require('../assets/fonts/Urbanist-ExtraBold.ttf'),
    'Urbanist-Medium': require('../assets/fonts/Urbanist-Medium.ttf'),
    'Exo2-Bold': require('../assets/fonts/Exo2-Bold.ttf'),
    'Exo2-ExtraBold': require('../assets/fonts/Exo2-ExtraBold.ttf'),
  });

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setDisplayCurrentAddress('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
    for (let item of addressResponse) {
      let currentAddress = `${item.name}\n${item.city}`;
      setDisplayCurrentAddress(currentAddress);
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  const { user } = useUser();
  const db = getFirestore(app);
  useEffect(() => {
    const getDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Doctors'));
        const doctorsData = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((doctor) => doctor.rating >= minRating);

        setnearbyDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
      }
    };

    getDoctors();
  }, [db, minRating]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.headerText}>Sehat</Text>
        <View style={styles.userIcon}>
          <TouchableOpacity><FontAwesome5 name="search" size={20} color="#eee" style={{ marginRight: 15 }} /></TouchableOpacity>
          <TouchableOpacity><FontAwesome5 name="bell" size={20} color="#eee" solid /></TouchableOpacity>
        </View>
      </View>

      <FlatList
        backgroundColor="#eee"
        data={['header', 'featuredServices', 'nearbyDoctors', 'footer']}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          switch (item) {
            case 'header':
              return (
                <View>
                  <View style={styles.headerContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                      <Text style={styles.headerText}>Hi,
                        <Text style={styles.headerName}>{user.firstName}</Text>
                      </Text>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginRight: 10,
                          justifyContent: "center",
                          alignContent: "center",
                        }}>
                        <FontAwesome5 name="location-arrow" solid size={18} color="#eee" />
                        <Text style={{
                          fontSize: 15,
                          color: "#eee",
                          fontFamily: 'Urbanist-Medium',
                          marginLeft: 10,
                        }}>
                          {displayCurrentAddress}
                        </Text>
                      </TouchableOpacity>

                    </View>
                    <View style={{ marginTop: 40, }}><Text style={{ fontSize: 14, color: "#eee", fontFamily: 'Urbanist-Bold', }}>Upcoming Schedule</Text></View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    style={{
                      zIndex: 2,
                      position: 'relative',
                      top: -50,
                    }}>
                    <TouchableOpacity style={styles.featuredServiceContainer}>
                      <View style={styles.featuredServiceContent}>
                        <View style={styles.featuredServiceImage}>
                          <Image source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }} style={{ height: 35, width: 35, borderRadius: 25, }} />
                        </View>
                        <View style={{ marginLeft: 5, }}>
                          <Text style={{ fontSize: 14, fontFamily: 'Urbanist-Bold', color: '#000' }}>Dr. Uday Shetty</Text>
                          <Text style={{ fontSize: 11, color: '#666', }}>Dentist</Text>
                          <View style={styles.scheduleInfo}>
                            <Text style={styles.scheduleText}>Tue, 16 Oct'23</Text>
                            <Text style={styles.scheduleText}>10:00 am</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              );
            case 'featuredServices':
              return (
                <View style={{ paddingHorizontal: 10, marginTop: -30 }}>
                  <Text style={{ fontSize: 20, color: '#555', fontFamily: 'Urbanist-Bold' }}>Featured Services</Text>
                  <Image source={require('../assets/icons/Group.png')} style={{ height: 200, width: '100%', resizeMode: 'center' }} />
                </View>
              );
            case 'nearbyDoctors':
              return (
                <View style={{ paddingHorizontal: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={{ fontSize: 20, color: '#555', fontFamily: 'Urbanist-Bold', }}>
                      Nearby Doctors
                    </Text>
                    {
                      nearbyDoctors.length > initialDoctorCount && (
                        <TouchableOpacity
                          onPress={() => setShowAllDoctors(!showAllDoctors)}>
                          <Text style={{ fontSize: 14, color: '#5dbe74', fontFamily: 'Urbanist-Medium' }}>
                            {showAllDoctors ? 'Show less' : 'Show all'}
                          </Text>
                        </TouchableOpacity>)}
                  </View>
                  <FlatList
                    data={showAllDoctors ? nearbyDoctors : nearbyDoctors.slice(0, initialDoctorCount)}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.doctorCard}
                        onPress={() => navigation.navigate('Docprofile', { doctor: item })}>
                        <View style={styles.doctorImageContainer}>
                          <Image source={{ uri: item.profile }} style={styles.doctorImage} />
                        </View>
                        <View style={styles.doctorInfo}>
                          <Text style={styles.doctorName}>{item.name}</Text>
                          <Text style={styles.doctorSpeciality}>{item.speciality}, {item.location}</Text>
                          <View style={styles.doctorRating}>
                            <FontAwesome5 name="star" size={12} color="#5dbe74" solid />
                            <Text style={styles.ratingText}>{item.rating}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              );
            case 'footer':
              return (
                <View style={{ backgroundColor: '#eee', padding: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginLeft: 10, marginVertical: 70, }}>
                  <Text style={{ fontSize: 60, fontFamily: 'Exo2-Bold', color: '#aaa' }}> Inside{'\n'}Labs
                  </Text>

                  <Text style={{ fontSize: 16, marginTop: 10, fontFamily: 'Urbanist-Medium', color: '#666', }}>Engineered with ❤️ at Inside Labs</Text>
                </View>
              );
            default:
              return null;
          }
        }} />
      <StatusBar style="dark" backgroundColor='#5dbe74' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5dbe74',
  },
  headerContainer: {
    backgroundColor: '#5dbe74',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 160,
  },
  headerText: {
    fontSize: 20,
    color: "#eee",
    fontFamily: 'Urbanist-Bold',
  },
  headerName: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 22,
    color: "#fff",
  },
  userIcon: {
    height: 40,
    width: 'auto',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 10,
  },
  featuredServiceContainer: {
    backgroundColor: '#fff',
    height: 'auto',
    width: 220,
    borderRadius: 15,
    marginRight: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    justifyContent: 'center',
    elevation: 3,
    marginLeft: 20,
  },
  featuredServiceContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  featuredServiceImage: {
    width: 'auto',
    padding: 5,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
    width: 'auto',
  },
  scheduleText: {
    fontSize: 13,
    fontFamily: 'Urbanist-Bold',
    color: '#222',
  },
  doctorCard: {
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 5,
    elevation: 3,

  },
  doctorImageContainer: {
    backgroundColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center',

  },
  doctorImage: {
    height: 60,
    width: 68,
    borderRadius: 15,
    margin: 5,
  },
  doctorInfo: {
    marginLeft: 10,
    width: 'auto',
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 15,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
  },
  doctorSpeciality: {
    fontSize: 12,
    color: '#444',
    fontFamily: 'Urbanist-Medium',
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,

  },
  ratingText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
    fontFamily: 'Urbanist-Medium',
  },
});

export default Home;
