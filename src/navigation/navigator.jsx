import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from "@react-navigation/native";
import React from 'react';
import {Icons} from '../assets/images/bottomTab/TabBarIcons';
import Main from "../screens/mainScreen/main";
import Catalog from "../screens/catalogScreen/catalog";
import Favorites from "../screens/favoritesScreen/favorites";
import Profile from "../screens/profileScreen/profile";
import CreateAd from "../screens/createAdScreen/createAd";
import { SafeAreaView } from "react-native-safe-area-context";

// Массив с конфигурациями вкладок
const TabArr = [
  {
    route: 'Main',
    label: 'Главная',
    type: Icons.Main,
    activeIcon: Icons.Main.activeIcon,
    inActiveIcon: Icons.Main.inActiveIcon,
    component: Main
  },
  {
    route: 'Catalog',
    label: 'Каталог',
    type: Icons.Catalog,
    activeIcon: Icons.Catalog.activeIcon,
    inActiveIcon: Icons.Catalog.inActiveIcon,
    component: Catalog
  },
  {
    route: 'CreateAd',
    type: Icons.CreateAd,
    activeIcon: Icons.CreateAd.activeIcon,
    inActiveIcon: Icons.CreateAd.inActiveIcon,
    component: CreateAd,
    separate: true,
  },
  {
    route: 'Favorites',
    label: 'Избранное',
    type: Icons.Favorites,
    activeIcon: Icons.Favorites.activeIcon,
    inActiveIcon: Icons.Favorites.inActiveIcon,
    component: Favorites
  },
  {
    route: 'ProfileStack',
    label: 'Профиль',
    type: Icons.Profile,
    activeIcon: Icons.Profile.activeIcon,
    inActiveIcon: Icons.Profile.inActiveIcon,
    component: Profile
  },
];

const Tab = createBottomTabNavigator();

// Компонент нижней навигации по вкладкам
const BottomTabNavigator = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: 'white',
            height: 60,
            backgroundColor: 'white',
          },
        }}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen key={index} name={item.route}
                        options={{
                          tabBarShowLabel: false,
                        }}
            >
              {(props) => <item.component {...props}/>}
            </Tab.Screen>
          )
        })}
      </Tab.Navigator>
    </SafeAreaView>
  )
}

// Компонент навигации приложения
const AppNavigator = () => (
  <NavigationContainer>
    <BottomTabNavigator/>
  </NavigationContainer>
);

export default AppNavigator;
