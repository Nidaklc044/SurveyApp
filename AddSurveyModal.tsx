import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const AddSurveyModal = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [types, setTypes] = useState([
        { name: "Personel", id: "2", value: false },
        { name: "Müşteri", id: "3", value: false },
    ]);

    const handleSave = () => {
        if (title.trim() === '') {
            console.log("Anket ismini giriniz.");
            return;
        }
        onSave(title, types);
        onClose();
    };

    const handleTypeChange = (index) => {
        const newTypes = [...types];
        newTypes[index].value = !newTypes[index].value;
        setTypes(newTypes);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Anket Ekle</Text>
            <TextInput
                style={styles.input}
                placeholder="Anket İsmi"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#aaa"
            />
            {types.map((type, index) => (
                <View key={type.id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={type.value}
                        onValueChange={() => handleTypeChange(index)}
                        tintColors={{ true: '#26a69a', false: '#ccc' }}
                    />
                    <Text style={styles.checkboxLabel}>{type.name}</Text>
                </View>
            ))}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#4a4a58', // Arka plan rengi
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff', // Beyaz metin rengi
    },
    input: {
        borderWidth: 1,
        borderColor: '#444', // Daha koyu gri kenarlık
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#fff', // Beyaz metin rengi
        backgroundColor: '#333', // Koyu arka plan rengi
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        color: '#fff', // Beyaz metin rengi
    },
    saveButton: {
        backgroundColor: '#f39c12', // Turuncu buton rengi
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff', // Beyaz metin rengi
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#e74c3c', // Kırmızı kapatma butonu rengi
    },
});

export default AddSurveyModal;
