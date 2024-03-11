import React, { useEffect, useState } from 'react';
import AppNavigator from './navigation';

import {ClerkProvider,SignedIn,SignedOut,} from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

import { Text,TouchableOpacity, View,} from 'react-native';

import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from './hooks/warmUpBrowser';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import DocNavigation from './docnavigation';
import { StatusBar } from 'expo-status-bar';

const WebBrowser = require('expo-web-browser');

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = ({ onUserSelect }) => {
  const [user, setUser] = React.useState('Patient');

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleUserSelect = (selectedUser) => {
    console.log('Selected User:', selectedUser);
    setUser(selectedUser);
    onUserSelect(selectedUser);
  };

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });

        const selectedUser = user.toString();
        await SecureStore.setItemAsync('selectedUser', selectedUser);
        handleUserSelect(selectedUser);

        console.log('Retrieved User:', selectedUser);
      } else {
        console.error('Error: Session ID not created');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, [user, onUserSelect]);
  

  const [loaded] = useFonts({
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-ExtraBold': require('./assets/fonts/Urbanist-ExtraBold.ttf'),
    'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
    'Exo2-Bold': require('./assets/fonts/Exo2-Bold.ttf'),
    'Exo2-ExtraBold': require('./assets/fonts/Exo2-ExtraBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: '#eee' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center',}}>
        <Text style={{ fontSize: 30, fontFamily: 'Exo2-Bold', marginTop: 100, }}>Welcome to <Text style={{ fontFamily: 'Exo2-Bold', color: user === 'Patient' ? '#5dbe74' : '#4c5b6c' }}>Sehat</Text>
        </Text>
      </View>


      <View style={{ justifyContent: 'center', alignItems: 'center',}}>
        <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Bold', color: '#222', marginTop: 60,}}>Let's get acquainted</Text>
        <Text style={{ fontSize: 13, fontFamily: 'Urbanist-Medium', color: '#666', marginTop: 5,  }}>Streamline your health care experience with Sehat.
        </Text>
      </View>


      <View style={{justifyContent: 'center',marginTop: 30,width: '100%',alignItems: 'center',  }}>
        <TouchableOpacity
          onPress={() => handleUserSelect('Patient')}
          style={{  padding: 10,  borderRadius: 10,  marginTop: 50,  alignItems: 'center',  flexDirection: 'row',  width: '70%',  }}>
          <View style={{ backgroundColor: user === 'Patient' ? '#5dbe74' : '#eee', borderRadius: 10, padding: 10, height: 50, width: 50, justifyContent: 'center', alignItems: 'center',  }}>
            <FontAwesome5 name="user" size={20} solid color={ user === 'Patient' ? '#fff' : '#000'} />
          </View>
          <View>
            <Text style={{ color: user === 'Patient' ? '#5dbe74' : '#000', fontFamily: 'Urbanist-Bold', fontSize: 16, marginLeft: 10, }}>I'm a patient</Text>
            <Text style={{ color: '#666', fontFamily: 'Urbanist-Medium', fontSize: 13, marginLeft: 10, marginTop: 5,  }}>Book appointments</Text>
          </View>
          {user === 'Patient' ? (
            <FontAwesome5 name="chevron-left" size={20} color="#222" 
            style={{ position: 'absolute', right:0 }}
            />
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleUserSelect('Doctor')}
          style={{ padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center', flexDirection: 'row', width: '70%' }}>
          <View style={{ backgroundColor: user === 'Doctor' ? '#4c5b6c' : '#eee', borderRadius: 10, padding: 10, height: 50, width: 50, justifyContent: 'center', alignItems: 'center',}}>
            <FontAwesome5 name="stethoscope" size={20} color={ user === 'Doctor' ? '#fff' : '#000'} />
          </View>
          <View>
            <Text style={{color: user === 'Doctor' ? '#4c5b6c' : '#000',fontFamily: 'Urbanist-Bold',fontSize: 16,marginLeft: 10,  }}>I'm a doctor</Text>
            <Text style={{color: '#666',fontFamily: 'Urbanist-Medium',fontSize: 13,marginLeft: 10, marginTop: 5, }}>Manage appointments</Text>
          </View>

          {user === 'Doctor' ? (
            <FontAwesome5 name="chevron-left" size={20} color="#222" 
            style={{ position: 'absolute', right:0 }}
            />
          ) : null}

        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={{ padding: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', width: '60%', justifyContent: 'center', backgroundColor: user === 'Patient' ? '#5dbe74' : '#4c5b6c', marginTop: 150, }}>
        <Text style={{ color: '#fff', fontFamily: 'Urbanist-Medium', fontSize: 16,}}>Sign in with <Text style={{color: '#fff',fontFamily: 'Urbanist-Bold',fontSize: 16,}}>Google</Text>
        </Text>
      </TouchableOpacity>
      <StatusBar style="dark" backgroundColor='#eee' />
    </SafeAreaView>
    
  );
};

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  },

  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Error saving token:', err);
    }
  },
};


const App = () => {
  const [selectedUser, setSelectedUser] = useState('Patient');

  const handleUserSelect = (selectedUser) => {
    console.log('Selected User:', selectedUser);
    setSelectedUser(selectedUser);
    SecureStore.setItemAsync('selectedUser', selectedUser.toString());
  };

  useEffect(() => {
    const fetchSelectedUser = async () => {
      try {
        console.log('Fetching selected user...');
        const user = await SecureStore.getItemAsync('selectedUser');
        console.log('Retrieved User:', user);

        if (user) {
          setSelectedUser(user);
        } else {
          console.log('No user selected yet.');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchSelectedUser();
  }, []);

  if (selectedUser === null) {
    console.log('User not loaded yet...');
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  console.log('Rendering App component with selectedUser:', selectedUser);

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey='pk_test_YmlnLWxlb3BhcmQtMzUuY2xlcmsuYWNjb3VudHMuZGV2JA'>
      <SignedIn>
        {selectedUser === 'Doctor' ? (
          <DocNavigation />
        ) : (
          <AppNavigator />
        )}
      </SignedIn>
      <SignedOut>
        <SignInWithOAuth onUserSelect={handleUserSelect} />
      </SignedOut>
    </ClerkProvider>
  );
};

export default App;

