import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function ContactItem({contactData, recipients, onSelectContact, onDeselectContact}) {
    const [isSelected, setIsSelected] = useState(false);

    const handleSelection = (contactData) => {
        const isAlreadyIncluded = validateIsSelected(contactData.recordID);
        if (isAlreadyIncluded) {
            setIsSelected(false);
            onDeselectContact(contactData);
        } else {
            setIsSelected(true);
            onSelectContact(contactData);
        }
      }
    
      const validateIsSelected = (id) => {
        for (let i=0; i<= recipients.length-1; i++) {
          if (recipients[i].recordID == id) {
            return true;
          }
        }
        return false;
      }

    return (
        <TouchableOpacity
            style={[styles.container, {backgroundColor:  isSelected? 'lightgray' : '#fff'}]}
            onPress={() => handleSelection(contactData)}
            key={contactData.recordID}
        >
            <View style={styles.contactRow}>
                <View style={[styles.circle, {backgroundColor: isSelected? '#27DB7E' : 'orange' }]}>
                    <Text style={styles.initial}>{isSelected? '✓' : contactData.givenName[0]}</Text>
                </View>
                <View style={styles.contactColumn}>
                    <Text style={[styles.nameText]}>
                        {contactData.givenName && contactData.givenName}{contactData.middleName && ' '+contactData.middleName} {contactData.familyName && contactData.familyName}
                        </Text>
                    <View style={styles.infoRow}>
                        {
                            contactData.phoneNumbers.map((record, index) => {
                                return (
                                    <Text key={index} style={[styles.descriptionText]}>
                                        {record.number}{contactData.phoneNumbers[index+1] ? ' | ' : ''} 
                                    </Text>
                                )
                            })
                        }                
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(ContactItem, (prevProps, nextProps) => { return prevProps.recipients === nextProps.recipients});

const styles=StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 50
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    circle: {
        borderRadius: 100,
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
    contactColumn: {
        marginLeft: '2%'
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    descriptionText: {
        fontSize: 14
    },
    infoRow: {
        flexDirection: 'row'
    }
})