import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import SmsAndroid from 'react-native-get-sms-android';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretDown, faCaretUp, faFilter, faPlus, faStopwatch, faTrash } from '@fortawesome/free-solid-svg-icons';

import { AdView } from './components/ads/AdView';
import { saveCampaign } from './store/CampaignStore';
import Loading from './components/Loading';
import ContactsRecipients from './components/ContactsRecipients';
import GlobalContext from './context/globalContext';

export default function NewCampaign({ route, navigation }) {
  const globalContext = useContext(GlobalContext);
  const { name } = route.params;
  const scrollViewRef = useRef();
  const [minFilter, setMinFilter] = useState('');
  const [maxFilter, setMaxFilter] = useState('');
  const [timeInterval, setTimeInterval] = useState('1');
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableOpacity onPress={() => {clearData(); setMessage('');}}>
            <Text style={styles.textTopBar}>Limpiar datos</Text>
          </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    clearData();
    const prevCampaign = route.params;
    (async () => {
      if(prevCampaign.recipients) {
        await globalContext.setContacts(prevCampaign.recipients)
      }
      if(prevCampaign.manualContacts) {
        setManualContacts(prevCampaign.manualContacts)
      }
      if(prevCampaign.timeInterval) {
        setTimeInterval(prevCampaign.timeInterval)
      }
      if(prevCampaign.message) {
        setMessage(prevCampaign.message)
      }
    })()
  }, [])

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
      Alert.alert('No tienes permisos de SMS','No se han otorgado permisos para acceder al env??o y lectura de SMS del dispositivo.');
    }
  };

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
    let contactsTemp = manualContacts;
    let tempArray = globalContext.contacts;
    if(phone.length < 10) {
        Alert.alert('El n??mero debe tener 10 d??gitos.')
        return false
    } else if (!validatePhoneNumber(phone)) {
        Alert.alert('Formato de tel??fono no v??lido')
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
      Alert.alert('Filtros erroneos', 'Ingresa un n??mero menor')
    } else {
      let tempArray = globalContext.contacts;
      let filteredArray = tempArray.slice(minFilter-1, maxFilter);
      globalContext.setContacts(filteredArray);
    }
  }

  const onSendSMS = () => {
    if (globalContext.contacts.length < 1 || message.length < 1) {
      Alert.alert('Falta informaci??n', 'Agrega por lo menos un destinatario y escribe el mensaje a enviar.')
    } else {
      Alert.alert(
        `Enviar ${globalContext.contacts.length} mensajes`,
        `Confirma que deseas enviar el mensaje a todos los destinatarios a un intervalo de ${timeInterval} segundos entre cada env??o.`,
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
      await getSMSPermission();
      await sendSMS();
    } catch (err) {
      console.log(err);
      Alert.alert('Error de env??o');
      setIsLoading(false);
      setIsSending(false);
      setIsFinished(true);
    }
  };

  const sendSMS = async () => {
    let increment = 0;
    let interval = 1000 * parseInt(timeInterval);
    let sentCounter = 0;
    let sentErrors = 0;
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
          sentErrors++;
          setErrorsCounter(errors => errors + 1 );
        },
        (success) => {
          sentCounter++;
          setCounter(counter => counter + 1 );
        },
      );
      if (increment == globalContext.contacts.length-1) {
        sentCounter++; // Contador sobeescrito debido al asincronismo del ??ltuno success
        clearInterval(myLoop);
        setIsSending(false);
        setIsFinished(true);
        setIsLoading(false);
        await updateCampaigns(sentCounter, sentErrors);
      }
      increment++;
    }, interval);
  };

  const updateCampaigns = async (sentCounter, sentErrors) => {
    let tempCampaigns = globalContext.campaigns;
    const date = new Date();
    const newCampaign = {
      id: date.getTime(),
      name,
      recipients: globalContext.contacts,
      manualContacts,
      timeInterval,
      message, 
      counter: sentCounter,
      errorsCounter: sentErrors,
      date: date.toLocaleDateString(),
      hour: date.toLocaleTimeString()
    };
    tempCampaigns.push(newCampaign);
    saveCampaign(tempCampaigns);
    globalContext.setUpdate(newCampaign);
  };

  const clearData =  () => {
    globalContext.setContacts([]);
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
        
        <ScrollView  
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity style={styles.buton} onPress={() => { navigation.navigate('Contacts-List') }}>
          <Text style={styles.textButon}>Agregar destinatarios</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={[styles.row, {justifyContent: 'flex-start'}]}>
            <Text style={styles.label}>{moreOptions ? 'Menos' : 'M??s'} opciones</Text>
            <TouchableOpacity onPress={() => setMoreOptions(!moreOptions)}>
              <FontAwesomeIcon icon={ moreOptions ? faCaretUp : faCaretDown } size={30}/>
            </TouchableOpacity>
          </View>
         
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

          <Text style={styles.label2}>Agregar n??mero al final de la lista:</Text>
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
          <Text style={styles.label2}>Tiempo estimado de env??o: {calculateTime()}</Text>
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
      <View style={styles.adContainer}>
        <AdView type="image" media={false} />
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
  textTopBar: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27DB7E'
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
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
  },
  adContainer: {
    backgroundColor: 'lightgray'
  }
});