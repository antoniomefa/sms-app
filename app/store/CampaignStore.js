import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCampaign = async (campaign) => {
  try {
    const jsoncampaign = JSON.stringify(campaign)
    await AsyncStorage.setItem('@campaign', jsoncampaign)
  } catch (e) {
    console.log('Error al guardar la campaña');
  }
}

export const getCampaign = async () => {
  try {
    const jsoncampaign = await AsyncStorage.getItem('@campaign')
    return jsoncampaign != null ? JSON.parse(jsoncampaign) : null;
  } catch(e) {
    console.log('Error al leer la campaña: ' + e);
  }
}

export const deleteCampaign = async () => {
  try {
    await AsyncStorage.removeItem('@campaign')
  } catch(e) {
    console.log('Error al borrar la campaña: ' + e);
  }
}