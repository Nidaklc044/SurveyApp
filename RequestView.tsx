import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RequestView = ({ navigation, route }) => {
    const { id } = route.params;
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [userType, setUserType] = useState('');

    useEffect(() => {
        fetchQuestions();
        fetchUserType();
    }, []);

    function generateUUID(digits) {
        let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let uuid = [];
        for (let i = 0; i < digits; i++) {
            uuid.push(str[Math.floor(Math.random() * str.length)]);
        }
        return uuid.join('');
    }

    const fetchQuestions = async () => {
        const questionsSnapshot = await firestore()
            .collection('sorular')
            .where('anket_id', '==', id)
            .orderBy('id', 'asc')
            .get();

        const questionsData = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(questionsData);

        //  Kullanıcının önceki yanıtlarını alıyoruz (varsa)
        const userId = auth().currentUser.uid;
        const userAnswersDoc = await firestore()
            .collection('cevaplar')
            .where('anket_id', '==', id)
            .where('user_id', '==', userId)
            .get();

        if (!userAnswersDoc.empty) {
            const answers = userAnswersDoc.docs[0].data().cevaplar;
            const answersMap = {};
            answers.forEach(answer => {
                answersMap[answer.id] = answer.value;
            });
            setUserAnswers(answersMap);
        }
    };

// Kullanıcı türünü Firestore'dan çekiyoruz
    const fetchUserType = async () => {
        const userId = auth().currentUser.uid;
        const userDoc = await firestore().collection('users').doc(userId).get();
        setUserType(userDoc.data().user_type);
    };

    // Bir soruya yanıt verirken çağrılan işlev
    const handleAnswer = (questionId, value) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    // Yanıtları Firestore'a kaydeden işlev
    const submitAnswers = async () => {
        const uniqueiddd = generateUUID(10);
        const userId = auth().currentUser.uid;
        const answers = Object.keys(userAnswers).map(questionId => ({
            id: questionId,
            value: userAnswers[questionId],
        }));

        await firestore().collection('cevaplar').doc(uniqueiddd).set({
            anket_id: id,
            user_id: userId,
            cevaplar: answers,
        }, { merge: true });

        // Navigate back or show success message
        alert('Saved successfully');
        navigation.goBack();
    };

    const answerOptions = [
        { name: 'Çok İyi', id: '1' },
        { name: 'İyi', id: '2' },
        { name: 'Normal', id: '3' },
        { name: 'Kötü', id: '4' },
        { name: 'Çok Kötü', id: '5' },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Survey Questions</Text>
            {questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionTitle}>{question.title}</Text>
                    {answerOptions.map((option, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.optionButton,
                                userAnswers[question.id] === option.id && styles.selectedOption
                            ]}
                            onPress={() => handleAnswer(question.id, option.id)}
                        >
                            <Text style={[
                                styles.optionText,
                                userAnswers[question.id] === option.id && styles.selectedText
                            ]}>
                                {option.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={submitAnswers}>
                <Text style={styles.submitButtonText}>Submit Answers</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#2D2D3A', // Matching background color
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
    },
    questionContainer: {
        marginBottom: 24,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    optionButton: {
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#3E3E50', // Matching button background color
        borderRadius: 8,
    },
    optionText: {
        fontSize: 16,
        color: '#ffffff', // Matching text color
    },
    selectedOption: {
        backgroundColor: '#F5A623', // Highlighted button color
    },
    selectedText: {
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#FF0000', // Matching submit button color
        padding: 16,
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RequestView;
