import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from "../screens/profileScreen/profile";
import Auth from "../screens/authScreen/auth";

const Stack = createNativeStackNavigator();

export const ProfileStackNavigator = ({user, theme, isDarkMode, setInitializing}) => (
  <Stack.Navigator
    initialRouteName={'Profile'}
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTitleStyle: {
        color: theme.colors.text,
      },
      headerTitleAlign: 'center',
      headerTintColor: theme.colors.text,
    }}>
    <Stack.Screen name="Profile" options={{title: 'Профиль', headerShown: false}} >{(props) =>
      <Profile {...props} user={user} theme={theme} isDarkMode={isDarkMode} setInitializing={setInitializing}/>}</Stack.Screen>
    <Stack.Screen name="Auth" options={{title: 'Вход и регистрация', headerShown: false}}>{(props) =>
      <Auth {...props} user={user} theme={theme} isDarkMode={isDarkMode} setInitializing={setInitializing}/>}</Stack.Screen>
  </Stack.Navigator>
);
