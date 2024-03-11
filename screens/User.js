// Profile.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-react';

const User = ({ navigation }) => {
  const { isSignedIn, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to your profile!</Text>
      {isSignedIn && (
        <Button title="Sign Out" onPress={handleSignOut} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default User;
