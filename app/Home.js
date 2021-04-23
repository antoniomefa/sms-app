import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import {check, request, RESULTS, PERMISSIONS} from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import SmsAndroid from 'react-native-get-sms-android';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretDown, faCaretUp, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'

import Loading from './components/Loading';
import GlobalContext from './context/globalContext';

export default function Home() {
  const globalContext = useContext(GlobalContext);
  const [phone, setPhone] = useState('');
  const [minFilter, setMinFilter] = useState('');
  const [maxFilter, setMaxFilter] = useState('');
  const [message, setMessage] = useState('');
  const [moreOptions, setMoreOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const [isSending, setIsSending] = useState(false);
  const [counter, setCounter] = useState(0);
  const [errorsCounter, setErrorsCounter] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const getContactsPermission = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contactos',
          'message': 'Esta App requiere acceso a tu lista de contactos.',
          'buttonPositive': 'Aceptar'
        }
      );
      switch (checkPermission) {
        case RESULTS.DENIED:
          const requestResult = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
          return Promise.resolve(requestResult);
        case RESULTS.GRANTED:
          return Promise.resolve(checkPermission);
        default:
          return Promise.reject();
      }
    } catch (err) {
      console.log(err);
    }
  }

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
      console.log(err);
    }
  };

  const getContacts = async () => {
    try {
      await getContactsPermission();
      Contacts.getAll().then(async (contacts) => {
        if (contacts.length > 0) {
          let phonesArray = [];
          for (let i=0; i<=contacts.length-1; i++){
            if (contacts[i].phoneNumbers.length == 1) {
              if (contacts[i].phoneNumbers[0].number.length > 9) {
                phonesArray.push(contacts[i].phoneNumbers[0].number)
              }
            }
            if (contacts[i].phoneNumbers.length > 1) {
              for (let j=0; j<=contacts[i].phoneNumbers.length-1; j++) {
                if (contacts[i].phoneNumbers[j].number.length > 9) {
                  phonesArray.push(contacts[i].phoneNumbers[j].number)
                }
              }
            }
            setIsLoading(false);
            await globalContext.setContacts(phonesArray);
            setMoreOptions(false);
          }
        }
      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const validatePhoneNumber = (number) => {
    const regex1 = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    const regex2 = /^\(?(\d{3})\)?[- ]?(\d{4})[- ]?(\d{3})$/;
    const regex3 = /^\(?(\d{2})\)?[- ]?(\d{4})[- ]?(\d{4})$/;
    const regex4 = /^\(?(\d{4})\)?[- ]?(\d{2})[- ]?(\d{4})$/;
    const regex5 = /^\(?(\d{2})\)?[- ]?(\d{2})[- ]?(\d{2})[- ]?(\d{2})[- ]?(\d{2})$/;
    const result = regex1.test(String(number).toLocaleLowerCase()) || regex2.test(String(number).toLocaleLowerCase()) ||
                   regex3.test(String(number).toLocaleLowerCase()) || regex4.test(String(number).toLocaleLowerCase()) ||
                   regex5.test(String(number).toLocaleLowerCase())
    return result;
  }

  const onAddPhoneNumber = () => {
    const tempArray = globalContext.contacts;
    if(phone.length < 10) {
        Alert.alert('El número debe tener 10 dígitos.')
        return false
    } else if (!validatePhoneNumber(phone)) {
        Alert.alert('Formato de teléfono no válido')
        return false
    } else {
        tempArray.push(phone);
        globalContext.setContacts(tempArray);
        setPhone('');
        return true
    }
  }

  const onFilter = () => {
    if (minFilter > maxFilter || minFilter > globalContext.contacts.length || maxFilter > globalContext.contacts.length) {
      Alert.alert('Filtros erroneos', 'Ingresa un número menor')
    } else {
      let tempArray = globalContext.contacts;
      let filteredArray = tempArray.slice(minFilter-1, maxFilter);
      globalContext.setContacts(filteredArray);
    }
  }

  const onSendSMS = async () => {
    if (globalContext.contacts.length < 1 || message.length < 1) {
      Alert.alert('Falta información', 'Agrega por lo menos un destinatario y escribe el mensaje a enviar.')
    } else {
      Alert.alert(
        `Enviar ${globalContext.contacts.length} mensajes`,
        `Confirma que deseas enviar el mensaje a todos los destinatarios.`,
        [
            {
                text: 'Cancelar',
                onPress: () => {}
            },
            {
                text: 'Confirmar',
                onPress: () => sendSMS()
            }
        ]
      )
    }
  }

  const sendSMS = async () => {
    setIsFinished(false);
    setIsSending(true);
    setLoadingText('Enviando...');
    await setIsLoading(true);
    try {
      await getSMSPermission();
      //const CONTACTOS_DE_PRUEBA = ['7445070063']
      for(let i=0; i<=globalContext.contacts.length-1; i++) {
        SmsAndroid.autoSend(
          globalContext.contacts[i],
          message,
          (fail) => {
            //console.log('Failed with this error: ' + fail);
            setErrorsCounter(errorsCounter+1);
          },
          (success) => {
            setCounter(counter+1);
            //console.log('SMS sent successfully');
          },
        );
      }
    } catch (err) {
      console.log(err)
      Alert.alert('Error de envío')
    }
    setIsLoading(false);
    setIsSending(false);
    setIsFinished(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>ENVÍO DE MENSAJES SMS MASIVOS</Text>
        <ScrollView>
        <TouchableOpacity style={styles.buton} onPress={() => {setIsLoading(true); setLoadingText('Leyendo contactos...'); getContacts()}}>
          <Text style={styles.textButon}>Leer contactos del teléfono</Text>
        </TouchableOpacity>

        <View style={[styles.row, {justifyContent: 'flex-start'}]}>
          <Text style={styles.label}>Mas opciones</Text>
          <TouchableOpacity onPress={() => setMoreOptions(!moreOptions)}>
            <FontAwesomeIcon icon={ moreOptions ? faCaretUp : faCaretDown } size={ 30 }/>
          </TouchableOpacity>
        </View>
        {
          moreOptions &&
          <>
          <Text style={styles.label2}>Agregar número a la lista:</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.contactsInput}
              placeholder={'Phone number'}
              onChangeText={setPhone}
              keyboardType='phone-pad'
              value={phone}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => onAddPhoneNumber()}>
              <Text style={styles.textButon}>
                <FontAwesomeIcon icon={ faPlus } size={ 16 } color={'#fff'}/>
              </Text>
            </TouchableOpacity>
          </View>
          
          
          <View style={styles.row}>
          <Text style={styles.label2}>Filtrar del:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'1'}
              onChangeText={setMinFilter}
              keyboardType='phone-pad'
              value={minFilter}
            />
            <Text style={styles.label2}>al:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'1000'}
              onChangeText={setMaxFilter}
              keyboardType='phone-pad'
              value={maxFilter}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => onFilter()}>
              <Text style={styles.textButon}>
                <FontAwesomeIcon icon={ faFilter } size={ 16 } color={'#fff'}/>
              </Text>
            </TouchableOpacity>
          </View>
          </>
        }
        

        <View style={{alignSelf: 'flex-end', marginTop: 15}}>
          <Text style={styles.label}>Destinatarios: {globalContext.contacts.length}</Text>
        </View>

        <Text style={styles.label}>Mensaje:</Text>
        <TextInput
          style={styles.messageInput}
          multiline={true}
          placeholder={'Message'}
          onChangeText={setMessage}
          value={message}
        />
        <Text style={{alignSelf: 'flex-end'}}>Caracteres restantes: {140 - message.length}</Text>

        <TouchableOpacity style={styles.buton} onPress={() => onSendSMS()}>
          <Text style={styles.textButon}>Enviar SMS</Text>
        </TouchableOpacity>

        {
          isFinished &&
          <View style={{alignSelf: 'center', marginTop: 15}}>
            <Text style={styles.title}>Resultado:</Text>
            <Text style={styles.label}>Total destinatarios: {globalContext.contacts.length}</Text>
            <Text style={styles.label}>Mensajes enviados: {counter}</Text>
            <Text style={styles.label}>Mensajes no enviados: {errorsCounter}</Text>
          </View>
        }
        </ScrollView>
      </View>
      {
        isLoading &&
        <Loading 
          isVisible={true} 
          text={loadingText} 
          counter={counter}
          errors={errorsCounter}
          total={globalContext.contacts.length}
          isSending={isSending}
        />
      }
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
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 18
  },
  label2: {
    fontSize: 16
  },
  contactsInput: {
    color: 'blue',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 50,
  },
  addButon: {
    marginLeft: 20,
    borderRadius: 50,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27DB7E'
  },
  filterInput: {
    color: 'blue',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
    width: '25%',
    borderRadius: 50,
  },
  messageInput: {
    color: 'black',
    fontSize: 16,
    borderRadius: 15,
    backgroundColor: '#fff',
    height: 150,
    marginBottom: 5,
  },
  buton: {
    marginVertical: 15,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#27DB7E'
  },
  textButon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});