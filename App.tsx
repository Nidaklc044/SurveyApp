/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import HomeView from './screens/HomeView';
import AnalyticsView from './screens/AnalyticsView';
import RequestView from './screens/RequestView';
import LoginScreen from "./screens/Login";
import SignupEmailView from "./screens/SignupEmailView";
import SurveyDetails from "./screens/SurveyDetails";
import firestore from "@react-native-firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCgJJ70Mo1rqlY6Fb32vZVGGgVkHrp8uRU",
    authDomain: "mobileapp-455e3.firebaseapp.com",
    projectId: "mobileapp-455e3",
    storageBucket: "mobileapp-455e3.appspot.com",
    messagingSenderId: "660480078724",
    appId: "1:660480078724:android:5d6b2c7c68f2a3248de3d1",
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

enableScreens();
const Stack = createStackNavigator();

function App(): React.JSX.Element {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                fetchUserType(user);
            }
            // console.log("user")
            // console.log(user)
            if (initializing) setInitializing(false);
        });
        return subscriber; // unsubscribe on unmount
    }, [initializing]);
    const fetchUserType = async (user) => {
        try {
            const responseSnapshot = await firestore()
                .collection('users')
                .where('user_id', '==', user.uid)
                .get();

            if (!responseSnapshot.empty) {
                const userType = responseSnapshot.docs[0].data().user_type;
                setUserType(userType);
            }
        } catch (error) {
            console.error("Error fetching user type:", error);
        }
    };

    if (initializing) return null; // Render nothing while waiting for user auth state

  // return (
  //     <SafeAreaView>
  //         <ScrollView
  //             contentInsetAdjustmentBehavior="automatic"
  //            >
  //             <Header />
  //             <View
  //                 style={{
  //                     backgroundColor: isDarkMode ? Colors.black : Colors.white,
  //                 }}>
  //                 <LearnMoreLinks />
  //             </View>
  //         </ScrollView>
  //     </SafeAreaView>
  // );
  console.log("test");
  return (
      <NavigationContainer>
          <Stack.Navigator>
              {user ? (
                  <>
                      <Stack.Screen name="Home" component={HomeView} options={{ title: 'Surveys ' }} initialParams={{user_type:userType}}/>
                      <Stack.Screen name="Analytics" component={AnalyticsView} options={{ title: 'Survey Report' }} />
                      <Stack.Screen name="RequestView" component={RequestView} options={{ title: 'Survey Questions' }} />
                      <Stack.Screen name="SurveyDetails" component={SurveyDetails} options={{ title: 'Survey Details' }} />
                  </>
              ) : (
                  <>
                      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
                      <Stack.Screen name="Signup" component={SignupEmailView} />
                  </>
              )}
          </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
