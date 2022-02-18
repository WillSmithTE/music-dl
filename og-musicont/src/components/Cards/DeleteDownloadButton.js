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

const mapDispatchToProps = (dispatch) => ({ dispatch });

export const DeleteDownloadButton = connect(null, mapDispatchToProps)(
	({ id, dispatch, uri }) => {

		const deleteDownload = async () => {
			console.debug(`Deleting downloaded file (uri=${uri}, id=${id})`)
			try {
				await FileSystem.deleteAsync(uri, {idempotent: true})
				dispatch({
					type: DISPATCHES.DELETE_SONG,
					payload: { songId: id }
				})
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
