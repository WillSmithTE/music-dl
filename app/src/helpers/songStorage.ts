import { SONG_LIST_KEY } from "../constants"
import { getJson, storeJson } from "./storage"

export const saveSong = async (song: {}) => {
	const savedSongs = await getJson(SONG_LIST_KEY)
	const newList = savedSongs === null ? [song] : [song, ...savedSongs]
	await storeJson(SONG_LIST_KEY, newList)
}

export const getSongs = async () => {
	const savedSongs = await getJson(SONG_LIST_KEY)
	return savedSongs === null ? [] : savedSongs
}

export const deleteSong = async (id: string) => {
	const savedSongs = await getJson(SONG_LIST_KEY)
	const songIndex = savedSongs.findIndex(({id: savedSongId}: {id: string}) => savedSongId === id)

	if (songIndex === -1) {
		console.error(`Something went wrong, tried to delete song (id=${id}) but not found in device storage (songs=${savedSongs})`)
	} else {
		savedSongs.splice(songIndex, 1)
	}
	await saveSongs(savedSongs)
}


export const saveSongs = async (songs: {}[]) => {
	await storeJson(SONG_LIST_KEY, songs)
}