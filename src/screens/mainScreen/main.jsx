import React, {useContext, useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import CardsGrid from "../../components/cardsGrid";
import auth from "@react-native-firebase/auth";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import {AppContext} from "../../../App";
import {Icon} from "@rneui/themed";

const Main = ({theme}) => {

    const {userdata, loadUserdata} = useContext(AppContext);

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
            const listingsData = await firestore().collection("listings").limit(50).get();
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
                <View style={{
                    height: 48,
                    backgroundColor: theme.colors.background,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 6,
                }}>
                    <View style={{width: 26,}}>

                    </View>
                    <FastImage source={require('../../assets/images/logo/logo.png')} style={{width: 48, height: 48}}
                               resizeMode={FastImage.resizeMode.contain}/>
                    {auth().currentUser && !auth().currentUser.isAnonymous && auth().currentUser.emailVerified && userdata && userdata.passportData ?
                        <TouchableOpacity style={{alignSelf: 'center'}}>
                            <Icon type={"ionicon"} name={"chatbubbles-outline"} size={26} color={theme.colors.accent}/>
                        </TouchableOpacity> : <View style={{width: 26,}}></View>}
                </View>
                <>
                    {listings && (
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
                    )}
                </>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Main;
