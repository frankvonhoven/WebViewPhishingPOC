import React from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const originalSend = XMLHttpRequest.prototype.send;
const originalOpen = XMLHttpRequest.prototype.open;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [sendURL, setSendURL] = React.useState('');
  const [openURL, setOpenURL] = React.useState('');
  const [openMethod, setOpenMethod] = React.useState('');
  const [response, setResponse] = React.useState([]);
  const [URL, setURL] = React.useState('swapi.dev/api/people/1');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  };

  let currentUrl = '';

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    currentUrl = url.toString();
    setOpenURL(currentUrl);
    setOpenMethod(method);
    return originalOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (body) {
    // This is the interceptor logic to prevent the request from being sent
    // if (currentUrl.includes('swapi.dev')) {
    //   return;
    // }

    // Otherwise, we can proceed with the request
    setSendURL(currentUrl);
    return originalSend.call(this, body);
  };

  const makeFetchCall = async () => {
    const res = await fetch(`https://${URL}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      console.error('ERROR', error);
    });
    const data = await res?.json();
    console.log('DATA', data);
    setResponse(data);
    // setURL('');
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text style={styles.header}>Fetch API POC</Text>
      <View style={styles.detailsWrapper}>
        <Text style={styles.key}>
          Open URL: <Text style={styles.value}>{openURL}</Text>
        </Text>
        <Text style={styles.key}>
          Open Method: <Text style={styles.value}>{openMethod}</Text>
        </Text>
        <Text style={styles.key}>
          Send URL: <Text style={styles.value}>{sendURL}</Text>
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setURL}
          autoCapitalize="none"
          value={URL}
        />
        <Button title="MAKE FETCH CALL" onPress={makeFetchCall} />
        {Object.keys(response).map((key, index) => (
          <Text key={index} style={styles.key}>
            {[key]}: <Text style={styles.value}>{response[key]}</Text>
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    color: 'white',
    top: 60,
    left: 10,
    fontSize: 20,
    position: 'absolute',
  },
  detailsWrapper: {
    justifyContent: 'center',
  },
  key: {color: 'white', fontSize: 16},
  value: {color: 'white', fontSize: 12},
  input: {
    color: 'white',
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 20,
    paddingHorizontal: 5,
  },
};

export default App;
