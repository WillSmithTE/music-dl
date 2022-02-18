import { player as playerState } from '../states';
import { DISPATCHES } from '../../constants';
import { toString } from '../../util';

const player = (state = playerState, { type = null, payload = {} }) => {
	switch (type) {
		case DISPATCHES.SET_CURRENT_SONG:
			const config = {
				playback: 'current',
				soundObj: 'current',
				detail: 'current',
				playbackStatus: 'current',
				...payload,
			};

			return {
				...state,
				currentSong: {
					playback: config?.playback === 'current' ? state?.currentSong?.playback : payload?.playback,
					soundObj: config?.soundObj === 'current' ? state?.currentSong?.soundObj : payload?.soundObj,
					detail: config?.detail === 'current' ? state?.currentSong?.detail : payload?.detail,
					playbackStatus: config?.playbackStatus === 'current' ? state?.currentSong?.playbackStatus : payload?.playbackStatus,
				},
			};

		case DISPATCHES.NEW_SONGS:
			console.info(`DISPATCHES.NEW_SONGS (newSongs=${toString(payload.newSongs)})`)
			return {
				...state,
				songs: payload.newSongs.concat(state.songs)
			};

		case DISPATCHES.DELETE_SONG:
			const songIndex = state.songs.findIndex(({ id: savedSongId }) => savedSongId === payload.songId)
			console.log({ songIndex, songs: state.songs })
			if (songIndex === -1) {
				console.error(`Something went wrong, tried to delete song (id=${id}) but not found in redux state (songs=${state.songs})`)
				return state
			}
			const newSongs = [...state.songs]
			newSongs.splice(songIndex, 1)
			return {
				...state,
				songs: newSongs,
			}

		default:
			return state;
	}
};

export default player;
