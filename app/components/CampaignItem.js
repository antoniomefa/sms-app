import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CampaignItem({campaignData, setCampaignSelected, setIsVisibleModal}) {

    const onCovenantSelected = () => {
        setCampaignSelected(campaignData)
        setIsVisibleModal(true)
    }

    return (
        <TouchableOpacity 
            style={[styles.container]}
            onPress={() => onCovenantSelected()}
        >
            <View style={styles.infoRow}>
                <Text style={[styles.titleText]}>{campaignData.name}</Text>
                <Text style={[styles.descriptionText]}>{campaignData.date}</Text>
            </View>
            <Text style={[styles.descriptionText]}>{campaignData.recipients.length} contactos</Text>
            <Text style={[styles.descriptionText]}>{campaignData.counter} mensajes enviados</Text>
            <Text style={[styles.descriptionText]}>{campaignData.errorsCounter} mensajes no enviados</Text>
        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
    container: {
        marginVertical: '4%',
        paddingVertical: '2%',
        paddingHorizontal: '4%',
        borderRadius: 15,
        backgroundColor: '#fff'
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    descriptionText: {
        fontSize: 16
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})