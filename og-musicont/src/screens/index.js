import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";

import { Loading, Search, Playing, Home, Songs, Favourite, Recent, Playlists,  } from './screens';
import { SCREENS } from '../constants';
import { BLACK, DARK_GRAY, PRIMARY_COLOR, WHITE } from '../assets/styles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = () => (
	<Stack.Navigator headerMode="none" initialRouteName={SCREENS.LOADING}>
		<Stack.Screen name={SCREENS.LOADING} component={Loading} />
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
						component={Home}
						options={{
							tabBarIcon: ({ focused }) => (
								<TabBarIcon
									focused={focused}
									iconName="home"
								/>
							),
						}}
					/>
					<Tab.Screen
						name={SCREENS.SEARCH}
						component={Search}
						options={{
							tabBarIcon: ({ focused }) => (
								<TabBarIcon
									focused={focused}
									iconName="search"
								/>
							),
						}}
					/>
					<Tab.Screen name={SCREENS.PLAYING} component={Playing} options={{
						tabBarButton: () => null,
						// tabBarVisible: false
					}} />

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

const Index = () => {
	return (
		<NavigationContainer>
			<StackNavigation />
		</NavigationContainer>
	);
};

export default Index;
