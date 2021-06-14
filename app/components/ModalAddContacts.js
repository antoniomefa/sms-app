import React from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function ModalAddContacts(props) {
    const { isVisibleModal, setIsVisibleModal, recipients, repeated, registered, handleAddRecipientsSelected} = props;

    return (
        <Modal
            visible={isVisibleModal}
            transparent={true}
            animationType='fade'
            onRequestClose={() => setIsVisibleModal(false)}
        >
            <View style={styles.baseBackgorund}>
                <View style={[styles.modalContainer, {backgroundColor: '#fff'}]}>
                    <ScrollView>
                        <Text style={[styles.modalTitle]}>
                            {recipients.length} contacto{recipients.length>1 && 's'} seleccionado{recipients.length>1 && 's'}
                        </Text>

                        <Text style={[styles.modalDescriptionText]}>{registered + repeated} Números registrados</Text>
                        <Text style={[styles.modalDescriptionText]}>{repeated} Números repetidos</Text>
                        <Text style={[styles.modalDescriptionText]}>Se agregarán {registered} números</Text>
                        
                    </ScrollView>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={[styles.modalButton]} onPress={() => setIsVisibleModal(false)}>
                            <Text style={[styles.modalButtonText, {color: 'red'}]}>Volver</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton]} onPress={() => handleAddRecipientsSelected()}>
                            <Text style={[styles.modalButtonText, {color: '#27DB7E'}]}>Agregar</Text>
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
        textAlign: 'center',
        fontSize: 16
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