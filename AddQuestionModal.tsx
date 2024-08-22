import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
} from 'react-native';

const AddQuestionModal = ({ visible, onClose, onSave, initialData, type }) => {
    const [title, setTitle] = useState(initialData?.title || '');

    const cevaplar = [
        { name: "Çok İyi", id: 1, value: false },
        { name: "İyi", id: 2, value: false },
        { name: "Normal", id: 3, value: false },
        { name: "Kötü", id: 4, value: false },
        { name: "Çok Kötü", id: 5, value: false },
    ];

    const handleSave = () => {
        if (title.trim() === '') {
            // Show an error toast or alert
            console.log("Boşlukları doldurunuz");
            return;
        }

        onSave({
            id: initialData?.id,
            anket_id: initialData?.anket_id,
            title,
            cevaplar,
        });

        setTitle('');
        onClose();
        
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {`Soru ${type === "edit" ? "Düzenle" : "Ekle"}`}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Anket Sorusu"
                        value={title}
                        onChangeText={setTitle}
                        multiline
                        numberOfLines={5}
                    />
                    <Text style={styles.cevaplarText}>
                        {`Sabit Cevaplar \n${JSON.stringify(cevaplar)}`}
                    </Text>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Kaydet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Kapat</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#2c2c38', // Daha açık bir arka plan rengi
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Beyaz metin rengi
    },
    input: {
        borderWidth: 1,
        borderColor: '#444', // Daha koyu gri kenarlık
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        height: 100,
        textAlignVertical: 'top',
        color: '#fff', // Beyaz metin rengi
        backgroundColor: '#333', // Koyu arka plan rengi
    },
    cevaplarText: {
        marginBottom: 20,
        color: '#fff', // Beyaz metin rengi
    },
    saveButton: {
        backgroundColor: '#f39c12', // Turuncu buton rengi
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff', // Beyaz metin rengi
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#e74c3c', // Kırmızı kapatma butonu rengi
    },
});

export default AddQuestionModal;
