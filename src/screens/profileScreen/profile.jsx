import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaView } from "react-native-safe-area-context";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";

const Profile = ({ user, theme, toggleMode, navigation }) => {

  const handleAuthBtnPress = () => {
    navigation.navigate("LogIn");
  };

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex: 1,
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
      backgroundColor: theme.colors.secondary,
    }, profileMainCardContainer: {
      marginTop: hp(1),
      justifyContent: 'center',
      alignSelf: 'center',
    }, profileMainCard: {
      width: wp(90),
      height: hp(25),
      backgroundColor: theme.colors.background,
      borderRadius: 15,
    }

    /* BODY END */
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.body}>
        <View style={styles.profileMainCardContainer}>
          <ShadowedView style={[shadowStyle({
            color: theme.colors.text,
            opacity: 0.8,
            radius: 4,
            offset: [0,0]
          }), {borderRadius: 15}]}>
            <View style={styles.profileMainCard}></View>
          </ShadowedView>
        </View>
        <Text>P R O F I L E</Text>
        {user && <Text>{user.uid}</Text>}
        <Button onPress={() => auth()
          .signOut()
          .then(() => GoogleSignin.signOut().then(() => console.log("User signed out!")))} title={"LOGOUT"} />
        <Button onPress={toggleMode} title={"Change color mode"} />
        <Button onPress={handleAuthBtnPress} title={"Go to Auth"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
