import { Song } from "../../types";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Audio, AVPlaybackStatus } from "expo-av";

export interface PlayerState {
	currentSong: PlaybackSong,
	songs: Song[]
}

export const playerSlice = createSlice({
	name: 'player',
	initialState: makeInitialState(),
	reducers: {
		setCurrentSong: (state, action: PayloadAction<PlaybackSong>) => {
			const config = {
				playback: 'current',
				soundObj: 'current',
				detail: 'current',
				playbackStatus: 'current',
				...action.payload,
			};
			return {
				...state,
				currentSong: {
					playback: config?.playback === 'current' ? state?.currentSong?.playback : action.payload?.playback,
					soundObj: config?.soundObj === 'current' ? state?.currentSong?.soundObj : action.payload?.soundObj,
					detail: config?.detail === 'current' ? state?.currentSong?.detail : action.payload?.detail,
					playbackStatus: config?.playbackStatus === 'current' ? state?.currentSong?.playbackStatus : action.payload?.playbackStatus,
				},
			};
		},
		newSongs: (state, action: PayloadAction<Song[]>) => {
			state.songs = action.payload.concat(state.songs)
		},
		deleteSong: (state, action: PayloadAction<String>) => {
			const songIndex = state.songs.findIndex(({ id: savedSongId }) => savedSongId === action.payload)
			console.log({ songIndex, songs: state.songs })
			if (songIndex === -1) {
				console.error(`Something went wrong, tried to delete song (id=${action.payload}) but not found in redux state (songs=${state.songs})`)
			} else {
				state.songs = state.songs.splice(songIndex, 1)
			}
		},
	},
})

function makeInitialState(): PlayerState {
	return {
		currentSong: {
			detail: {
				id: '1',
				title: 'Heartless',
				author: 'The Weeknd',
				image: 'https://res.cloudinary.com/jsxclan/image/upload/v1623984884/GitHub/Projects/Musicont/mock/images/heartless_du9yxe.jpg',
				uri: 'https://res.cloudinary.com/jsxclan/video/upload/v1623987046/GitHub/Projects/Musicont/mock/audios/heartless_u7exot.mp3',
				durationMillis: 249740,
			},
		},
		songs: [
			{
				id: '1',
				title: 'Heartless',
				author: 'The Weeknd',
				image: 'https://res.cloudinary.com/jsxclan/image/upload/v1623984884/GitHub/Projects/Musicont/mock/images/heartless_du9yxe.jpg',
				uri: 'https://res.cloudinary.com/jsxclan/video/upload/v1623987046/GitHub/Projects/Musicont/mock/audios/heartless_u7exot.mp3',
				durationMillis: 249740,
			},
		],
	}
};

export type PlaybackSong = {
	playback?: Audio.Sound
	soundObj?: AVPlaybackStatus
	detail?: Song
	playbackStatus?: AVPlaybackStatus
}

export const { setCurrentSong, newSongs, deleteSong, } = playerSlice.actions

export const playerReducer = playerSlice.reducer