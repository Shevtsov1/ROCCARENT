import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Icon, Text} from "@rneui/base";
import {ShadowedView, shadowStyle} from "react-native-fast-shadow";

const AuthHint = ({theme}) => {

    const styles = StyleSheet.create({
        hint: {
            height: 72,
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
            <TouchableOpacity style={{
                marginHorizontal: 6,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 6,
                borderRadius: 5,
                backgroundColor: theme.colors.warning
            }}>
                <View style={{marginStart: 12}}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                        color: theme.colors.accentText,
                        alignSelf: "flex-start",
                    }}>
                        Вход/Регистрация
                    </Text>
                    <Text style={{
                        fontFamily: "Roboto-Regular",
                        fontSize: 14,
                        color: theme.colors.accentText,
                        alignSelf: "flex-start",
                    }}>
                        Авторизуйтесь для оформления сделок, общения с владельцами и множеста других функций
                    </Text>
                </View>
                <Icon type={'ionicon'} name={'chevron-forward'} color={theme.colors.accentText} size={18}/>
            </TouchableOpacity>
        </ShadowedView>
    );
};

export default AuthHint;
