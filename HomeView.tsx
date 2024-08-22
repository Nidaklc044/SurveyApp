import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button, ToastAndroid, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AddSurveyModal from './AddSurveyModal';
import { useNavigation, useRoute } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [surveys, setSurveys] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userType, setUserType] = useState(false);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('anketler')
            .orderBy('title', 'asc')
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSurveys(data);
            });
        console.log("home params");
        console.log(route.params.user_type);
        setUserType(route.params.user_type);
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch(error => {
                console.error(error);
            });
    };

    function generateUUID(digits) {
        let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let uuid = [];
        for (let i = 0; i < digits; i++) {
            uuid.push(str[Math.floor(Math.random() * str.length)]);
        }
        return uuid.join('');
    }

    const handleAddSurvey = (title, userTypes) => {
        const uniqueiddd = generateUUID(10);
        firestore().collection('anketler').doc(uniqueiddd).set({
            id: uniqueiddd,
            title,
            user_type: userTypes,
        });
    };

    function notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        }
    }

    const navigateToSurvey = (item) => {
        console.log(userType);
        console.log(item.user_type[0]["name"]);
        console.log("veya");
        console.log(item.user_type[1]["name"]);
        if (
            userType == "Admin" || (
                (userType == item.user_type[0]["name"] && item.user_type[0]["value"] == true) ||
                (userType == item.user_type[1]["name"] && item.user_type[1]["value"] == true)
            )
        ) {
            navigation.navigate('RequestView', { id: item.id });
        } else {
            if ((userType == item.user_type[0]["name"] && item.user_type[0]["value"] == false)) {
                notifyMessage("Sadece Müşteriler Girebilir");
            } else if ((userType == item.user_type[1]["name"] && item.user_type[1]["value"] == false)) {
                notifyMessage("Sadece Personeller Girebilir");
            }
        }
    };

    const renderSurveyItem = ({ item }) => (
        <TouchableOpacity style={styles.surveyItem}
            onPress={() => navigateToSurvey(item)}
        >
            <Text style={styles.surveyTitle}>name: {item.title} / Grup: {item.user_type[0]["value"] == true ? item.user_type[0]["name"] : ""} {item.user_type[1]["value"] == true ? item.user_type[1]["name"] : ""}</Text>
            {userType == "Admin" ? (
                <View style={styles.rowcontainer}>
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={styles.surveyItem}
                            onPress={() => navigation.navigate('SurveyDetails', { anketId: item.id })}
                        >
                            <Text style={styles.surveyTitle}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={styles.surveyItem}
                            onPress={() => navigation.navigate('Analytics', { id: item.id })}
                        >
                            <Text style={styles.surveyTitle}>Analytics </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.rowcontainer}>
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={styles.surveyItem}
                            onPress={() => navigateToSurvey(item)}
                        >
                            <Text style={styles.surveyTitle}>open</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {userType}</Text>

            <View style={{ marginBottom: 10 }}>
                <Button title={"Logout"} onPress={handleLogout} color="#F5A623" />
            </View>
            <FlatList
                data={surveys}
                renderItem={renderSurveyItem}
                keyExtractor={item => item.id}
            />
            {userType == "Admin" ? (
                <>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                    {isModalVisible && (
                        <AddSurveyModal
                            onClose={() => setModalVisible(false)}
                            onSave={handleAddSurvey}
                        />
                    )}
                </>
            ) : (<></>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2D2D3A',
    },
    rowcontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    item: {
        width: '50%'
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    surveyItem: {
        backgroundColor: '#3E3E50',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    surveyTitle: {
        color: '#ffffff',
        fontSize: 16,
    },
    welcomeText: {
        fontSize: 18,
        color: '#B0B0B0',
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default HomeScreen;
