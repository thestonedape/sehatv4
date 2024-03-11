import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ToastAndroid, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';

const DocProfile = ({ route }) => {
  const { doctor } = route.params;
  const [showFullText, setShowFullText] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const scrollViewRef = useRef(null);
/*
  const Waiting_Driver_screen = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })();
    }, []);

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {currentLocation ? (
          <MapView
            style={{ height: 150, width: Dimensions.get('window').width - 40, borderRadius: 10, }}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE}>
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="Your Location"
              description="You are here"
            />
          </MapView>
        ) : (
          <Text>Fetching your location...</Text>
        )}
      </View>
    );
  } */

  useEffect(() => {
    console.log('useEffect triggered');
    const currentDate = new Date();
    setCurrentMonth(currentDate.getMonth());
    setCurrentYear(currentDate.getFullYear());
    const currentDay = currentDate.getDate();
    const scrollToX = (currentDay) * (60 + 10) - 50;
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
      }
    }, 100);
  }, [scrollViewRef.current]);

  const navigation = useNavigation();
  const [loaded] = useFonts({
    'Urbanist-Bold': require('../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-ExtraBold': require('../assets/fonts/Urbanist-ExtraBold.ttf'),
    'Urbanist-Medium': require('../assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Regular': require('../assets/fonts/Urbanist-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',];

  const handlePressIn = (day) => {

    setSelectedDay(selectedDay === day ? null : day);
  };

  const toggleShowFullText = () => setShowFullText(!showFullText);

  const getDayOfWeek = (year, month, day) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(year, month, day);
    return daysOfWeek[date.getDay()];
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthName = months[currentMonth];

  const handleMonthChange = (change) => {
    const newMonth = (currentMonth + change + 12) % 12;
    const newYear = currentYear + Math.floor((currentMonth + change) / 12);

    if (newYear > new Date().getFullYear() || (newYear === new Date().getFullYear() && newMonth >= new Date().getMonth())) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const renderTimeSlots = () => {
    if (!selectedDay || !currentMonth || !currentYear) return null;

    const currentTime = new Date().getTime();
    const futureTimeSlots = timeSlots.filter((slot) => new Date(currentYear, currentMonth, selectedDay, ...slot.split(':')).getTime() > currentTime);

    return futureTimeSlots.map((slot, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedDate(selectedDate === slot ? null : slot)}
        style={{ backgroundColor: selectedDate === slot ? '#5dbe74' : '#fff', padding: 10, borderRadius: 10, marginRight: 10, marginTop: 10, }} >
        <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Regular', color: selectedDate === slot ? '#fff' : '#222222' }}>{slot}</Text>
      </TouchableOpacity>
    ));
  };

  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const getDaysInMonth = (year, month) => [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];

  const renderDayButtons = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    return Array.from({ length: daysInMonth }).map((_, day) => {
      const currentDay = day + 1;
      const currentDate = new Date();
      const currentTime = new Date().getTime();
      const availableTimeSlots = timeSlots.some((slot) => new Date(currentYear, currentMonth, currentDay, ...slot.split(':')).getTime() > currentTime);
      const isPastDate = currentYear === currentDate.getFullYear() && currentMonth === currentDate.getMonth() && currentDay < currentDate.getDate() || availableTimeSlots === false;
      return (
        <TouchableOpacity
          key={currentDay}
          onPress={() => (isPastDate ? null : handlePressIn(currentDay))}
          style={{ backgroundColor: selectedDay === currentDay ? '#5dbe74' : '#fff', padding: 10, borderRadius: 10, marginRight: 10, marginTop: 10, width: 60, justifyContent: 'center', alignItems: 'center', opacity: isPastDate ? 0.5 : 1, }}
          disabled={isPastDate}>
          <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Bold', color: selectedDay === currentDay ? '#fff' : '#222222' }}>{currentDay}</Text>
          <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Regular', color: selectedDay === currentDay ? '#fff' : '#222222' }}>{getDayOfWeek(currentYear, currentMonth, currentDay)}</Text>
        </TouchableOpacity>
      );
    });
  };

  const formatDate = (day, month, year) => `${day} ${currentMonthName} ${year}`;
  const showToast = (message) => ToastAndroid.show(message, ToastAndroid.SHORT);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eee' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#eee' }}>
        <View style={{ width: '100%', height: 'auto', backgroundColor: '#eee', flexDirection: 'row', }}>
          <Image source={{ uri: doctor.profile }} style={{ width: 100, height: 100, borderRadius: 15, marginLeft:20, marginTop:20 }} />
          <View style={{ width:'64%', marginHorizontal:10, marginTop:20 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Bold', color: '#111' }}>{doctor.name}</Text>
            <Text style={{ fontSize: 15, color: '#313131', marginTop: 5 }}>{doctor.speciality}</Text>
            <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center',}}>
              <FontAwesome5 name="map-marker-alt" size={15} color="#111" />
              <Text style={{ fontSize: 14, color: '#313131', marginLeft: 5,  }}>
                {doctor.location}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', backgroundColor: '#eee', padding: 10 }}>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Bold', color: '#666666' }}>About</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Regular', color: '#666666', marginTop: 10 }}>
              {showFullText ? doctor.about : `${doctor.about.substring(0, 150)}...`}
            </Text>
            {doctor.about.length > 90 && (
              <TouchableOpacity onPress={toggleShowFullText}>
                <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Regular', color: '#5dbe74', marginTop: 10 }}>
                  {showFullText ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginLeft: 10, marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Bold', color: '#666666' }}>Location</Text>
          </View>
          <View style={{ height: 160, marginTop: 10, backgroundColor: '#fff', borderColor: '#666666', borderWidth: 3, borderRadius: 5, width: '98%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/icons/GoogleMapTA.webp')} style={{ width: '100%', height: '100%', borderRadius: 5,}}/>
          </View>
          <View style={{ marginLeft: 10, marginTop: 20, justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10, marginRight: 10, width: 'auto',}}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#555', }}>Patients</Text>
              <Text style={{ fontSize: 30, fontFamily: 'Urbanist-ExtraBold', color: '#555', marginTop: 10 }}>1200</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10, marginRight: 10, width: 'auto',  }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#555', }}>Experience</Text>
              <Text style={{ fontSize: 30, fontFamily: 'Urbanist-ExtraBold', color: '#555', marginTop: 10 }}>5 Yrs+</Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Bold', color: '#666', marginLeft: 10, marginTop: 20 }}>Book Appointment</Text>
          </View>
          <View style={{ marginLeft: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontFamily: 'Urbanist-ExtraBold', color: '#222222' }}>Date</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, marginRight: 10 }}>
                  <FontAwesome5 name="chevron-left" size={16} color="#111" />
                </View>
              </TouchableOpacity>
              <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Regular', color: '#222222' }}>{currentMonthName}</Text>
              <Text style={{ fontSize: 15, fontFamily: 'Urbanist-Regular', color: '#222222', marginLeft: 5 }}>{currentYear}</Text>
              <TouchableOpacity onPress={() => handleMonthChange(1)}>
                <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, marginLeft: 10 }}>
                  <FontAwesome5 name="chevron-right" size={16} color="#111" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}>
            {renderDayButtons()}
          </ScrollView>

          <View style={{ marginLeft: 10, marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Urbanist-ExtraBold', color: '#222222' }}>{selectedDay ? 'Available Slots' : null}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderTimeSlots()}
            </ScrollView>
          </View>

          {selectedDay && selectedDate && (
            <TouchableOpacity style={{ width: '80%', height: 50, backgroundColor: '#5dbe74', borderRadius: 30, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 40, marginBottom: 40 }}
              onPress={() => {
                if (selectedDate && selectedDay !== null) {
                  const formattedDate = formatDate(selectedDay, currentMonthName, currentYear);
                  showToast(`Appointment booked successfully for ${formattedDate} at ${selectedDate}`);
                } else {
                  showToast('Please select a date and time first.');
                }
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: 'Urbanist-Bold', color: '#fff' }}>Book Appointment</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <StatusBar style="dark" backgroundColor='#eee' />
    </SafeAreaView>
  );
};

export default DocProfile;
