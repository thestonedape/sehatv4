import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import Home from "./screens/Home";
import Booking from "./screens/Booking";
import User from "./screens/User";
import Services from "./screens/Services";
import Docprofile from "./screens/Docprofile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: "#f8f9fa",
          borderTopWidth: 0,
          shadowOffset: {
            width: 5,
            height: 3,
          },
          shadowColor: "black",
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Booking") {
            iconName = "list-alt";
          } else if (route.name === "User") {
            iconName = "user";
          } else if (route.name === "Services") {
            return (
              <MaterialIcons
                name="category"
                size={27}
                color={focused ? "#5dbe74" : "#6c757d"}
              />
            );
          }
          return (
            <FontAwesome
              name={iconName}
              size={26}
              color={focused ? "#5dbe74" : "#6c757d"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Services" component={Services} options={{ headerShown: false }} />
      <Tab.Screen name="Booking" component={Booking} options={{ headerShown: false }} />
      <Tab.Screen name="User" component={User} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Bottomtabs" component={BottomTabs} />
        <Stack.Screen name="Docprofile" component={Docprofile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
