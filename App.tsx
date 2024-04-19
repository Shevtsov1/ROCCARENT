import React from "react";
import {ActivityIndicator, View} from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {

  return (
    <SafeAreaProvider>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'red',
      }}>
        <ActivityIndicator
          size={75}
          color='red'
        />
      </View>
    </SafeAreaProvider>
      );
};

export default App;
