import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        console.log("handleLogin");
        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => setError(error.message));
    };
    const navigateToSignup = () => {
        navigation.navigate('Signup');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Anket</Text>
            <Text style={styles.subtitle}>Sistemimize <Text style={styles.highlight}>Hoşgeldiniz!</Text></Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#7E7E7E"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#7E7E7E"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Login" onPress={handleLogin} color="#F5A623" />
            <View style={{ marginTop: 10 }}>
                <Button title="Signup" onPress={navigateToSignup} color="#4A90E2" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#2D2D3A',
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    highlight: {
        color: '#F5A623',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#4A90E2',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: '#3E3E50',
        color: '#ffffff',
    },
    error: {
        color: '#FF0000',
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default LoginScreen;
