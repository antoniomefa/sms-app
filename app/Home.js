import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert
} from 'react-native';
import {check, request, RESULTS, PERMISSIONS} from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import SmsAndroid from 'react-native-get-sms-android';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretDown, faCaretUp, faFilter, faPlus, faStopwatch, faTrash } from '@fortawesome/free-solid-svg-icons'

import Loading from './components/Loading';
import ContactsRecipients from './components/ContactsRecipients';
import GlobalContext from './context/globalContext';

export default function Home() {
  const globalContext = useContext(GlobalContext);
  const [minFilter, setMinFilter] = useState('');
  const [maxFilter, setMaxFilter] = useState('');
  const [timeInterval, setTimeInterval] = useState('0');
  const [blocksDivided, setBlocksDivided] = useState('1');
  const [blocksInterval, setBlocksInterval] = useState('0');
  const [isBlocksDivided, setIsBlocksDivided] = useState(false);

  const [phone, setPhone] = useState('');
  const [manualContacts, setManualContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [moreOptions, setMoreOptions] = useState(false);
  const [isSetTime, setIsSetTime] = useState(false);
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
      Alert.alert('No tienes permisos de SMS','No se han otorgado permisos para acceder al envío y lectura de SMS del dispositivo.');
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
            await globalContext.setContacts(phonesArray);
            setIsLoading(false);
            setMoreOptions(false);
          }
        }
      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const calculateTime = () => {
    let interval = parseInt(timeInterval);
    let timeElapsed = 1000 * globalContext.contacts.length;
    timeElapsed = timeElapsed * interval;
    var ms = timeElapsed % 1000;
    timeElapsed = (timeElapsed - ms) / 1000;
    var secs = timeElapsed % 60;
    timeElapsed = (timeElapsed - secs) / 60;
    var mins = timeElapsed % 60;
    var hrs = (timeElapsed - mins) / 60;
    return hrs + ':' + mins + ':' + secs;
  }

  const handleTimeInterval = (time) => {
    setIsSetTime(false);
    let interval = parseInt(time);
    if (time == '') {
      setTimeInterval(time)
    } else if (!Number.isInteger(interval)) {
      time = '0';
    }
    setTimeInterval(time)
  }

  const handleBlocksInterval = (time) => {
    setIsBlocksDivided(false);
    let interval = parseInt(time);
    if (time == '' || time.length < 1) {
      setBlocksInterval('0')
    } else if (!Number.isInteger(interval)) {
      time = '0';
    }
    setBlocksInterval(time)
  }

  const handleBlocksDivided = (blocks) => {
    setIsBlocksDivided(false);
    let blocksNumber = parseInt(blocks);
    if (blocks == '' || blocks.length < 1) {
      setBlocksDivided('1')
    } else if (!Number.isInteger(blocksNumber)) {
      blocks = '1';
    }
    setBlocksDivided(blocks)
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

  const onAddPhoneNumber = async () => {
    let contactsTemp = manualContacts;
    let tempArray = globalContext.contacts;
    if(phone.length < 10) {
        Alert.alert('El número debe tener 10 dígitos.')
        return false
    } else if (!validatePhoneNumber(phone)) {
        Alert.alert('Formato de teléfono no válido')
        return false
    } else {
        tempArray.push(phone);
        contactsTemp.push(phone)
        globalContext.setContacts(tempArray);
        setManualContacts(contactsTemp);
        setPhone('');
        return true
    }
  }

  const onDropPhoneNumber = async (number) => {
    let contactsTemp = manualContacts;
    let tempArray = globalContext.contacts;
    const result1 = await tempArray.filter((contact) => {
      if (contact !== number.contact) {
        return true;
      }}
      )
    const result2 = await contactsTemp.filter((contact) => {
      if (contact !== number.contact) {
        return true;
      }}
      )
    globalContext.setContacts(result1);
    setManualContacts(result2)
  }

  const onFilter = () => {
    let minFilterNumber = parseInt(minFilter);
    let maxFilterNumber = parseInt(maxFilter);
    if (minFilterNumber > maxFilterNumber || minFilterNumber > globalContext.contacts.length || maxFilterNumber > globalContext.contacts.length) {
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
        `Confirma que deseas enviar el mensaje a todos los destinatarios a un intervalo de ${timeInterval} segundos entre cada envío.`,
        [
            {
                text: 'Cancelar',
                onPress: () => {}
            },
            {
                text: 'Confirmar',
                onPress: () => handleSMS()
            }
        ]
      )
    }
  }

  const handleSMS = async () => {
    try {
      //const CONTACTOS_DE_PRUEBA = ['7445070063', '7445070063', '7445070063', '7445070063', '7445070063', '7445070063', '7445070063','7445070063', '7445070063', '7445070063']
      setCounter(0);
      setErrorsCounter(0);
      await getSMSPermission();
      await sendSMS()
    } catch (err) {
      console.log(err);
      Alert.alert('Error de envío');
      setIsLoading(false);
      setIsSending(false);
      setIsFinished(true);
    }
  };

  const sendSMS = async () => {
    let increment = 0;
    let interval = 1000 * parseInt(timeInterval);
    setIsFinished(false);
    setIsSending(true);
    setLoadingText('Enviando...');
    setIsLoading(true);

    var myLoop = setInterval(async function(){
      await SmsAndroid.autoSend(
        globalContext.contacts[increment],
        message,
        (fail) => {
          console.log('Failed with this error: ' + fail);
          setErrorsCounter(errorsCounter => errorsCounter + 1);
        },
        (success) => {
          setCounter(counter => counter + 1);
          //console.log('SMS sent successfully');
        },
      );
      if (increment == globalContext.contacts.length-1) {
        clearInterval(myLoop);
        setIsLoading(false);
        setIsSending(false);
        setIsFinished(true);
      }
      increment++;
    }, interval);
  };

  const clearData = async () => {
    await globalContext.setContacts([]);
    setCounter(0);
    setErrorsCounter(0);
    setMinFilter('');
    setMaxFilter('');
    setManualContacts([]);
    setIsFinished(false);
    setIsSending(false);
    setIsSetTime(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>ENVÍO MASIVO DE MENSAJES SMS</Text>
        <ScrollView>
        <TouchableOpacity style={styles.buton} onPress={() => {setIsLoading(true); setLoadingText('Leyendo contactos...'); clearData(); getContacts(); }}>
          <Text style={styles.textButon}>Leer contactos del teléfono</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={[styles.row, {justifyContent: 'flex-start'}]}>
            <Text style={styles.label}>{moreOptions ? 'Menos' : 'Más'} opciones</Text>
            <TouchableOpacity onPress={() => setMoreOptions(!moreOptions)}>
              <FontAwesomeIcon icon={ moreOptions ? faCaretUp : faCaretDown } size={30}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.buton} onPress={() => {clearData(); setMessage('');}}>
            <Text style={styles.textButon}>Limpiar datos</Text>
          </TouchableOpacity>
        </View>
        {
          moreOptions &&
          <>
          <View style={styles.row}>
          <Text style={styles.label2}>Filtrar del:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'1'}
              maxLength={5}
              onChangeText={(text) => setMinFilter(text)}
              keyboardType='number-pad'
              value={minFilter}
            />
            <Text style={styles.label2}>al:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'999'}
              maxLength={5}
              onChangeText={(text) => setMaxFilter(text)}
              keyboardType='number-pad'
              value={maxFilter}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => onFilter()}>
                <FontAwesomeIcon icon={ faFilter } size={18} color={'#fff'}/>
            </TouchableOpacity>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.label2, {flex: 1}]}>Intervalo en segundos entre cada mensaje:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'1'}
              maxLength={2}
              onChangeText={(text) => handleTimeInterval(text)}
              keyboardType='number-pad'
              value={timeInterval}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => setIsSetTime(true)}>
                <FontAwesomeIcon icon={ faStopwatch } size={20} color={'#fff'}/>
            </TouchableOpacity>
          </View>

         {/*  <View style={styles.row}>
            <Text style={[styles.label2, {flex: 1}]}>Dividir los envíos en bloques:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'1'}
              maxLength={2}
              onChangeText={(text) => handleBlocksDivided(text)}
              keyboardType='number-pad'
              value={blocksDivided}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => setIsBlocksDivided(true)}>
                <FontAwesomeIcon icon={ faDivide } size={20} color={'#fff'}/>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label2, {flex: 1}]}>Intervalo en segundos entre cada bloque:</Text>
            <TextInput
              style={styles.filterInput}
              placeholder={'1'}
              maxLength={2}
              onChangeText={(text) => handleBlocksInterval(text)}
              keyboardType='number-pad'
              value={blocksInterval}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => setIsBlocksDivided(true)}>
                <FontAwesomeIcon icon={ faStopwatch } size={20} color={'#fff'}/>
            </TouchableOpacity>
          </View> */}

          <Text style={styles.label2}>Agregar número al final de la lista:</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.contactsInput}
              maxLength={15}
              placeholder={'Phone number'}
              onChangeText={(text) => setPhone(text)}
              keyboardType='phone-pad'
              value={phone}
            />
            <TouchableOpacity style={styles.addButon} onPress={() => onAddPhoneNumber()}>
                <FontAwesomeIcon icon={ faPlus } size={20} color={'#fff'}/>
            </TouchableOpacity>
          </View>
          </>
        }
        <View style={styles.card}>
        {
          manualContacts.length > 0 &&
          manualContacts.map((contact, index) => {
              return(
                <View key={index} style={styles.row}>
                  <Text style={styles.label2}>{contact}</Text>
                  <TouchableOpacity onPress={() => onDropPhoneNumber({contact})}>
                    <FontAwesomeIcon icon={ faTrash } size={20} color={'red'}/>
                  </TouchableOpacity>
                </View>
              )
            }
          )
        }
        </View>
        {
          timeInterval !== '' && isSetTime &&
          <Text style={styles.label2}>Tiempo estimado de envío: {calculateTime()}</Text>
        }

        <ContactsRecipients contacts={globalContext.contacts}/>

        <Text style={styles.label}>Mensaje:</Text>
        <TextInput
          style={styles.messageInput}
          multiline={true}
          placeholder={'Message'}
          onChangeText={setMessage}
          value={message}
        />
        <Text style={[styles.label2, {alignSelf: 'flex-end'}]}>Caracteres restantes: {160 - message.length}</Text>

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
  card: {
    backgroundColor: 'lightgray',
    borderRadius: 15,
    paddingHorizontal: '4%'
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
    height: 100,
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