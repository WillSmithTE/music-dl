import React, { useEffect, useRef, useState, memo } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { connect, useDispatch, useSelector } from 'react-redux';
import Slider from '@react-native-community/slider';

import Icon from '../../components/Icon';
import { DISPATCHES, SCREENS } from '../../constants';
import { Audio } from '../../hooks';
import { Storage } from '../../helpers';
import { RootState } from '../../store/reduxStore';
import { setCurrentSong } from '../../store/slices/playerSlice';
import { AVPlaybackStatus } from 'expo-av';
import { SoundProp } from '../../../App';

const { width } = Dimensions.get('screen');

const Index = ({sound }: {sound: SoundProp}) => {

	const songs = useSelector((state: RootState) => state.player.songs)
	const dispatch = useDispatch()

	const { navigate } = useNavigation();
	const stopBtnAnim = useRef(new Animated.Value(sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying ? 1 : 0.3)).current;
	const [actions, setActions] = useState({
		prev: false,
		play: false,
		stop: false,
		next: false,
	});

	const _e = (arg = {}) => {
		setActions({
			...actions,
			...arg,
		});
	};

	const addToRecentlyPlayed = async (index: number) => {
		const recents = await Storage.get('recents', true);
		if (recents === null) {
			await Storage.store('recents', [index], true);
		} else {
			const filtered = recents.filter((i: number) => i !== index).filter((i: number) => recents.indexOf(i) < 9);
			filtered.unshift(index);
			await Storage.store('recents', filtered, true);
		}

		// dispatch({
		// 	type: DISPATCHES.STORAGE,
		// 	payload: {
		// 		recents: await Storage.get('recents', true),
		// 	},
		// });
	};

	const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
		sound.set({
			playbackStatus,
		})

		if (playbackStatus?.isLoaded && playbackStatus?.didJustFinish) {
			handleNext();
		}
	};

	const configAndPlay = (shouldPlay = false) => {
		if (!sound.get?.soundObj?.isLoaded) {
			return Audio.configAndPlay(
				sound.get?.detail?.uri,
				shouldPlay
			)((playback, soundObj) => {
				sound.set({
					playback,
					soundObj,
				});

				addToRecentlyPlayed(songs.findIndex((i) => i.id === sound.get?.detail?.id));
			})(onPlaybackStatusUpdate);
		}
	};

	const handlePlayAndPause = async () => {
		_e({ play: true });

		if (!sound.get?.soundObj?.isLoaded) {
			configAndPlay(true);
			_e({ play: true });
		}

		if (sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying) {
			return Audio.pause(sound.get?.playback)((soundObj) => {
				sound.set({
					soundObj,
				});

				_e({ play: false });
			});
		}

		if (sound.get?.soundObj?.isLoaded && !sound.get?.soundObj?.isPlaying) {
			return Audio.resume(sound?.get.playback)((soundObj) => {
				sound.set({
					soundObj,
				});

				_e({ play: false });
			});
		}
	};

	const handleStop = async (after = () => { }) => {
		_e({ stop: true });

		if (sound.get?.soundObj?.isLoaded) {
			return Audio.stop(sound.get?.playback)(() => {
				sound.set({
					soundObj: {},
				});

				after();
				_e({ stop: false });
			});
		}

		after();
		_e({ stop: false });
	};

	const handlePrev = async () => {
		_e({ prev: true });

		const currentIndex = songs.findIndex((i) => i.id === sound.get?.detail?.id);
		const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
		const prevSong = songs[prevIndex];

		return handleStop(() => {
			Audio.play(
				sound.get?.playback,
				prevSong?.uri!!
			)((soundObj) => {
				sound.set({
					soundObj,
					detail: prevSong,
				});

				addToRecentlyPlayed(prevIndex);
				_e({ prev: false });
			})(onPlaybackStatusUpdate);
		});
	};

	async function handleNext() {
		_e({ next: true });

		const currentIndex = songs.findIndex((i) => i.id === sound.get?.detail?.id);
		const nextIndex = currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
		const nextSong = songs[nextIndex];

		return handleStop(() => {
			Audio.play(
				sound.get?.playback,
				nextSong?.uri!!
			)((soundObj) => {
				sound.set({
					soundObj,
					detail: nextSong,
				});

				addToRecentlyPlayed(nextIndex);
				_e({ next: false });
			})(onPlaybackStatusUpdate);
		});
	}

	useEffect(() => {
		if (sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying) {
			Animated.timing(stopBtnAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(stopBtnAnim, {
				toValue: 0.3,
				duration: 1000,
				useNativeDriver: true,
			}).start();
		}
	}, [sound]);

	useEffect(() => {
		(async () => {
			await Audio.init();
			configAndPlay();
		})();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.tracker}>
				<View
					style={{
						...StyleSheet.absoluteFill,
						zIndex: 99,
					}}
				/>
				<Slider
					minimumValue={0}
					maximumValue={sound.get?.detail?.durationMillis}
					minimumTrackTintColor="#C07037"
					thumbTintColor="transparent"
					maximumTrackTintColor="transparent"
					value={sound.get?.playbackStatus?.isLoaded && sound.get?.playbackStatus?.positionMillis || 0}
				/>
			</View>
			<View style={styles.left}>
				<TouchableWithoutFeedback onPress={() => navigate(SCREENS.PLAYING)}>
					<View style={styles.coverArtContainer}>
						<Image
							style={{
								width: 130,
								height: 130,
								position: 'absolute',
								right: -6,
								opacity: 0.5,
								alignSelf: 'center',
							}}
							source={{ uri: sound.get?.detail?.image }}
							resizeMode="cover"
							borderRadius={150}
							blurRadius={100}
						/>
						<Image style={styles.coverArt} source={{ uri: sound.get?.detail?.image }} resizeMode="cover" borderRadius={150} />
					</View>
				</TouchableWithoutFeedback>
			</View>
			<View style={styles.content}>
				<Text style={styles.songTitle} numberOfLines={1}>
					{sound.get?.detail?.title}
				</Text>
				<Text style={styles.songArtist} numberOfLines={1}>
					{sound.get?.detail?.author}
				</Text>
			</View>
			<View style={styles.actions}>
				<TouchableOpacity style={styles.btn} onPress={handlePrev} disabled={actions?.prev}>
					<Icon name="skip-back" color="#C4C4C4" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={handlePlayAndPause} disabled={actions?.play}>
					<Icon name={sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying ? `pause` : `play`} color={sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying ? `#C07037` : `#C4C4C4`} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={() => (sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying ? handleStop(() => { }) : () => { })} disabled={actions?.stop}>
					<Animated.View style={{ opacity: stopBtnAnim }}>
						<Icon family="Ionicons" name="stop-outline" color="#C4C4C4" />
					</Animated.View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={handleNext} disabled={actions?.next}>
					<Icon name="skip-forward" color="#C4C4C4" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Index;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width,
		height: 80,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
	tracker: {
		position: 'absolute',
		width,
		top: -10,
		right: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, .08)',
	},
	left: {
		flexBasis: 110,
	},
	coverArtContainer: {
		position: 'absolute',
		width: 135,
		height: 135,
		left: -20,
		bottom: -20,
	},
	coverArt: {
		width: 135,
		height: 135,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		marginLeft: 20,
	},
	songTitle: {
		color: '#555555',
		fontSize: 20,
		fontWeight: 'bold',
		letterSpacing: 1.5,
	},
	songArtist: {
		color: '#555555',
	},
	actions: {
		flexBasis: 150,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 5,
	},
	btn: {
		padding: 5,
	},
});
