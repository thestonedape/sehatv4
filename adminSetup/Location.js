import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Image, ToastAndroid, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@clerk/clerk-expo';
import { getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import * as Location from 'expo-location';

const Locatio = () => {
    const navigation = useNavigation();
    const [verifying, setVerifying] = useState(false);
    const [name, setName] = useState('Loading...');
    const [city, setCity] = useState('Loading...');
    const [region, setRegion] = useState('Loading...');
    const [postalCode, setPostalCode] = useState('Loading...');
    const [country, setCountry] = useState('Loading...');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState(null);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log(latitude, longitude);
        setLatitude(latitude);
        setLongitude(longitude);
        
        const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
        for (let item of addressResponse) {
            setName(item.name);
            setCity(item.city);
            setRegion(item.region);
            setPostalCode(item.postalCode);
            setCountry(item.country);
            setAddress(item.district);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const { isLoaded, userId } = useAuth();
    if (!isLoaded || !userId) {
        return null;
    }

    const db = getFirestore(app);
    const userRef = doc(db, 'Doctors', userId);

    const updateCoordinatesInFirebase = async (latitude, longitude, address) => {
        const docSnapshot = await getDoc(userRef);
        
        if (docSnapshot.exists()) {
            await updateDoc(userRef, {
                latitude: latitude,
                longitude: longitude,
                address: address
            });
        } else {
            await setDoc(userRef, {
                latitude: latitude,
                longitude: longitude,
                address: address
            });
        }
    };
    

    const handleNext = async () => {
        if (
            country === 'Loading...'
        ) {
            ToastAndroid.show('Location not yet verified', ToastAndroid.SHORT);
            return;
        }

        setVerifying(true);
        await updateCoordinatesInFirebase(latitude, longitude, address);
        ToastAndroid.show('Location updated successfully', ToastAndroid.SHORT);
        setVerifying(false);
        navigation.navigate('Specialization');
    };

    const [loaded] = useFonts({
        'Urbanist-Bold': require('../assets/fonts/Urbanist-Bold.ttf'),
        'Urbanist-ExtraBold': require('../assets/fonts/Urbanist-ExtraBold.ttf'),
        'Urbanist-Medium': require('../assets/fonts/Urbanist-Medium.ttf'),
        'Exo2-Bold': require('../assets/fonts/Exo2-Bold.ttf'),
        'Exo2-ExtraBold': require('../assets/fonts/Exo2-ExtraBold.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, marginTop: 40, alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20, marginHorizontal: 30, }}>
                    <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, color: '#4c5b6c', marginBottom: 20 }}>Location</Text>
                    <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#717b7f', textAlign: 'center', marginBottom: 20 }}>Getting your Location...</Text>       
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 50 }}>

                {
                    name && city && region && postalCode && country ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                            <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#717b7f', textAlign: 'center', marginBottom: 20 }}>
                                {name}, {city}, {region}, {postalCode}, {country}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                            <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#717b7f', textAlign: 'center', marginBottom: 20 }}>
                                Loading...
                            </Text>
                        </View>
                    )
                }

                </View>


                <View style={{ position: 'absolute', bottom: 40, width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                    <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 12, marginHorizontal: 30, color: '#717b7f' }}>
                        please use your official or work location
                    </Text>

                    <TouchableOpacity
                        style={{ width: '80%', marginTop: 20, height: 50, backgroundColor: '#4c5b6c', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleNext}>
                        <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusBar style="dark" backgroundColor='transparent' />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Locatio;
