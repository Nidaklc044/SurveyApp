import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from './screens/HomeView';
import AnalyticsView from './screens/AnalyticsView';
import RequestView from './screens/RequestView';

const Stack = createStackNavigator();   

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeView} options={{ title: 'Surveys' }} />
                <Stack.Screen name="Analytics" component={AnalyticsView} options={{ title: 'Survey Report' }} />
                <Stack.Screen name="Request" component={RequestView} options={{ title: 'Survey Questions' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
