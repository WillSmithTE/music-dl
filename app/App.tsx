import React from 'react';
import { Provider } from 'react-redux';

import { store } from './src/store/reduxStore';
import Screens from './src/screens';
import { Audio, AVPlaybackStatus } from "expo-av";
import { Song } from './src/types';

export default function App() {
	const [soundState, setSoundState] = React.useState<PlaybackSong>(initialSound)

	const setSound = (newSound: PlaybackSong) => {
		setSoundState({
			...soundState,
			playback: newSound.playback,
			soundObj: newSound.soundObj,
			detail: newSound.detail,
			playbackStatus: newSound.playbackStatus,
		});
	}

	return (
		<Provider store={store}>
			<Screens sound={{ get: soundState, set: setSound }} />
		</Provider>
	);
}


export type PlaybackSong = {
	playback?: Audio.Sound
	soundObj?: AVPlaybackStatus
	detail?: Song
	playbackStatus?: AVPlaybackStatus
}

export type SoundProp = { get: PlaybackSong, set: (song: PlaybackSong) => void, }

const initialSound = {
	detail: {
		id: '1',
		title: 'Heartless',
		author: 'The Weeknd',
		image: 'https://res.cloudinary.com/jsxclan/image/upload/v1623984884/GitHub/Projects/Musicont/mock/images/heartless_du9yxe.jpg',
		uri: 'https://res.cloudinary.com/jsxclan/video/upload/v1623987046/GitHub/Projects/Musicont/mock/audios/heartless_u7exot.mp3',
		durationMillis: 249740,
	},
}

