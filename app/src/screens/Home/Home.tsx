import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SoundProp } from '../../../App';

import Songs from '../Songs/SongsList';

const Home = ({sound}: {sound: SoundProp}) => {
	return (
		<>
			<TouchableWithoutFeedback >
				<Songs sound={sound} />
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
