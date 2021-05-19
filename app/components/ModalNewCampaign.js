import React, { useState } from 'react';
import { Text, TextInput, View, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 


export default function ModalNewCampaign({ isVisibleModal, setIsVisibleModal, navigation}) {
    const [name, setName] = useState('');

    const handleCreateCampaign = () => {
        let newName = 'Mi campaña SMS';
        if (name !== '') {
            newName = name
        }
        setIsVisibleModal(false);
        navigation.navigate('New-Campaign', {name: newName})
    }

    return (
        <Modal
            visible={isVisibleModal}
            transparent={true}
            animationType='fade'
            onRequestClose={() => setIsVisibleModal(false)}
        >
            <View style={styles.baseBackgorund}>
                <View style={[styles.modalContainer, {backgroundColor: '#fff'}]}>
                    <Text style={[styles.modalTitle]}>Nueva Campaña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={'nombre de la campaña'}
                        placeholderTextColor={'lightgray'}
                        maxLength={30}
                        onChangeText={(text) => setName(text)}
                        keyboardType='twitter'
                        value={name}
                        />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={[styles.modalButton]} onPress={() =>  setIsVisibleModal(false)}>
                            <Text style={[styles.modalButtonText, {color: 'red'}]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton]} onPress={() => handleCreateCampaign()}>
                            <Text style={[styles.modalButtonText, {color: '#27DB7E'}]}>Crear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    baseBackgorund: {
        flex:1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        marginVertical: '6%',
        marginHorizontal: '4%',
        padding: '5%',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 15,
        elevation: 5
    },
    modalTitle: {
        fontSize: 18,
        marginVertical: '2%',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalDescriptionText: {
        fontSize: 16,
        textAlign: 'justify'
    },
    input: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 50,
    },
    modalButton: {
        marginTop: 10,
        width: '40%',
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center'
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})