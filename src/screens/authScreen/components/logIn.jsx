import React from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";


const LogIn = ({ theme, isDarkMode, setInitializing }) => {


  return (
    <ScrollView style={{
      flex: 1, backgroundColor: theme.colors.secondary,
    }}>
      <View style={{ marginVertical: hp(2), marginBottom: 24, marginHorizontal: wp(4) }}>
        <Text>LogIn</Text>
      </View>
    </ScrollView>
  );
};

export default LogIn;
