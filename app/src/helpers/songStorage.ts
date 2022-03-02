import { SONG_LIST_KEY } from "../constants"
import { getJson, storeJson } from "./storage"

export const songStorage = {
	saveSong,
	getSongs,
	deleteSong,
	saveSongs,
}
async function saveSong(song: {}) {
	const savedSongs = await getJson(SONG_LIST_KEY)
	const newList = savedSongs === null ? [song] : [song, ...savedSongs]
	await storeJson(SONG_LIST_KEY, newList)
}

async function getSongs() {
	const savedSongs = await getJson(SONG_LIST_KEY)
	return savedSongs === null ? [] : savedSongs
}

async function deleteSong(id: string) {
	const savedSongs = await getJson(SONG_LIST_KEY)
	const songIndex = savedSongs.findIndex(({id: savedSongId}: {id: string}) => savedSongId === id)

	if (songIndex === -1) {
		console.error(`Something went wrong, tried to delete song (id=${id}) but not found in device storage (songs=${savedSongs})`)
	} else {
		savedSongs.splice(songIndex, 1)
	}
	await saveSongs(savedSongs)
}

async function saveSongs(songs: {}[]) {
	await storeJson(SONG_LIST_KEY, songs)
}