import React from 'react';
import { View, Text } from 'react-native';

  export default function ContactsRecipients({contacts}) {
      return (
        <View style={{alignSelf: 'flex-end', marginTop: 15}}>
            <Text style={{fontSize: 18}}>Destinatarios: {contacts.length}</Text>
        </View>
      )
  }