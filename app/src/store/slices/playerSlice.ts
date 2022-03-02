import { Song } from "../../types";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Audio, AVPlaybackStatus } from "expo-av";

export interface PlayerState {
	songs: Song[]
}

export const playerSlice = createSlice({
	name: 'player',
	initialState: makeInitialState(),
	reducers: {
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

export const { setCurrentSong, newSongs, deleteSong, } = playerSlice.actions

export const playerReducer = playerSlice.reducer
