import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { heightPercentageToDP } from "react-native-responsive-screen";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Profile = ({ user, theme, toggleMode, navigation }) => {

  const handleAuthBtnPress = () => {
    navigation.navigate("Auth");
  };

  GoogleSignin.configure({
    webClientId: "771592361046-c50gd0p0heu9i02kp2j8j3s27m45h8cl.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.secondary,
    },

    /* BODY END */
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.body}>
        <Text>P R O F I L E</Text>
        {user && <Text>{user.uid}</Text>}
        <Button onPress={() => auth()
          .signOut()
          .then(() => GoogleSignin.signOut().then(() => console.log("User signed out!")))} title={"LOGOUT"} />
        <Button onPress={onGoogleButtonPress} title={"GOOGLE"} />
        <Button onPress={toggleMode} title={"Change color mode"} />
        <Button onPress={handleAuthBtnPress} title={"Go to Auth"} />
      </View>
    </View>
  );
};

export default Profile;
