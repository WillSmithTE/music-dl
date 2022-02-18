import React, { useEffect, useState, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux'
import Icon, { DownloadedIcon } from '../Icon';
import * as Modal from '../../widgets/Modals';
import millisToMin from '../../helpers/millisToMin';
import { api } from '../../api';
import { useAssets } from 'expo-asset';
import { DISPATCHES, SONG_LIST_KEY } from '../../constants';
import * as FileSystem from 'expo-file-system';
import { getJson, storeJson } from '../../helpers/storage';
import { saveSong } from '../../helpers/songStorage';
import { toString } from '../../util';

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
const mapDispatchToProps = (dispatch) => ({ dispatch });

export const DownloadButton = connect(mapStateToProps, mapDispatchToProps)(
	({ songs, id, searchTerm, dispatch, title, duration, author, imageURL }) => {
		const [isDownloading, setIsDownloading] = useState(false)
		const [isDownloaded, setIsDownloaded] = useState(false)

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
				const { uri: downloadedFileLocation, status } = await downloadResumable.downloadAsync();
				console.log(`Finished downloading (uri=${uri}, status=${status})`);
				if (status >= 200 && status < 300) {
					const newSong = {
						id,
						title,
						author,
						img: imageURL,
						uri: downloadedFileLocation,
						durationMillis: duration,
					}
					await saveSong(newSong)
					await api.deleteFromS3(fileName)
					dispatch({
						type: DISPATCHES.NEW_SONGS,
						payload: {
							newSongs: [newSong]

						}
					})
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
	})

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
