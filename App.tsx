import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import EasyAPI from './EasyAPI';
import RNMia from 'react-native-rn-mia';

import {Colors} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const api = new EasyAPI();

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const presentMiaCheckout = (paymentID, paymentURL) => {
  RNMia.checkoutWithPaymentID(
    paymentID,
    paymentURL,
    api.redirectURL,
    api.cancelURL,
    error => {
      const alertTitle = error ? 'Error' : 'Payment Successful';
      Alert.alert(alertTitle, error.Error, [{text: 'Ok'}]);
    },
    cancellation => {
      Alert.alert('Cancelled', 'You have cancelled the payment', [
        {text: 'Ok'},
      ]);
    },
  );
};

const checkoutWithMia = paymentRequestBody => {
  api.createPaymentWithRequestBody(paymentRequestBody, json => {
    console.log('json', json);
    if (json.paymentId && json.hostedPaymentPageUrl) {
      presentMiaCheckout(json.paymentId, json.hostedPaymentPageUrl);
    } else {
      Alert.alert('Registration Error', JSON.stringify(json), [{text: 'OK'}]);
    }
  });
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        />
        <Section title="Hello world" />
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          use hardcodet paymentId and paymentUrl
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            presentMiaCheckout(
              '0223000065423058f20277be481580c5',
              'https://test.checkout.dibspayment.eu/v1/checkout.js?v=1',
            );
          }}>
          <Text style={{color: 'white', fontSize: 20}}>
            Open checkout webview
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          use hardcodet price
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const paymentRequest = api.makePaymentRequest(10);
            const jsonRequest = JSON.stringify(paymentRequest);
            checkoutWithMia(jsonRequest);
          }}>
          <Text style={{color: 'white', fontSize: 20}}>Create new payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginLeft: 10,
    marginTop: 10,
    width: '80%',
    borderRadius: 6,
  },
});

export default App;
