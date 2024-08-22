import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const addToTable = async (table, data) => {
    await firestore().collection(table).add(data);
};

export const editTable = async (table, id, data) => {
    await firestore().collection(table).doc(id).update(data);
};

export const userVerify = async () => {
    const user = auth().currentUser;
    if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        return userDoc.data();
    }
    return null;
};

// Add more Firebase-related functions as needed
