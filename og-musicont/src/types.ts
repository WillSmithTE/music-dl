export type SearchResult = {
    song: Song,
}

export type Song = {
    id: string,
    title: string,
    author: string,
    image: string,
    durationMillis: number,
    uri?: string,
}

export const metadataToSong = (songMetadata: any): Song => {
    return {
        id: `${songMetadata.extractor}:${songMetadata.id}`,
        title: songMetadata.title || songMetadata.fulltitle,
        author: songMetadata.uploader,
        image: songMetadata.thumbnail,
        durationMillis: songMetadata.duration * 1000,
    }
}

export type Artist = {
    id?: string,
    name: string,
}