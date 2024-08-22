import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AnalyticsView = ({ route }) => {
    const { id } = route.params;
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        console.log("id");
        console.log(id);
        const responseSnapshot = await firestore()
            .collection('cevaplar')
            .where('anket_id', '==', id)
            .get();

        const questionTitles = {};
        const questionAnalysis = {};

        for (const doc of responseSnapshot.docs) {
            const answers = doc.data().cevaplar;
            for (const answer of answers) {
                const questionId = answer.id;
                const value = answer.value;
                if (!questionTitles[questionId]) {
                    const questionDoc = await firestore().collection('sorular').doc(questionId).get();
                    questionTitles[questionId] = questionDoc.data().title;
                }

                if (!questionAnalysis[questionId]) {
                    questionAnalysis[questionId] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                }

                questionAnalysis[questionId][value]++;
            }
        }

        console.log("questionAnalysis");
        console.log(questionAnalysis);
        const results = Object.keys(questionAnalysis).map(questionId => ({
            questionId,
            title: questionTitles[questionId],
            results: {
                'Çok İyi': questionAnalysis[questionId]['1'],
                'İyi': questionAnalysis[questionId]['2'],
                'Normal': questionAnalysis[questionId]['3'],
                'Kötü': questionAnalysis[questionId]['4'],
                'Çok Kötü': questionAnalysis[questionId]['5'],
            }
        }));

        setResponses(results);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Survey Report</Text>
            {responses.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionId}>Question ID: {question.questionId}</Text>
                    <Text style={styles.questionTitle}>Question: {question.title}</Text>
                    {Object.entries(question.results).map(([option, count], idx) => (
                        <View key={idx} style={styles.resultRow}>
                            <Text style={styles.resultOption}>{option}:</Text>
                            <Text style={styles.resultCount}>{count}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#2D2D3A', // Dark background color
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#ffffff', // Header text color
    },
    questionContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#3E3E50', // Container background color
        borderRadius: 8,
    },
    questionId: {
        fontSize: 12,
        color: '#B0B0B0', // Question ID color
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#ffffff', // Question title color
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    resultOption: {
        fontSize: 14,
        color: '#F5A623', // Result option color
    },
    resultCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff', // Result count color
    },
});

export default AnalyticsView;
