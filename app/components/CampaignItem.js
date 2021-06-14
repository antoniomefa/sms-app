import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CampaignItem({campaignData, setCampaignSelected, setIsVisibleModal}) {

    const onCampaignSelected = () => {
        setCampaignSelected(campaignData)
        setIsVisibleModal(true)
    }

    return (
        <TouchableOpacity 
            style={[styles.container]}
            onPress={() => onCampaignSelected()}
        >
            <View style={styles.infoRow}>
                <Text style={[styles.titleText]}>{campaignData.name}</Text>
                <Text style={[styles.titleText]}>{campaignData.recipients.length} contactos</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={[styles.descriptionText]}>{campaignData.date}</Text>
                <Text style={[styles.descriptionText]}>{campaignData.hour}</Text>
            </View>                
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
        justifyContent: 'space-between',
        marginVertical: '1%'
    }
})