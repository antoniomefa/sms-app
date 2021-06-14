import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';

export default function ModalEditCampaign(props) {
    const { isVisibleModal, setIsVisibleModal, campaignSelected, onDeleteCampaign, navigation} = props;

    const handleDeleteCampaign = () => {
        Alert.alert('Eliminar Campaña', `Confirma que deseas eliminar ${campaignSelected.name}`,
        [
            {
              text: "NO",
              onPress: () => setIsVisibleModal(false),
              style: "cancel"
            },
            { text: "SI", onPress: () => {setIsVisibleModal(false); onDeleteCampaign()} }
          ]
        )
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
                    <View style={{justifyContent: 'center'}}>
                        <Text style={[styles.modalTitle]}>{campaignSelected.name}</Text>
                        <Text style={[styles.modalDescriptionText]}>Fecha de envío: {campaignSelected.date} {campaignSelected.hour}</Text>
                        <Text style={[styles.modalDescriptionText]}>Total de contactos:{`\t\t\t\t\t`}{campaignSelected.recipients.length}</Text>
                        <Text style={[styles.modalDescriptionText]}>Mensajes enviados:{`\t\t\t\t`}{campaignSelected.counter}</Text>
                        <Text style={[styles.modalDescriptionText]}>Mensajes no enviados: {campaignSelected.errorsCounter}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={[styles.modalButton]} onPress={() => handleDeleteCampaign()}>
                            <Text style={[styles.modalButtonText, {color: 'red'}]}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton]}
                            onPress={() => {
                                setIsVisibleModal(false);
                                navigation.navigate('New-Campaign', {
                                    id: campaignSelected.id,
                                    name: campaignSelected.name,
                                    recipients: campaignSelected.recipients,
                                    manualContacts: campaignSelected.manualContacts,
                                    timeInterval: campaignSelected.timeInterval,
                                    message: campaignSelected.message, 
                                    counter: campaignSelected.counter,
                                    errorsCounter: campaignSelected.errorsCounter,
                                    date: campaignSelected.date,
                                    hour: campaignSelected.hour
                                })}}
                        >
                            <Text style={[styles.modalButtonText, {color: '#27DB7E'}]}>Reenviar</Text>
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