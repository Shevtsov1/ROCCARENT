import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Profile = ({ user, theme, toggleMode, navigation }) => {

  const handleAuthBtnPress = () => {
    navigation.navigate("Auth");
  };

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
        <Button onPress={toggleMode} title={"Change color mode"} />
        <Button onPress={handleAuthBtnPress} title={"Go to Auth"} />
      </View>
    </View>
  );
};

export default Profile;
