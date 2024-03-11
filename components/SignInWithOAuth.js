import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, View } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/warmUpBrowser";
import { useFonts } from 'expo-font';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from '@expo/vector-icons';
WebBrowser.maybeCompleteAuthSession();

import * as SecureStore from 'expo-secure-store';

const SignInWithOAuth = () => {
  const [user, setUser] = React.useState('Patient');

  const handleUserSelect = (selectedUser) => {
    console.log('Selected User:', selectedUser);
    setUser(selectedUser);
  };

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
  
      if (createdSessionId) {
        setActive({ session: createdSessionId });
        
        await SecureStore.setItemAsync('selectedUser', user.toString()); // Convert to string
        console.log('Retrieved User:', user.toString());
      } else {
        console.error("Error: Session ID not created");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [user]);
  


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
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text style={{
          fontSize: 30,
          fontFamily: 'Exo2-Bold',
          marginTop: 100,
        }}>Welcome to <Text style={{ fontFamily: 'Exo2-Bold', color: '#5dbe74' }}>Sehat</Text>
        </Text>
      </View>


      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',}}>
        <Text style={{
          fontSize: 20,
          fontFamily: 'Urbanist-Bold',
          color: '#222',
          marginTop: 60,
        }}>Let's get acquainted</Text>
        <Text style={{
          fontSize: 13,
          fontFamily: 'Urbanist-Medium',
          color: '#666',
          marginTop: 5,
        }}>Streamline your health care experience with Sehat.
        </Text>
      </View>


      <View
        style={{
          justifyContent: 'center',
          marginTop: 30,
        }}>
        <TouchableOpacity
          onPress={() => handleUserSelect('Patient')}
          style={{
            padding: 10,
            borderRadius: 10,
            marginTop: 50,
            alignItems: 'center',
            flexDirection: 'row',
            width: '60%',
          }}>
          <View style={{
            backgroundColor: user === 'Patient' ? '#5dbe74' : '#fff',
            borderRadius: 10,
            padding: 10,
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <FontAwesome5 name="user" size={20} color={ user === 'Patient' ? '#fff' : '#000'} />
          </View>
          <View>
            <Text style={{
              color: user === 'Patient' ? '#5dbe74' : '#000',
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              marginLeft: 10,
            }}>I'm a patient</Text>
            <Text style={{
              color: '#666',
              fontFamily: 'Urbanist-Medium',
              fontSize: 13,
              marginLeft: 10,
              marginTop: 5,
            }}>Book appointments</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleUserSelect('Doctor')}
          style={{
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            alignItems: 'center',
            flexDirection: 'row',
            width: '60%'
          }}>
          <View style={{
            backgroundColor: user === 'Doctor' ? '#5dbe74' : '#fff',
            borderRadius: 10,
            padding: 10,
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <FontAwesome5 name="stethoscope" size={20} color={ user === 'Doctor' ? '#fff' : '#000'} />
          </View>
          <View>
            <Text style={{
              color: user === 'Doctor' ? '#5dbe74' : '#000',
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              marginLeft: 10,
            }}>I'm a doctor</Text>
            <Text style={{
              color: '#666',
              fontFamily: 'Urbanist-Medium',
              fontSize: 13,
              marginLeft: 10,
              marginTop: 5,
            }}>Manage appointments</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={{
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          flexDirection: 'row',
          width: '60%',
          justifyContent: 'center',
          backgroundColor: '#5dbe74',
          marginTop: 150,
        }}>
        <Text style={{
          color: '#fff',
          fontFamily: 'Urbanist-Medium',
          fontSize: 16,
        }}>Sign in with <Text style={{color: '#fff',fontFamily: 'Urbanist-Bold',fontSize: 16,}}>Google</Text>
        </Text>
      </TouchableOpacity>


    </SafeAreaView>
  );
}

export default SignInWithOAuth;
