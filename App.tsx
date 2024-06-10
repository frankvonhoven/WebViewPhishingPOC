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
  const [isGood, setIsGood] = React.useState(false);
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

  const handleMutex = async () => {
    const release = await mutex.acquire();
    console.log('MUTEX');
    release();
  };

  const handlePhishing = () => {
    webRef.current.stopLoading();
    webRef.current.clearCache(true);
    webRef.current.source = {uri: 'https://google.com'};
    handleMutex();
  };

  const onShouldStartLoadWithRequest = (request: any) => {
    const legitRequest = request.url.includes(URI.slice(8));
    console.log('IS LEGIT REQUEST', legitRequest, request.url, URI.slice(8));
    if (!legitRequest) {
      handlePhishing();
    }
    return legitRequest;
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
          onPress={() => setIsGood(!good)}
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
        ref={webRef}
        onLoad={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          const newUrl = new URL(nativeEvent.url);
          console.log('ON LOAD NEW URL', newUrl);
        }}
        onLoadEnd={syntheticEvent => {
          console.log('-------- ON LOAD END');
        }}
        onLoadStart={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          const newUrl = new URL(nativeEvent.url);
          console.log('ON LOAD START NEW URL', newUrl);
        }}
        onLoadProgress={({nativeEvent}) => {
          // Keep track of going back navigation within component
          console.log('XXXXXXXXXXXX NAV STATE', nativeEvent.url);
          // this.canGoBack = navState.canGoBack;
        }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        source={{uri: URI}}
        style={{marginTop: 20, flex: 1}}
      />
    </SafeAreaView>
  );
}

export default App;
