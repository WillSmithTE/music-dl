import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Icon } from '../../components';
import { Header } from '../../widgets';
import { Audio } from '../../hooks';
import { DISPATCHES } from '../../constants';
import { millisToMin, Storage } from '../../helpers';
import { RootState } from '../../store/reduxStore';
import { setCurrentSong } from '../../store/slices/playerSlice';
import { AVPlaybackStatus } from 'expo-av';
import { PlaybackSong, SoundProp } from '../../../App';

const Index = ({ route: { params }, navigation: { goBack }, sound }: PlayingProps) => {

	const songs = useSelector((state: RootState) => state.player.songs)
	const dispatch = useDispatch()

	const stopBtnAnim = useRef(new Animated.Value(sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying ? 1 : 0.3)).current;
	const [isFav, setIsFav] = useState(false);
	const [actions, setActions] = useState({
		prev: false,
		play: false,
		stop: false,
		next: false,
	});

	const verifyFav = async () => {
		const favs = await Storage.get('favourites', true);
		if (favs !== null) {
			const currentIndex = songs.findIndex((i) => i.id === sound.get?.detail?.id);
			if (favs.includes(currentIndex)) {
				setIsFav(true);
			} else {
				setIsFav(false);
			}
		}
	};

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
		sound.set({ playbackStatus })

		if (playbackStatus?.isLoaded && playbackStatus?.didJustFinish) {
			handleNext();
		}
	};

	const configAndPlay = (shouldPlay = false) => {
		if (!sound.get?.soundObj?.isLoaded) {
			return Audio.configAndPlay(
				sound.get?.detail?.uri,
				shouldPlay
			)((playback, status) => {
				sound.set({
					playback: playback,
					soundObj: status,
				})

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
				})

				_e({ play: false });
			});
		}

		if (sound.get?.soundObj?.isLoaded && !sound.get?.soundObj?.isPlaying) {
			return Audio.resume(sound.get?.playback!!)((soundObj) => {
				sound.set({
					soundObj,
				})

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
				},
				)

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
				})

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
				})

				addToRecentlyPlayed(nextIndex);
				_e({ next: false });
			})(onPlaybackStatusUpdate);
		});
	}

	const handleSeek = (millis: number) => {
		return Audio.seek(
			sound.get?.playback,
			Math.floor(millis)
		)((soundObj) => {
			sound.set({
				soundObj,
			})
		})(onPlaybackStatusUpdate);
	};

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

	useEffect(() => {
		verifyFav();
	}, [sound.get?.detail?.id]);

	useEffect(() => {
		if (params?.forcePlay && params?.song?.uri !== sound.get?.detail?.uri) {
			handleStop(() => {
				Audio.play(
					sound.get?.playback,
					params?.song?.uri
				)((soundObj) => {
					sound.set({
						soundObj,
						detail: params?.song,
					})

					addToRecentlyPlayed(params?.index);
				})(onPlaybackStatusUpdate);
			});
		}
	}, [params?.forcePlay, params?.song, params?.index]);

	return (
		<>
			<StatusBar style="light" />
			<ImageBackground style={styles.container} source={{ uri: sound.get?.detail?.image }} blurRadius={10} resizeMode="cover">
				<View style={[StyleSheet.absoluteFill, styles.overlay]} />
				<Header
					options={{
						left: {
							children: <Icon name="chevron-left" color="#FFF" />,
							onPress: goBack,
						},
						right: {
							children: <Icon name="heart" color={isFav ? '#C07037' : '#FFF'} />,
						},
					}}
				/>
				<View style={styles.frame}>
					<View>
						<Image style={styles.clipart} source={{ uri: sound.get?.detail?.image }} resizeMode="cover" borderRadius={20} />
					</View>
					<View style={styles.details}>
						<View style={{ marginBottom: 25 }}>
							<Text style={styles.songTitle}>{sound.get?.detail?.title}</Text>
							<Text style={styles.artistName}>{sound.get?.detail?.author}</Text>
						</View>
						<View style={styles.tracker}>
							<Slider
								minimumValue={0}
								maximumValue={sound.get?.detail?.durationMillis}
								minimumTrackTintColor="#C07037"
								thumbTintColor="transparent"
								maximumTrackTintColor="transparent"
								value={sound.get?.playbackStatus?.isLoaded && sound.get?.playbackStatus?.positionMillis || 0}
								onSlidingComplete={handleSeek}
							/>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
							<Text style={styles.minMin}>{millisToMin(sound.get?.playbackStatus?.isLoaded && sound.get?.playbackStatus?.positionMillis || 0)}</Text>
							<Text style={styles.maxMin}>{millisToMin(sound.get?.detail?.durationMillis)}</Text>
						</View>
					</View>
					<View style={styles.actionsContainer}>
						<TouchableOpacity onPress={handlePrev}>
							<Icon name="skip-back" color="#C4C4C4" />
						</TouchableOpacity>
						<TouchableOpacity onPress={handlePlayAndPause}>
							<LinearGradient style={[styles.playAndPauseBtn, (!sound.get?.soundObj?.isLoaded || !sound.get?.soundObj?.isPlaying) && { paddingLeft: 4 }]} colors={['#939393', '#000']}>
								<Icon name={sound.get?.soundObj?.isLoaded && sound.get?.soundObj?.isPlaying ? `pause` : `play`} color="orange" />
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleNext}>
							<Icon name="skip-forward" color="#C4C4C4" />
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</>
	);
};

export default Index;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Constants.statusBarHeight,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, .5)',
	},
	frame: {
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	clipart: {
		width: 250,
		height: 250,
	},
	details: {
		width: '85%',
	},
	songTitle: {
		color: '#FFF',
		fontSize: 24,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	artistName: {
		color: 'rgba(255, 255, 255, .6)',
	},
	tracker: {
		backgroundColor: 'rgba(255, 255, 255, .2)',
		borderRadius: 100,
	},
	minMin: {
		color: '#FFF',
	},
	maxMin: {
		color: '#FFF',
	},
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: 200,
	},
	playAndPauseBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
		height: 60,
		borderRadius: 100,
		borderWidth: 1.5,
		borderColor: '#FFF',
	},
});

interface PlayingProps {
	sound: SoundProp
}
