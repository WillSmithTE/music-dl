import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';

import Songs from '../Songs/SongsList';

const Home = () => {
	return (
		<>
			<TouchableWithoutFeedback >
				<Songs />
			</TouchableWithoutFeedback>
		</>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sections: {
		flex: 1,
		marginTop: Dimensions.get('screen').height * 0.025,
	},
});
