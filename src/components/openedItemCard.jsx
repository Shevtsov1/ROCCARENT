import React from "react";
import {Text, View, StyleSheet} from "react-native";


const OpenedItemCard = ({theme}) => {

    const styles = StyleSheet.create({
        imagesContainer: {
            height: 144,
        }
    });

    return(
       <View>
           <View style={styles.imagesContainer}>

           </View>
       </View>
    );
}

export default OpenedItemCard;
