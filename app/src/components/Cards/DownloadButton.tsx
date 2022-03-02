import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import Icon, { DownloadedIcon } from '../Icon';
import { api } from '../../api';
import { DISPATCHES } from '../../constants';
import * as FileSystem from 'expo-file-system';
import { songStorage } from '../../helpers/songStorage';
import { RootState } from '../../store/reduxStore';
import { playerSlice } from '../../store/slices/playerSlice';

export const DownloadButton = ({ id, searchTerm, title, duration, author, imageURL }: DownloadButtonProps) => {
	const [isDownloading, setIsDownloading] = useState(false)
	const [isDownloaded, setIsDownloaded] = useState(false)

	const songs = useSelector((state: RootState) => state.player.songs)
	const dispatch = useDispatch()

	const download = async () => {
		setIsDownloading(true)

		try {
			const { uri, fileName } = await api.getDownloadUrl(searchTerm)
			const localFileUri = FileSystem.documentDirectory + id

			const downloadResumable = FileSystem.createDownloadResumable(
				uri,
				localFileUri,
				{},
				() => { }
			);
			const { uri: downloadedFileLocation, status } = (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult;
			console.log(`Finished downloading (uri=${uri}, status=${status})`);
			if (status >= 200 && status < 300) {
				const newSong = {
					id,
					title,
					author,
					image: imageURL,
					uri: downloadedFileLocation,
					durationMillis: duration,
				}
				await songStorage.saveSong(newSong)
				await api.deleteFromS3(fileName)
				dispatch(playerSlice.actions.newSongs([newSong]))
			} else {
				throw new Error(`error downloading (uri=${uri})`)
			}
		} catch (e) {
			setIsDownloading(false)
			console.error(e);
		}
	}

	useEffect(() => {
		if (songs.find(({ id: savedSongId }) => id === savedSongId)) {
			setIsDownloaded(true)
			setIsDownloading(false)
		} else {
			setIsDownloaded(false)
		}
	}, [songs, id])

	const onClick = () => {
		if (isDownloaded) {
			console.info('deleting download')
			// deleteDownload
		} else if (isDownloading) {
			// stopDownloading
		} else {
			download()
		}
	}

	return <View style={styles.right}>
		<TouchableOpacity onPress={onClick}>
			{(() => {
				if (isDownloaded) {
					return <DownloadedIcon />
				} else if (isDownloading) {
					return <Icon family='MaterialCommunityIcons' name="stop-circle-outline" color="orange" />
				} else {
					return <Icon family='MaterialCommunityIcons' name="arrow-down-circle-outline" color="orange" />
				}
			})()}
		</TouchableOpacity>
	</View>
}

const styles = StyleSheet.create({
	left: {},
	middle: {
		flex: 1,
		height: 80,
		marginLeft: 10,
		marginRight: 20,
		justifyContent: 'space-between',
	},
	right: {
		marginRight: 20
	},
});

type DownloadButtonProps = {
	id: string,
	searchTerm: string,
	title: string,
	duration: number,
	author: string,
	imageURL: string
}