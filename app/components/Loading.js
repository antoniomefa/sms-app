import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Modal} from 'react-native';
import {AdView} from './ads/AdView';

export default function Loading(props) {
  const {isVisible, text, counter, errors, total, isSending} = props;

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}>
      <View style={styles.view}>
        <ActivityIndicator size="large" color='#27DB7E' />
        { text && <Text style={[styles.text, {color: '#fff'}]}>{text}</Text> }
        {
          isSending &&
          <Text style={styles.text}>
            {counter} mensajes enviados de {total}
          </Text>          
        }

        {
          errors > 0 &&
          <Text style={styles.text}>
            {errors} Errores
          </Text>
        }
        {
          isSending &&
          <View
            style={styles.card}>
            <AdView type="image" media={true} />
          </View>
        }
        
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  text: {
    color: '#fff',
    textTransform: 'uppercase',
    marginTop: 10,
  },
  card: {
    marginTop: '10%',
    padding: '4%',
    borderRadius: 15,
    backgroundColor: '#fff'
  }
});