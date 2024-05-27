import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, InputAccessoryView, TouchableOpacity} from 'react-native';
import CardsGrid from "../../components/cardsGrid";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {AppContext} from "../../../App";
import {SafeAreaView} from "react-native-safe-area-context";
import {Icon, SearchBar} from "@rneui/base";

const Catalog = ({theme}) => {

  const { loadUserdata } = useContext(AppContext);

  const [listings, setListings] = useState([]);

  useEffect(() => {
    const load = async () => {
      await loadUserdata();
      await loadListingList();
    };
    load().then();
  }, []);

  const handleReloadBtn = async () => {
    try {
      await loadUserdata();
      await loadListingList();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const loadListingList = async () => {
    try {
      let newListingsArr = [];
      const listingsData = await firestore().collection("listings").get();
      if (listingsData) {
        listingsData.forEach(doc => {
          if (doc.data().ownerId !== auth().currentUser.uid) {
            newListingsArr.push(doc.data());
          }
        });
        setListings(newListingsArr);
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const styles = StyleSheet.create({

    /* BODY BEGIN */

    body: {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },

    /* BODY END */
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', backgroundColor: theme.colors.background}}>
        <SearchBar
            containerStyle={{flex: 1, backgroundColor: theme.colors.background, borderTopWidth: 0, borderBottomWidth: 0}}
            inputContainerStyle={{borderColor: theme.colors.accent, borderRadius: 5, borderBottomWidth: 2, borderWidth: 2, backgroundColor: `${theme.colors.background}9A`}}
            blurOnSubmit
            searchIcon={<Icon type={'ionicon'} name={'search'} color={theme.colors.accent}/>}
            clearIcon={<Icon type={'ionicon'} name={'close'} color={theme.colors.accent}/>}
            placeholder="Поиск"
            // onChangeText={updateSearch}
            // value={search}
        />
        <TouchableOpacity style={{alignSelf: 'center', marginEnd: 6,}}>
          <Icon type={'ionicon'} name={'filter'} color={theme.colors.accent}/>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View
            style={{
              width: "100%",
              backgroundColor: theme.colors.background,
              borderRadius: 15,
              alignItems: "center",
            }}
        >
          <CardsGrid
              theme={theme}
              items={listings}
              likes
              screen={"Main"}
              reloadFunction={() => handleReloadBtn()}
              authHint
              // deals
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Catalog;
