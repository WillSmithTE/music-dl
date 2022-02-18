import { metadataToSong, SearchResult, Song } from "./types"
import { ENV_VARS } from './variables'
import { toString } from "./util"

const db: { songs: Song[] } = {
    songs: []
}

export const api = {
    search: async function (url: string): Promise<Song> {
        console.debug(`search (url=${url})`)
        const encodedUrl = encodeURIComponent(url)
        try {
            const response = await fetch(`${ENV_VARS.apiUrl}/api/metadata?url=${encodedUrl}`)
            if (response.ok) {
                const json = await response.json()
                console.debug(`songMetadata=${toString(json)}`)

                const song: Song = metadataToSong(json)
                console.debug(`song=${toString(song)}`)
                return song
            } else {
                throw new Error(`Search failed (response=${toString(response)}`)
            }
        } catch (e: any) {
            console.error(`error in search - ${e.message}`)
            return Promise.reject(e)
        }
    },
    getDownloadUrl: async function (url: string): Promise<{uri: string, fileName: string}> {
        console.debug(`getDownloadUrl (url=${url})`)
        const encodedUrl = encodeURIComponent(url)
        try {
            const response = await fetch(`${ENV_VARS.apiUrl}/api/media?url=${encodedUrl}`)
            if (response.ok) {
                const json = await response.json()
                console.debug(`response=${toString(json)}`)

                const { uri, fileName } = json
                return { uri, fileName }
            } else {
                console.error(`Get download url failed (response=${response}`)
                throw new Error(`Get download url failed (url=${url})`)
            }
        } catch (e: any) {
            console.error(`error in getDownloadUrl - ${e.message}`)
            return Promise.reject(e)
        }
    },
    deleteFromS3: async function (fileName: string): Promise<void> {
        console.debug(`deleteFromS3 (fileName=${fileName})`)
        const encodedFileName = encodeURIComponent(fileName)


        try {
            const response = await fetch(
                `${ENV_VARS.apiUrl}/api/media?fileName=${encodedFileName}`,
                { method: 'DELETE' }
            )
            if (response.ok) {
                console.debug(`deletedFromS3 (fileName=${fileName})`)
            } else {
                console.error(`Delete failed (response=${response}`)
                throw new Error(`Delete failed (fileName=${fileName})`)
            }
        } catch (e: any) {
            console.error(`error in delete from s3 - ${e.message}`)
            return Promise.reject(e)
        }
    }
}

