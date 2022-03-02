import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { useAssets } from 'expo-asset';
import { connect, useDispatch, useSelector } from 'react-redux';

import { DISPATCHES, SCREENS } from '../constants';
import { Storage } from '../helpers';
import { Ads } from '../components';
import { songStorage } from '../helpers/songStorage';
import { RootState } from '../store/reduxStore';
import { newSongs, playerSlice, setCurrentSong } from '../store/slices/playerSlice';

const { width, height } = Dimensions.get('screen');

const Loading = ({ navigation: { replace } }) => {

	const songs = useSelector((state: RootState) => state.player.songs)
    const dispatch = useDispatch()

	const [assets] = useAssets([require('../../assets/splash.png')]);

	const getStorage = () => {
		return new Promise<void>(async (resolve) => {
			const favourites = await Storage.get('favourites', true);
			const recents = await Storage.get('recents', true);
			const playlists = await Storage.get('playlists', true);

			if (recents && recents.length > 0) {
				dispatch(setCurrentSong({details: songs[recents[0]]}))
			}

			const savedSongs  = await songStorage.getSongs()
			dispatch(newSongs(savedSongs))

			resolve();
		});
	};

	const init = async () => {
		await getStorage();
		replace(SCREENS.TAB);
	};

	useEffect(() => {
		init();
	}, []);

	return <Image style={styles.img} source={require('../../assets/splash.png')} resizeMode="cover" />;
};

export default Loading;

const styles = StyleSheet.create({
	img: {
		width,
		height,
	},
});
