import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";

import { Loading, Search, Playing, Home } from './screens';
import { SCREENS } from '../constants';
import { BLACK, DARK_GRAY, PRIMARY_COLOR, WHITE } from '../assets/styles';
import { SoundProp } from '../../App';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = ({ sound }: { sound: SoundProp }) => (
	<Stack.Navigator headerMode="none" initialRouteName={SCREENS.LOADING}>
		<Stack.Screen name={SCREENS.LOADING} >
			{(props) => <Loading {...props} sound={sound} />}
		</Stack.Screen>
		<Stack.Screen name={SCREENS.TAB} options={{ headerShown: false, animationEnabled: false }}>
			{() => (
				<Tab.Navigator
					screenOptions={{
						tabBarActiveTintColor: PRIMARY_COLOR,
						tabBarInactiveTintColor: DARK_GRAY,
						tabBarShowLabel: true,
						tabBarLabelStyle: {
							fontSize: 14,
							textTransform: "uppercase",
							paddingTop: 10
						},
						tabBarStyle: [
							{
								display: "flex"
							},
							null
						]
					}}
				>
					<Tab.Screen
						name={SCREENS.HOME}
						options={{
							tabBarIcon: ({ focused }) => (
								<TabBarIcon
									focused={focused}
									iconName="home"
								/>
							),
						}}
					>
						{(props) => <Home {...props} sound={sound} />}
					</Tab.Screen>
					<Tab.Screen
						name={SCREENS.SEARCH}
						options={{
							tabBarIcon: ({ focused }) => (
								<TabBarIcon
									focused={focused}
									iconName="search"
								/>
							),
						}}
					>
						{(props) => <Search {...props} sound={sound} />}
					</Tab.Screen>
					<Tab.Screen
						name={SCREENS.PLAYING}
						options={{
							tabBarButton: () => null,
							// tabBarVisible: false
						}} >
						{(props) => <Playing {...props} sound={sound} />}
					</Tab.Screen>

				</Tab.Navigator>
			)}
		</Stack.Screen>


		{/* <Stack.Screen name={SCREENS.LOADING} component={Loading} />
		<Stack.Screen name={SCREENS.SEARCH} component={Search} />
		
		<Stack.Screen name={SCREENS.HOME} component={Home} />
		<Stack.Screen name={SCREENS.SONGS} component={Songs} />
		<Stack.Screen name={SCREENS.FAVOURITE} component={Favourite} />
		<Stack.Screen name={SCREENS.RECENT} component={Recent} />
		<Stack.Screen name={SCREENS.PLAYLISTS} component={Playlists} />
		<Stack.Screen name={SCREENS.PLAYLIST} component={Playlist} /> */}
	</Stack.Navigator>
);

const Index = ({ sound }: { sound: SoundProp }) => {
	return (
		<NavigationContainer>
			<StackNavigation sound={sound} />
		</NavigationContainer>
	);
};

export default Index;
