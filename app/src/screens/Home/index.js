import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssets } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';

import { Footer, Header, Section, Drawer } from '../../widgets';
import { Icon } from '../../components';
import Songs from '../Songs';

const Index = () => {
	const [drawer, setDrawer] = useState(false);

	return (
		<>
			<TouchableWithoutFeedback >
				<Songs />
			</TouchableWithoutFeedback>
		</>
	);
};

export default Index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sections: {
		flex: 1,
		marginTop: Dimensions.get('screen').height * 0.025,
	},
});
