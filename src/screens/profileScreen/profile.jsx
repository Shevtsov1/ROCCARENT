import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Profile = () => {


  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
    },

    /* BODY END */
  });

  return (
    <View style={{flex: 1}}>
      <View style={styles.body}>
        <Text>P R O F I L E</Text>
      </View>
    </View>
  );
};

export default Profile;
