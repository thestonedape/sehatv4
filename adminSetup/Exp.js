import React, { useState } from 'react';
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



const Exp = () => {
    const navigation = useNavigation();
    const [experience, setExperience] = useState('');
    const [verifying, setVerifying] = useState(false);
    
    const colors = {
        Swirl: '#d0cdc9',
        NaturalGray: '#918981',
        StarDust: '#9fa4a3',
        RollingStone: '#717b7f',
        Nevada: '#667579',
        BlackCoral: '#4c5b6c',
        Tuatara: '#3a3a3a',
        CodGray: '#080808',
    };

    const { isLoaded, userId, sessionId, getToken } = useAuth();
    if (!isLoaded || !userId) {
        return null;
    }

    const db = getFirestore(app);
    const userRef = doc(db, 'Doctors', userId);

    const updateExperienceInFirebase = async (experience) => {
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
            await updateDoc(userRef, {
                experience: experience
            });
        } else {
            await setDoc(userRef, {
                experience: experience
            });
        }
    }

    const handleNext = async () => {
        if (!experience) {
            ToastAndroid.show('Please fill in your experience', ToastAndroid.SHORT);
            return;
        }

        setVerifying(true);
        await updateExperienceInFirebase(experience);
        ToastAndroid.show('Experience saved', ToastAndroid.SHORT);
        setVerifying(false);
        navigation.navigate('About');
    }


   

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
                    <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, color: '#4c5b6c', marginBottom: 20 }}>Experience</Text>
                    <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#717b7f', textAlign: 'center', marginBottom: 20 }}>
                        How many years of experience do you have ? 
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 50 }}>
                    <View style={{ width: '80%', height: 50, borderColor: '#ccc', borderWidth: 2, borderRadius: 30, justifyContent: 'center', alignItems: 'center',  }}>
                        <TextInput
                            style={{ width: '90%', height: 50, fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#4c5b6c' }}
                            placeholder='Experience'
                            value={experience}
                            onChangeText={(text) => setExperience(text)}
                            keyboardType='numeric'
                        />
                    </View>
                </View>

                <View style={{ position: 'absolute', bottom: 40, width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                    <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 12, marginHorizontal: 30, color: '#717b7f' }}>
                        proceed to the next step
                    </Text>

                    <TouchableOpacity
                        style={{ width: '80%', marginTop: 20, height: 50, backgroundColor: '#4c5b6c', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleNext}
                    >
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

export default Exp;
