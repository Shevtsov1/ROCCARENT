import React, { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "@rneui/base";
import FastImage from "react-native-fast-image";
import ItemCard from "../../components/itemCard";
import { AppContext } from "../../../App";
import { Avatar } from "@rneui/themed";

const items = [1, 2, 3];


const Chat = ({ theme, navigation }) => {

  const { userdata } = useContext(AppContext);

  const ChatBtn = () => {
    return (
      <Button containerStyle={{ height: 60 }} buttonStyle={{
        width: "100%",
        height: "100%",
        paddingHorizontal: 0,
        paddingVertical: 0,
        backgroundColor: "transparent",
      }} titleStyle={{color: theme.colors.grey1}} onPress={() => navigation.navigate('OpenedChat')}>
        <View style={{ width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 6 }}>
            <Avatar containerStyle={{ marginEnd: 6 }} size={"medium"} rounded
                    source={userdata && userdata.photoUrl ? { uri: userdata.photoUrl } : require("../../assets/images/save.png")} />
            <View>
              <Text numberOfLines={1}
                    style={{ fontFamily: "Roboto-Medium", fontSize: 16, color: theme.colors.text }}>Name</Text>
              <Text numberOfLines={1} style={{ fontFamily: "Roboto-Regular", color: theme.colors.text }}>Message</Text>
            </View>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Icon type={'ionicon'} name={'chevron-forward'} color={theme.colors.text} size={18}/>
          </View>
        </View>
      </Button>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <FlatList
          data={items}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ChatBtn />
          )
          } />
      </View>
    </SafeAreaView>
  );
};

export default Chat;
