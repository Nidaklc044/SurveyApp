import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AddQuestionModal from './AddQuestionModal';
import firestore from '@react-native-firebase/firestore';

const SurveyDetails = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [questions, setQuestions] = useState([]);
    const { anketId } = route.params;

    useEffect(() => {
        // Fetch questions from Firestore
        const unsubscribe = firestore()
            .collection('sorular')
            .where('anket_id', '==', anketId)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuestions(data);
            });

        return () => unsubscribe();
    }, [anketId]);

    function generateUUID(digits) {
        let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let uuid = [];
        for (let i = 0; i < digits; i++) {
            uuid.push(str[Math.floor(Math.random() * str.length)]);
        }
        return uuid.join('');
    }

    const handleSaveQuestion = async (questionData) => {
        console.log("handleSaveQuestion");
        const uniqueiddd = generateUUID(10);
        if (questionData.id) {
            // Edit existing question
            await firestore()
                .collection('sorular')
                .doc(questionData.id)
                .update(questionData);
        } else {
            // Add new question
            console.log("anketId");
            console.log(anketId);
            await firestore()
                .collection('sorular')
                .doc(uniqueiddd)
                .set({
                    ...questionData,
                    anket_id: anketId,
                    id: uniqueiddd
                });
        }

        alert('Saved successfully');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Button title="Add Question" onPress={() => setModalVisible(true)} color="#F5A623" />
            {/* Render your list of questions here */}
            <AddQuestionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveQuestion}
                type="add"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Align items to the top
        padding: 16,
        backgroundColor: '#2D2D3A', // Background color matching other components
    },
});

export default SurveyDetails;
