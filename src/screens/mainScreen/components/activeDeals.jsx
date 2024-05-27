import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {ShadowedView, shadowStyle} from "react-native-fast-shadow";

const ActiveDeals = ({theme}) => {
    const styles = StyleSheet.create({
        hint: {
            height: 144,
            width: "100%",
            backgroundColor: theme.colors.background,
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
            marginBottom: 12,
        },
    });

    return (
        <ShadowedView style={[styles.hint, shadowStyle({
            color: theme.colors.grey3,
            opacity: 0.8,
            radius: 24,
            offset: [0, 6],
        })]}>
            <Text>DEALS</Text>
        </ShadowedView>
    );
};

export default ActiveDeals;