import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, useDispatch } from 'react-redux'
import Icon, { DownloadedIcon } from '../Icon';
import * as FileSystem from 'expo-file-system';
import { playerSlice } from '../../store/slices/playerSlice';

export const DeleteDownloadButton = ({ id, uri }: DeleteDownloadButtonProps) => {

	const dispatch = useDispatch()
	const deleteDownload = async () => {
		console.debug(`Deleting downloaded file (uri=${uri}, id=${id})`)
		try {
			await FileSystem.deleteAsync(uri, { idempotent: true })
			dispatch(playerSlice.actions.deleteSong(id))
			console.debug(`Deletion success (uri=${uri}, id=${id})`)
		} catch (e) {
			console.error(e)
		}

	}

	const onClick = () => {
		deleteDownload()
	}

	return <View style={styles.right}>
		<TouchableOpacity onPress={onClick}>
			<DownloadedIcon />
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

type DeleteDownloadButtonProps = {
	id: string,
	uri: string,
}