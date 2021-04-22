import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  Text,
  TextInput,
} from 'react-native';
import {check, request, RESULTS, PERMISSIONS} from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import SmsAndroid from 'react-native-get-sms-android';

const App: () => React$Node = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Happy new year!');

  

  const getSMSPermission = async () => {
    try {
      const checkResult = await check(PERMISSIONS.ANDROID.SEND_SMS);
      switch (checkResult) {
        case RESULTS.DENIED:
          const requestResult = await request(PERMISSIONS.ANDROID.SEND_SMS);
          return Promise.resolve(requestResult);
        case RESULTS.GRANTED:
          return Promise.resolve(checkResult);
        default:
          return Promise.reject();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const sendSMS = async () => {
    try {
      await getSMSPermission();
      for(let i=0; i<=2; i++) {
        SmsAndroid.autoSend(
          phoneNumber,
          message,
          (fail) => {
            console.log('Failed with this error: ' + fail);
          },
          (success) => {
            console.log('SMS sent successfully');
          },
        );
      }
    } catch (err) {
      // console.log(err)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Envia un SMS a TODOS tus contactos:</Text>

        <View style={styles.buton}>
          <Button onPress={sendSMS} title="Leer contactos" />
        </View>

        <Text style={styles.label}>Destinatarios:</Text>
        <TextInput
          style={styles.contactsInput}
          placeholder={'Phone number'}
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />

        <Text style={styles.label}>Mensaje:</Text>
        <TextInput
          style={styles.messageInput}
          multiline={true}
          placeholder={'Message'}
          onChangeText={setMessage}
          value={message}
        />

        <View style={styles.buton}>
          <Button style={styles.buton} onPress={sendSMS} title="Enviar SMS" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  form: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18
  },
  contactsInput: {
    color: 'blue',
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  messageInput: {
    color: 'black',
    fontSize: 16,
    backgroundColor: '#fff',
    height: 150,
    marginBottom: 5,
  },
  buton: {
    marginVertical: 15
  }
});

export default App;