import React, {useState, useContext, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import ContactItem from './components/ContactItem';
import { AdView } from './components/ads/AdView';
import Loading from './components/Loading';
import GlobalContext from './context/globalContext';

export default function ContactsList({ navigation }) {
  const globalContext = useContext(GlobalContext);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [contactsSelected, setContactsSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando...');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableOpacity style={styles.infoIcon} onPress={() => {}}>
            <Text style={styles.textTopBar}>Seleccionar Todos</Text>
          </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      await setIsLoading(true);
      await setLoadingText('Leyendo contactos...');
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
      Contacts.getAll().then(async (contacts) => {
        await setPhoneContacts(contacts);
        setIsLoading(false);
        setMoreOptions(false);
      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.form}>
      {
        phoneContacts && phoneContacts.length > 0 ?
        <>
          <FlatList
            data={ phoneContacts.sort((a, b) => a.givenName.localeCompare(b.givenName))}
            renderItem={
              ({item}) => <>
                            <ContactItem 
                              contactData={item}
                              setContactsSelected={setContactsSelected}
                              /> 
                          </>
              }
            keyExtractor={ item => item.recordID } 
          />
          
        </>
        :
        <>
          <View></View>
          <Text style={[styles.title]}>No se encontraron contactos en el teléfono</Text>
        </>
      }

      <TouchableOpacity style={styles.buton} onPress={() =>  {} }>
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
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
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