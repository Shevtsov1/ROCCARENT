import React, { useEffect, useState } from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardsGrid from "../../components/cardsGrid";
import auth from "@react-native-firebase/auth";
import AuthHint from "./components/authHint";
import { ShadowedView, shadowStyle } from "react-native-fast-shadow";
import firestore from "@react-native-firebase/firestore";

const Main = ({ theme }) => {

  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListingList().then();
  }, []);

  const loadListingList = async () => {
    try {
      let newListingsArr = [];
      const currentUserListings = await firestore().collection('users').doc(auth().currentUser.uid).get();
      const listingsData = await firestore().collection("listings").get();
      if (listingsData) {
        if (currentUserListings.data() && currentUserListings.data().listings) {
          currentUserListings.data().listings.forEach(listingId => {
            listingsData.forEach(doc => {
              if (doc.id !== listingId) {
                newListingsArr.push(doc.data());
              }
            });
          })
        } else {
          listingsData.forEach(doc => {
            newListingsArr.push(doc.data());
          });
        }
        setListings(newListingsArr);
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
  //
  // const headerComponent = () => (
  //
  // )
  //
  // const footerComponent = () => (
  //
  // )

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.body}>
          {auth().currentUser && auth().currentUser.isAnonymous && <AuthHint theme={theme} />}
          {listings &&
              <ShadowedView style={[{ marginBottom: 12 }, shadowStyle({
                color: theme.colors.grey3,
                opacity: 0.8,
                radius: 24,
                offset: [0, 6],
              })]}>
                <View style={{ width: "100%", backgroundColor: theme.colors.background, borderRadius: 15, alignItems: 'center' }}>
                  <CardsGrid theme={theme} items={listings} likes screen={'Main'}/>
                </View>
              </ShadowedView>
          }
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
