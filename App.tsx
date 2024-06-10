/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
} from 'react-native';
import URL from 'url-parse';
import {Mutex} from 'async-mutex';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {WebView} from 'react-native-webview';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const webRef = React.useRef(null);
  const [isGood, setIsGood] = React.useState(true);
  const [loadFinished, setLoadFinished] = React.useState(true);
  const [loadedHostname, setLoadedHostname] = React.useState('');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  const mutex = new Mutex();

  // React.useEffect(() => {
  //   console.log('webRef', webRef.current);
  // }, []);
  const good = isGood;
  const URI = good ? 'https://google.com' : 'https://nwx267.csb.app/';

  const onShouldStartLoadWithRequest = (request: any) => {
    const {hostname} = new URL(request.url);
    console.log(
      'ON SHOULD START LOAD WITH REQUEST',
      loadedHostname === hostname,
    );
    console.log('HOSTNAME', hostname, loadedHostname);
    if (!loadFinished && loadedHostname === hostname) {
      console.log('LOADED HOSTNAME', loadedHostname, hostname);
      return false;
    }
    setLoadFinished(false);
    return true;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Text
          onPress={() => webRef.current.reload()}
          style={{color: 'white', left: 20}}>
          RELOAD
        </Text>
        <Text
          onPress={() => setIsGood(state => !state)}
          style={{color: 'white', marginLeft: 20}}>
          {good ? 'GO BAD' : 'GO GOOD'}
        </Text>
      </View>
      <Text
        onPress={() => webRef.current.reload()}
        style={{color: 'white', left: 20}}>
        {URI}
      </Text>
      <WebView
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        ref={webRef}
        onLoad={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          const newUrl = new URL(nativeEvent.url);
          console.log('----------- ON LOAD NEW URL', newUrl);
        }}
        onLoadEnd={syntheticEvent => {
          console.log('-------- ON LOAD END');
          const {nativeEvent} = syntheticEvent;
          const newUrl = new URL(nativeEvent.url);
          const {hostname} = newUrl;
          console.log('ON LOAD END HOSTNAME', hostname);
          setLoadedHostname(hostname);
          setLoadFinished(true);
        }}
        onLoadStart={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          const newUrl = new URL(nativeEvent.url);
          const {hostname} = newUrl;
          console.log('ON LOAD START HOSTNAME', hostname);
          setLoadedHostname(hostname);
          console.log('ON LOAD START NEW URL', newUrl);
        }}
        source={{uri: URI}}
        style={{marginTop: 20, flex: 1}}
      />
    </SafeAreaView>
  );
}

export default App;
