import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from "@react-navigation/native";
import React, {useEffect, useRef} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, Animated, View, Text} from 'react-native';
import Icon, {Icons} from '../assets/images/bottomTab/TabBarIcons';
import Main from "../screens/mainScreen/main";
import Catalog from "../screens/catalogScreen/catalog";
import Favorites from "../screens/favoritesScreen/favorites";
import CreateAd from "../screens/createAdScreen/createAd";
import { ProfileStackNavigator } from "./profileStackNavigator";
import { LinearGradient } from "expo-linear-gradient";

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
    component: ProfileStackNavigator
  },
];

const Tab = createBottomTabNavigator();

// Компонент кнопки вкладки
const TabButton = React.memo((props) => {
  const {item, onPress, accessibilityState, theme} = props;
  const focused = accessibilityState.selected;
  const rotation = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const activeTabBarIconColor = theme.colors.accent;
  const inActiveTabBarIconColor = theme.colors.grey2;
  const label = focused ? item.label : '';
  const accentColor = theme.colors.accent;
  const bgColor = theme.colors.background;

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const animations = [
      Animated.timing(rotation, {
        toValue: focused ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateYValue, {
        toValue: focused ? -1 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, [focused, scaleValue, translateYValue, opacityValue]);

  const handlePress = () => {
    if (!focused) {
      onPress();
    }
  };

  if (item.route === 'CreateAd') {
    // Отдельные стили для кнопки "CreateAd"
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        style={[styles.container, { flex: 0.8, alignItems: 'center', backgroundColor: bgColor }]}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: 26, width: '100%', height: 64 }}>
          <LinearGradient
            colors={['transparent', theme.colors.secondary]}
            locations={[0.43, 0]}
            start={[0.5, 0]}
            end={[0.5, 1]}
            style={{ flex: 1, width: '100%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
          >
            <View
              style={
                {
                  width: 54,
                  height: 54,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: accentColor,
                }
              }
            >
              <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
                <Icon
                  type={item.type}
                  name={focused ? item.activeIcon : item.inActiveIcon}
                  color={bgColor}
                  size={30}
                />
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  } else {
    // Стили для остальных кнопок
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={1}
                        style={[styles.container, {
                          top: 0,
                          alignItems: "center",
                          backgroundColor: bgColor,
                          borderTopEndRadius: item.route === "Catalog" ? 10 : 0,
                          borderTopStartRadius: item.route === "Favorites" ? 10 : 0,
                        }]}>

        <View style={styles.iconContainer}>
          <Animated.View
            style={{transform: [{scale: scaleValue}, {translateY: translateYValue}]}}>
            <Icon
              type={item.type}
              name={focused ? item.activeIcon : item.inActiveIcon}
              color={focused ? activeTabBarIconColor : inActiveTabBarIconColor}
            />
          </Animated.View>
          {focused && (
            <Animated.View style={{opacity: opacityValue}}>
              <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 12, color: accentColor}}>{label}</Text>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
});

// Компонент нижней навигации по вкладкам
const BottomTabNavigator = ({user, theme, toggleMode, isDarkMode, setInitializing}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: theme.colors.secondary,
            height: 60,
            backgroundColor: theme.colors.secondary,
          },
        }}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen key={index} name={item.route}
                        options={{
                          tabBarShowLabel: false,
                          tabBarButton: (props) => (
                            <TabButton {...props} item={item} theme={theme} isDarkMode={isDarkMode}/>
                          ),
                        }}
            >
              {(props) => <item.component {...props} user={user} theme={theme} toggleMode={toggleMode} setInitializing={setInitializing}/>}
            </Tab.Screen>
          )
        })}
      </Tab.Navigator>
    </SafeAreaView>
  )
}

// Компонент навигации приложения
const AppNavigator = ({user, setInitializing, theme, toggleMode}) => (
  <NavigationContainer>
    <BottomTabNavigator user={user} setInitializing={setInitializing} theme={theme} toggleMode={toggleMode}/>
  </NavigationContainer>
);

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 60,
    height: 60,
  },
  iconContainer: {
    alignItems: 'center',
  },
});
