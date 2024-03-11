import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const DocProfile = () => {
  const { isSignedIn, signOut } = useAuth();
  const { isLoaded, user } = useUser();
  const navigation = useNavigation();

  if (!isLoaded || !isSignedIn) {
    return null;
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

  const fieldMappings = [
    { icon: 'user-md', label: 'specialization', value: 'Dermatologist', screen: 'SpecializationEdit' },
    { icon: 'phone', label: 'contact', value: '+91 9876543210', screen: 'PhoneEdit' },
    { icon: 'envelope', label: 'email', value: 'inboxnishant@gmail.com', isEditable: false },
    { icon: 'map-marker-alt', label: 'work location', value: '123, Country', screen: 'LocationEdit' },
    { icon: 'calendar-alt', label: 'experience', value: '5 years', screen: 'ExperienceEdit' },
    {
      icon: 'info-circle',
      label: 'about',
      value: 'I am a dermatologist with 5 years of experience and treated 500+ patients. I am available for consultation on weekdays from 10 am to 5 pm.',
      screen: 'AboutEdit',
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} backgroundColor='#fff'>
        <View
          style={{
            backgroundColor: '#4c5b6c',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 30,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ marginTop: 10, marginLeft: 20, marginBottom: 25 }}>
            <Text style={{ color: '#eee', fontFamily: 'Urbanist-Bold', fontSize: 20, alignSelf: 'center' }}>Setup your Profile</Text>
          </View>

          <View style={{ marginHorizontal: 10, marginTop: 10, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d0cdc9', padding: 10, borderRadius: 10 }}>
                <Image source={{ uri: user.imageUrl }} style={{ width: 70, height: 70, borderRadius: 50 }} />
              </View>
              <View style={{ marginLeft: 20 }}>
                <Text style={{ color: '#d0cdc9', fontFamily: 'Urbanist-Bold', fontSize: 20 }}>Dr.{'\n'}<Text style={{ color: '#d0cdc9', fontFamily: 'Urbanist-ExtraBold', fontSize: 30 }}>{user.fullName}</Text></Text>
              </View>
            </View>
          </View>
        </View>

        {fieldMappings.map((field, index) => (
          <View key={index} style={{ flexDirection: 'row', marginHorizontal: 30, justifyContent: 'space-between', marginTop: index === 0 ? 50 : 20, alignItems: 'center' }}>
            <View style={{ padding: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name={field.icon} size={19} color="#717b7f" />
              <View style={{ marginLeft: 20, width: '73%' }}>
                <Text style={{ color: '#9fa4a3', fontFamily: 'Urbanist-Medium', fontSize: 13 }}>{field.label}</Text>
                <Text style={{ color: '#080808', fontFamily: 'Urbanist-Medium', fontSize: 17, marginTop: 2 }}>{field.value}</Text>
              </View>
            </View>
            {field.isEditable !== false && (
              <TouchableOpacity onPress={() => navigation.navigate(field.screen)}>
                <Text style={{ color: '#3a3a3a', fontFamily: 'Urbanist-Bold', fontSize: 15 }}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isSignedIn && (
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={{ color: '#3a3a3a', fontFamily: 'Urbanist-Bold' }}>Sign Out</Text>
          </TouchableOpacity>
        )}

        <View style={{ backgroundColor: 'transparent', padding: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginLeft: 10, marginVertical: 70 }}>
          <Text style={{ fontSize: 60, fontFamily: 'Exo2-Bold', color: '#667579' }}>
            Inside{'\n'}Labs
          </Text>
          <Text style={{ fontSize: 16, marginTop: 10, fontFamily: 'Urbanist-Medium', color: '#717b7f' }}>Engineered with ❤️ at Inside Labs</Text>
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor='#4c5b6c' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c5b6c',
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

export default DocProfile;
