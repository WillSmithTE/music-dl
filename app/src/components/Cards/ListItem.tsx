import React, { useEffect, useState, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux'
import Icon from '../Icon';
import millisToMin from '../../helpers/millisToMin';
import { DownloadButton } from './DownloadButton';
import { DeleteDownloadButton } from './DeleteDownloadButton';
import { RootState } from '../../store/reduxStore';

const ListItem = ({
	id = '',
	style = {},
	imageURL,
	title = 'Song Title',
	author = `Artist Name`,
	duration = 132,
	onPlayPress = () => { },
	moreOptions = [],
	isSearchPage = false,
	searchTerm,
	uri,
}: MusicListProps) => {
	return (
		<>
			<TouchableOpacity style={[styles.container, style]} activeOpacity={0.8}>
				<View style={styles.left}>
					<Image
						style={{
							width: 70,
							height: 70,
							position: 'absolute',
							bottom: -3,
							opacity: 0.5,
							alignSelf: 'center',
						}}
						source={{ uri: imageURL }}
						resizeMode="cover"
						borderRadius={6}
						blurRadius={100}
					/>
					<Image style={styles.coverArt} source={{ uri: imageURL }} resizeMode="cover" borderRadius={6} />
				</View>
				<View style={styles.middle}>
					<View>
						<Text style={styles.title} numberOfLines={2}>
							{title}
						</Text>
						<Text style={styles.author}>{author}</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={styles.duration}>{millisToMin(duration)}</Text>
						{!isSearchPage && <DeleteDownloadButton id={id} uri={uri!!} />}
					</View>
				</View>
				{onPlayPress &&
					<View style={styles.right}>
						<TouchableOpacity onPress={onPlayPress}>
							<Icon family='AntDesign' name="play" color="orange" />
						</TouchableOpacity>
					</View>
				}
				{isSearchPage && <DownloadButton searchTerm={searchTerm!!} id={id} title={title} imageURL={imageURL} duration={duration} author={author} />}


			</TouchableOpacity>
		</>
	);
};

export default ListItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	left: {
		marginLeft: 20
	},
	middle: {
		flex: 1,
		height: 80,
		marginLeft: 10,
		marginRight: 20,
		justifyContent: 'space-between',
	},
	right: {},
	coverArt: {
		width: 80,
		height: 80,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	author: {
		color: '#888',
	},
	duration: {
		color: '#A4A4A4',
	},
	playBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		paddingLeft: 4,
		borderRadius: 100,
		borderWidth: 1.5,
		borderColor: '#FFF',
	},
});

type MusicListProps = {
	id: string,
	style?: {},
	imageURL: string,
	title: string,
	author: string,
	duration: number,
	onPlayPress?: () => void,
	moreOptions?: {}[],
	isSearchPage?: boolean,
	searchTerm?: string,
	uri?: string,
}