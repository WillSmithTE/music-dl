import React, { memo, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect, useDispatch, useSelector } from 'react-redux';

import { Card } from '../../../components';
import { DISPATCHES, SCREENS } from '../../../constants';
import { Storage } from '../../../helpers';
import { toString } from '../../../util';
import { RootState } from '../../../store/reduxStore';
import { Song } from '../../../types';

const Index = ({ style = {}, indicator = true, useIndex = false, sound }) => {
	const { navigate } = useNavigation();
	const [favs, setFavs] = useState([]);
	const [playlistModal, setPlaylistModal] = useState(false);
	const [songIndex, setSongIndex] = useState(0);

	const songs = useSelector((state: RootState) => state.player.songs)
	const dispatch = useDispatch()

	const setFavourites = async () => {
		const savedFavs = await Storage.get('favourites', true);
		if (savedFavs !== null) {
			setFavs(savedFavs);
		}
	};

	const onPlayPress = (song: Song, index: number) => {
		console.info(`Play pressed (song=${toString(song)}, index=${index})`)
		navigate(SCREENS.PLAYING, {
			forcePlay: true,
			song,
			index,
		});
	};

	useEffect(() => {
		setFavourites();
	}, []);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{
				...style,
				padding: 20,
			}}
			showsVerticalScrollIndicator={indicator}
		>
			{songs.map((song, key) => {
				const index = songs.findIndex((i) => i?.id === song?.id);

				return (
					<Card.ListItem
						key={key}
						id={song.id}
						imageURL={song.image}
						title={song.title}
						author={song.author}
						uri={song.uri}
						duration={song.durationMillis}
						onPlayPress={() => onPlayPress(song, index)}
						moreOptions={[
							{
								text: 'Play',
								onPress: () => onPlayPress(song, index),
							},
						]}
					/>
				);
			})}

		</ScrollView>
	);
};

export default Index

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
