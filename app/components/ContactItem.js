import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ContactItem({contactData, setContactsSelected}) {

    const onContactSelected = () => {
        setContactsSelected(contactData)
    }

    return (
        <TouchableOpacity 
            style={[styles.container]}
            onPress={() => onContactSelected()}
        >
            <View style={styles.infoRow}>
                <View style={styles.circle}>
                    <Text style={styles.initial}>{contactData.givenName[0]}</Text>
                </View>
                <Text style={[styles.titleText]}>{contactData.givenName} {contactData.familyName}</Text>
                <View style={styles.infoRow}>
                    {
                        contactData.phoneNumbers.map((record, index) => {
                            return (
                                <Text key={index} style={[styles.descriptionText]}>{record.number} | </Text>
                            )
                        })
                    }                
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
    container: {
        marginVertical: '1%',
        paddingVertical: '2%',
        paddingHorizontal: '4%',
        borderRadius: 50,
        backgroundColor: '#fff'
    },
    circle: {
        borderRadius: 100,
        backgroundColor: 'orange',
        height: 40,
        width: 40
    },
    initial: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        height: 40,
        textAlignVertical: 'center'
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
    }
})