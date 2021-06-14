import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text, FlatList } from 'react-native';
import { AdView } from './components/ads/AdView';
import SplashScreen from 'react-native-splash-screen';
import ModalEditCampaign from './components/ModalEditCampaign';
import ModalNewCampaign from './components/ModalNewCampaign';
import CampaignItem from './components/CampaignItem';
import Loading from './components/Loading';
import { getCampaign, saveCampaign } from './store/CampaignStore';
import GlobalContext from './context/globalContext';

export default function Home({navigation}) {
  const globalContext = useContext(GlobalContext);
  const [campaignSelected, setCampaignSelected] = useState({});
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isNewCampaign, setIsNewCampaign] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando campañas...');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let campaigns = await getCampaign();
      if (campaigns) {
        await globalContext.setCampaigns(campaigns);
      }
      setIsLoading(false);
    })()
  }, [globalContext.update])

  useEffect(() => {
    SplashScreen.hide();
  });

  const onDeleteCampaign = async () => {
    let result = globalContext.campaigns;
    result = globalContext.campaigns.filter( campaign => campaign.id != campaignSelected.id);
    await saveCampaign(result);
    await globalContext.setCampaigns(result);
    await globalContext.setUpdate(result);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {
          globalContext.campaigns && globalContext.campaigns.length > 0 ?
          <>
            <FlatList
              data={ globalContext.campaigns }
              renderItem={
                ({item}) => <>
                              <CampaignItem 
                                campaignData={item}
                                setCampaignSelected={setCampaignSelected}
                                setIsVisibleModal={setIsVisibleModal}
                                /> 
                            </>
                }
              keyExtractor={ item => item.id } 
            />
            
          </>
          :
          <>
            <View></View>
            <Text style={[styles.title]}>Aún no haz creado ninguna campaña</Text>
          </>
        }

        <TouchableOpacity style={styles.buton} onPress={() =>  setIsNewCampaign(true) }>
          <Text style={styles.textButon}>Nueva Campaña</Text>
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
        <ModalEditCampaign 
          isVisibleModal={isVisibleModal}
          setIsVisibleModal={setIsVisibleModal}
          campaignSelected={campaignSelected}
          onDeleteCampaign={onDeleteCampaign}
          navigation={navigation}
        />
      }
      {
        isNewCampaign &&
        <ModalNewCampaign 
          isVisibleModal={isNewCampaign}
          setIsVisibleModal={setIsNewCampaign}
          navigation={navigation}
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