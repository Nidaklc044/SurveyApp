import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    Picker,
} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupEmailView = ({ navigation }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [userType, setUserType] = useState('Admin');
    const [types] = useState([
        { name: 'Admin', id: '1' },
        { name: 'Personel', id: '2' },
        { name: 'Müşteri', id: '3' },
    ]);

    const navigateToLogin = () => {
        navigation.replace('Login');
    };

    const register = async () => {
        if (password !== passwordRepeat) {
            alert('Passwords do not match');
            return;
        }

        if (!name || !surname || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            if (user) {
                const userRef = firestore().collection('users').doc(user.uid);
                await userRef.set({
                    user_id: user.uid,
                    email: user.email,
                    name,
                    surname,
                    user_type: userType,
                    online_status: false,
                });

                user.sendEmailVerification();
                alert('Registration successful, please verify your email');
                navigateToLogin();
            }
        } catch (error) {
            if (error.code === 'auth/weak-password') {
                alert('The password provided is too weak.');
            } else if (error.code === 'auth/email-already-in-use') {
                alert('The account already exists for that email.');
            } else {
                alert('Registration failed: ' + error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Kullanıcı Tipi</Text>
            <Picker
                selectedValue={userType}
                style={styles.picker}
                onValueChange={(itemValue) => setUserType(itemValue)}>
                {types.map((type) => (
                    <Picker.Item label={type.name} value={type.name} key={type.id} />
                ))}
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Repeat Password"
                value={passwordRepeat}
                onChangeText={setPasswordRepeat}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={register}>
                <Text style={styles.buttonText}>REGISTER</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2D2D3A', // Dark background for consistency
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#ffffff', // White text for labels
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#3E3E50', // Slightly lighter background for picker
        color: '#ffffff', // White text for picker
    },
    input: {
        height: 50,
        borderColor: '#4A90E2', // Blue border for inputs
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#3E3E50', // Same as picker background
        color: '#ffffff', // White text for inputs
    },
    button: {
        height: 50,
        backgroundColor: '#26B13C', // Green background for button
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff', // White text for button
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SignupEmailView;
