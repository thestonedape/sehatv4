
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Image, ToastAndroid } from 'react-native';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { StatusBar } from 'expo-status-bar';

import { getDoc, getFirestore, setDoc } from 'firebase/firestore';

import { doc, updateDoc } from 'firebase/firestore';

import { app } from '../firebaseConfig';


const DocHome = ({ }) => {
    const { isSignedIn, signOut, } = useAuth();
    const {  user } = useUser();

    const navigation = useNavigation();
    

    const { isLoaded, userId, sessionId, getToken ,} = useAuth();
    if (!isLoaded || !userId) {
        return null;
    }

    const db = getFirestore(app);
    const userRef = doc(db, 'Doctors', userId);

    const updateDetailsInFirebase = async ({ firstName, primaryEmailAddress, imageUrl }) => {
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
            await updateDoc(userRef, {
                firstName: user.firstName,
                email: user.primaryEmailAddress.emailAddress,
                imageUrl: user.imageUrl,
                rating : 4.6
            });
        } else {
            await setDoc(userRef, {
                firstName: user.firstName,
                email: user.primaryEmailAddress.emailAddress,
                imageUrl: user.imageUrl,
                rating : 4.6
            });r
        }
    }

    useEffect(() => {
        updateDetailsInFirebase(user.firstName, user.primaryEmailAddress.emailAddress, user.imageUrl);
    }, []);

    const colors = [
        Swirl = '#d0cdc9',
        NaturalGray = '#918981',
        StarDust = '#9fa4a3',
        RollingStone = '#717b7f',
        Nevada = '#667579',
        BlackCoral = '#4c5b6c',
        Tuatara = '#3a3a3a',
        CodGray = '#080808'
    ]

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

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
   
    const showTrustQuotientInfo = () => {
        ToastAndroid.showWithGravityAndOffset(
            "Patient feedback shapes your Trust Quotient. Keep it high!",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );}
    return (

        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 10 }}>
                    <FontAwesome5 name="bars" size={20} color={'#080808'} />
                    <TouchableOpacity onPress={() => navigation.navigate('Doctorprofile')}>
                    <Image source={{ uri:user.imageUrl}} style={{ width: 30, height: 30, borderRadius: 30 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 25, marginLeft: 20, marginBottom: 15 }}>
                    <Text style={{ color: '#3a3a3a', fontFamily: 'Urbanist-Bold', fontSize: 16 }}>Welcome Back</Text>
                    <Text style={{ color: '#080808', fontFamily: 'Urbanist-ExtraBold', fontSize: 40 }}><Text style={{ fontFamily: 'Urbanist-Bold', color: '#3a3a3a', fontSize: 30 }}>Dr. </Text>
                    {user.firstName}</Text>
                </View>

                <View style={{ marginTop: 20, borderRadius: 30, backgroundColor: '#fff', marginHorizontal: 20, }}>
                    <View style={{ backgroundColor: '#4c5b6c', borderTopLeftRadius: 30, borderTopRightRadius: 30, }}>
                        <Text style={{ color: '#eee', marginLeft: 10, fontFamily: 'Urbanist-Bold', fontSize: 16, marginVertical: 15, marginLeft: 20, }}>
                            Appointment Schedule
                        </Text>
                    </View>
                    <View style={{ backgroundColor: '#fff', padding: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center' }}>

                        <View style={{ flexDirection: 'row', marginHorizontal: 10, marginLeft: 20, marginTop: 10, alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center', }}>
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                            </View>

                            <View style={{ marginLeft: 10, padding: 10, }}>
                                <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#3a3a3a', }}>Mahi</Text>
                                <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 14, color: '#555', }}>25 years, Male</Text>
                            </View>

                            <Text style={{ color: '#3a3a3a', marginLeft: 5, fontFamily: 'Urbanist-Bold', fontSize: 14, }}>08 May 2023</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10, justifyContent: 'center', }}>
                            <TouchableOpacity style={{ borderRadius: 20, backgroundColor: '#3a3a3a', padding: 10, width: 130, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: '#fff', fontFamily: 'Urbanist-Bold', }}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ borderRadius: 20, backgroundColor: '#eee', marginLeft: 10, padding: 10, width: 130, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: '#3a3a3a', fontFamily: 'Urbanist-Bold', }}>Reject</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View >
                    <View style={{ marginLeft: 20, marginTop: 30, }}>
                        <Text style={{ color: '#3a3a3a', fontFamily: 'Urbanist-Bold', fontSize: 20, }} >
                            Manage Appointments
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Schedule')}
                        style={{ backgroundColor: '#4c5b6c', marginHorizontal: 20, marginTop: 10, width: '90%', borderRadius: 20, marginTop: 30, elevation: 2 }}>
                        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Urbanist-Bold', marginLeft: 20, color: '#fff', fontSize: 20 }}>Schedules</Text>
                            <Text style={{ marginRight: 20, fontFamily: 'Urbanist-Medium', color: '#eee' }}>Sunday</Text>
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'Urbanist-Medium', marginLeft: 20, marginTop: 5, color: '#fff', fontSize: 14 }}>Go through all your weekly{'\n'}schedules
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 20, }}>
                                    <Image source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' }} style={{ width: 25, height: 25, borderRadius: 30 }} />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 2, }}>
                                    <Image source={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' }} style={{ width: 25, height: 25, borderRadius: 30 }} />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 2, }}>
                                    <Image source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} style={{ width: 25, height: 25, borderRadius: 30 }} />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 2, }}>
                                    <Image source={{ uri: 'https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} style={{ width: 25, height: 25, borderRadius: 30 }} />
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', elevation: 2, marginRight: 20, width: 30, height: 30, borderRadius: 10 }}>
                                <FontAwesome5 name="calendar" size={20} solid color={'#3a3a3a'} />
                            </View>
                        </View>

                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", marginHorizontal: 20, justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 20, marginTop: 30, width: '48%', elevation: 1, padding: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center', marginHorizontal: 10 }}>
                                <Text style={{ fontFamily: 'Urbanist-ExtraBold', color: '#080808', fontSize: 16 }}>Virtual Appointments</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Image source={require('../assets/icons/doctor.gif')} style={{ width: 40, height: 80, }} />
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', width: 30, height: 30, elevation: 2, borderRadius: 10 }}>
                                    <FontAwesome5 name="phone" size={20} solid color={'#3a3a3a'} />
                                </View>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 20, marginTop: 30, width: '48%', elevation: 1, padding: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center', marginHorizontal: 10 }}>
                                <View><Text style={{ fontFamily: 'Urbanist-ExtraBold', color: '#080808', fontSize: 16 }}>Trust{'\n'}Quotient</Text></View>
                                <TouchableOpacity
                                    onPress={showTrustQuotientInfo}
                                    style={{
                                        backgroundColor: '#d0cdc9',
                                        width: 20,
                                        height: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 20
                                    }}>
                                    <FontAwesome5 name="info" size={13} color={'#080808'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress
                                    value={69}
                                    radius={40}
                                    inActiveStrokeOpacity={0.5}
                                    activeStrokeWidth={20}
                                    inActiveStrokeWidth={20}
                                    progressValueStyle={{ fontFamily: 'Urbanist-ExtraBold', color: '#080808' }}
                                    activeStrokeColor='#667579' />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                {isSignedIn && (
                    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                        <Text style={{ color: '#3a3a3a', fontFamily: 'Urbanist-Bold' }}>Sign Out</Text>
                    </TouchableOpacity>
                )}

                <View style={{ backgroundColor: 'transparent', padding: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginLeft: 10, marginVertical: 70, }}>
                    <Text style={{ fontSize: 60, fontFamily: 'Exo2-Bold', color: '#667579', }}>
                        Inside{'\n'}Labs
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 10, fontFamily: 'Urbanist-Medium', color: '#717b7f', }}>Engineered with ❤️ at Inside Labs</Text>
                </View>
            </ScrollView>
            <StatusBar style="dark" backgroundColor='#eee' />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#',
        padding: 10,
        marginTop: 50,
        borderRadius: 10,
        marginHorizontal: 100,
    },
});
export default DocHome;
