import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import DocHome from './adminScreens/DocHome';
import Schedule from './adminScreens/Schedule';
import Doctorprofile from './adminScreens/Doctorprofile';

import DocSetup from './adminSetup/DocSetup';
import Location from './adminSetup/Location';
import Specialization from './adminSetup/Specialization';
import Experience from './adminSetup/Exp';
import About from './adminSetup/Abt';

import PhoneEdit from './Edit/DocSetup';
import LocationEdit from './Edit/Location';
import SpecializationEdit from './Edit/Specialization';
import ExperienceEdit from './Edit/Exp';
import AboutEdit from './Edit/Abt';

const Stack = createNativeStackNavigator();

const FirsLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    })
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="DocSetup" component={DocSetup} options={{ headerShown: false }} />
        <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
        <Stack.Screen name="Specialization" component={Specialization} options={{ headerShown: false }} />
        <Stack.Screen name="Experience" component={Experience} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
        <Stack.Screen name="DocHome" component={DocHome} options={{ headerShown: false }} />
        <Stack.Screen name="Doctorprofile" component={Doctorprofile} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={Schedule} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen name="DocHome" component={DocHome} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={Schedule} options={{ headerShown: false }} />
        <Stack.Screen name="PhoneEdit" component={PhoneEdit} options={{ headerShown: false }} />
        <Stack.Screen name="LocationEdit" component={LocationEdit} options={{ headerShown: false }} />
        <Stack.Screen name="SpecializationEdit" component={SpecializationEdit} options={{ headerShown: false }} />
        <Stack.Screen name="ExperienceEdit" component={ExperienceEdit} options={{ headerShown: false }} />
        <Stack.Screen name="AboutEdit" component={AboutEdit} options={{ headerShown: false }} />
        <Stack.Screen name="Doctorprofile" component={Doctorprofile} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
};

export default function App() {
  return (
      <NavigationContainer>
        <FirsLaunch />
      </NavigationContainer>
  );
}


