import React from "react";
import {FlatList, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button} from "@rneui/base";
import FastImage from "react-native-fast-image";
import ItemCard from "../../components/itemCard";

const items = [1, 2, 3];

const MessageBtn = () => {
    return (
        <Button>
            <FastImage source={require('../../assets/images/save.png')}/>
            <Text>Name</Text>a
            <Text>Message</Text>
        </Button>
    )
}

const Chat = ({theme}) => {
    return (
        <SafeAreaView style={{flex: 1,}}>
            <View style={{flex: 1, backgroundColor: theme.colors.background}}>
                <FlatList
                    data={items}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                        <MessageBtn/>
                    )
                    }/>
            </View>
        </SafeAreaView>
    );
};

export default Chat;
