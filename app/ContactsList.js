import React, {useState, useContext, useEffect, useLayoutEffect, useCallback} from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import ContactItem from './components/ContactItem';
import { AdView } from './components/ads/AdView';
import Loading from './components/Loading';
import ModalAddContact from './components/ModalAddContacts';
import GlobalContext from './context/globalContext';

export default function ContactsList({ route, navigation }) {
  const globalContext = useContext(GlobalContext);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [registered, setRegistered] = useState(0);
  const [repeated, setRepeated] = useState(0);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const ITEM_HEIGHT = 52;

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //         <TouchableOpacity onPress={() => {onSelectAllContact();  }}>
  //           <Text style={styles.textTopBar}>Seleccionar Todos</Text>
  //         </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setLoadingText('Leyendo contactos...');
      await getContacts();
    })()
  }, [])

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

  const getContacts = async () => {
    try {
      await getContactsPermission();
      Contacts.getAllWithoutPhotos().then( contacts => {
        contacts.forEach(contact => {
          delete contact.rawContactId;
          delete contact.note;
          delete contact.backTitle;
          delete contact.company;
          delete contact.emailAddresses;
          delete contact.jobTitle;
          delete contact.hasThumbnail;
          delete contact.thumbnailPath;
          delete contact.postalAddresses;
          delete contact.prefix;
          delete contact.suffix;
          delete contact.department;
          delete contact.birthday;
          delete contact.imAddresses;
          delete contact.urlAddresses;
        })
        setPhoneContacts(contacts);
        setIsLoading(false);
      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const onSelectContact = async (contactData) => {
    let contactList = recipients;
    contactList.push(contactData);
    await setRecipients(contactList);
  }

  const onDeselectContact = async (contactData) => {
    let contactList = recipients;
    contactList = contactList.filter((contact) => contact !== contactData);
    await setRecipients(contactList);
  }

  // const onSelectAllContact = () => {
  //   setLoadingText('Obteniendo los números...');
  //   setIsLoading(value => value=true);
  //   setRecipients(phoneContacts);
  //   setIsLoading(value => value=false);
  //   setIsVisibleModal(true);    
  // }

  const onAddRecipientsSelected = () => {
    let counterRepeated = 0;
    let counterRegistered = 0;
    if (recipients.length > 0) {
      let phonesArray = [];
      for (let i=0; i<=recipients.length-1; i++) {
        if (recipients[i].phoneNumbers.length == 1) {
          if (recipients[i].phoneNumbers[0].number.length > 9) {
            if (phonesArray.includes(recipients[i].phoneNumbers[0].number)) {
              counterRepeated ++;
            } else {
              counterRegistered ++;
              phonesArray.push(recipients[i].phoneNumbers[0].number)
            }
          }
        }
        if (recipients[i].phoneNumbers.length > 1) {
          for (let j=0; j<=recipients[i].phoneNumbers.length-1; j++) {
            if (recipients[i].phoneNumbers[j].number.length > 9) {
              if (phonesArray.includes(recipients[i].phoneNumbers[j].number)) {
                counterRepeated ++;
              } else {
                counterRegistered ++;
                phonesArray.push(recipients[i].phoneNumbers[j].number)
              }
            }
          }
        }
        globalContext.setContacts([...globalContext.contacts, ...phonesArray]);
        setRepeated(counterRepeated);
        setRegistered(counterRegistered);
      }
    }
  }

  const handleAddRecipientsSelected = () => {
    setPhoneContacts([]);
    setRecipients([]);
    setRegistered([]);
    setRepeated([]);
    navigation.goBack();
  }

  renderItem = ({item}) => <ContactItem contactData={item} recipients={recipients} onSelectContact={onSelectContact} onDeselectContact={onDeselectContact} key={item.recordID}/>;

  // const getItemLayout = useCallback((data, index) => ({length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}), []);

  const keyExtractor = useCallback(item => item.recordID.toString(), []);
              
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.form}>
      {
        phoneContacts && phoneContacts.length > 0 ?
        <>
          <FlatList
            data={ phoneContacts.sort((a, b) => a.givenName.localeCompare(b.givenName))}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            extraData={recipients}
            // initialNumToRender={15}
            // maxToRenderPerBatch={15}
            // windowSize={21}
            removeClippedSubviews={true}
            // getItemLayout={getItemLayout}
          />
          
        </>
        :
        <>
          <View></View>
          <Text style={[styles.title, {color: 'lightgray'}]}>Lista de contactos</Text>
        </>
      }

      <TouchableOpacity 
        style={styles.buton} 
        onPress={ () => {
          setLoadingText('Obteniendo los números...');
          setIsLoading(value => value=true);
          onAddRecipientsSelected();
          setIsLoading(value => value=false);
          setIsVisibleModal(true);
          } }
      >
        <Text style={styles.textButon}>Agregar Seleccionados</Text>
      </TouchableOpacity>

    </View>

    <View style={styles.adContainer}>
        <AdView type="image" media={false} />
    </View>
    {
      isLoading &&
      <Loading 
        isVisible={true} 
        text={loadingText} 
      />
    }
    {
      isVisibleModal &&
      <ModalAddContact
        isVisibleModal={isVisibleModal}
        setIsVisibleModal={setIsVisibleModal}
        recipients={recipients}
        repeated={repeated}
        registered={registered}
        handleAddRecipientsSelected={handleAddRecipientsSelected}
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
    height: '86%',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center'
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