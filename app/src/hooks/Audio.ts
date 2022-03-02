// TODO: Make it better
import { Audio, AVPlaybackStatus } from 'expo-av';

export const init = async (defaultConfigs = {}) => {
	try {
		const configs = {
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			shouldDuckAndroid: true,
			staysActiveInBackground: true,
			playThroughEarpieceAndroid: false,
			...defaultConfigs,
		};

		await Audio.setAudioModeAsync(configs);
	} catch (error: any) {
		console.log(`[Audio Error][init]: ${error?.message}`);
	}
};

export const playbackStatusUpdate = (playbackObject: Audio.Sound) =>
	(next = (status: AVPlaybackStatus) => console.log({ status })) => {
		if ('setOnPlaybackStatusUpdate' in playbackObject) {
			playbackObject.setOnPlaybackStatusUpdate(next);
		}
	};

export const play = (playbackObject: Audio.Sound, uri: string, shouldPlay = true) =>
	(next: (soundObj: AVPlaybackStatus) => void = () => { }) =>
		(onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void = () => { }) => {
			(async () => {
				try {
					console.debug(`About to play (uri=${uri})`)
					const soundObj = await playbackObject?.loadAsync({ uri }, { shouldPlay });
					console.debug(`soundObj=${JSON.stringify(soundObj, null, 2)}`)
					playbackStatusUpdate(playbackObject)(onPlaybackStatusUpdate);
					next(soundObj);
				} catch (error: any) {
					console.log(`[Audio Error][play]: ${error?.message}`);
				}
			})();
		};

export const configAndPlay = (uri?: string, shouldPlay = true) =>
	(next = (playbackObject: Audio.Sound, status: AVPlaybackStatus) => { }) =>
		(onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void = () => { }) => {
			(async () => {
				try {
					const playbackObject = new Audio.Sound();
					play(
						playbackObject,
						uri!!,
						shouldPlay
					)((soundObj) => {
						next(playbackObject, soundObj);
					})(onPlaybackStatusUpdate);
				} catch (error: any) {
					console.log(`[Audio Error][configAndPlay]: ${error?.message}`);
				}
			})();
		};

export const pause = (playbackObject: Audio.Sound) =>
	(next: (soundObj: AVPlaybackStatus) => void = () => { }) => {
		(async () => {
			try {
				const soundObj = await playbackObject?.pauseAsync();
				next(soundObj);
			} catch (error: any) {
				console.log(`[Audio Error][pause]: ${error?.message}`);
			}
		})();
	};

export const resume = (playbackObject: Audio.Sound) =>
	(next: (soundObj: AVPlaybackStatus) => void = () => { }) => {
		(async () => {
			try {
				const soundObj = await playbackObject?.playAsync();
				next(soundObj);
			} catch (error: any) {
				console.log(`[Audio Error][resume]: ${error?.message}`);
			}
		})();
	};

export const seek = (playbackObject: Audio.Sound, millis: number) =>
	(next: (soundObj: AVPlaybackStatus) => void = () => { }) =>
		(onPlaybackStatusUpdate: (status: AVPlaybackStatus) => void = () => { }) => {
			(async () => {
				try {
					const soundObj = await playbackObject?.playFromPositionAsync(millis);
					playbackStatusUpdate(playbackObject)(onPlaybackStatusUpdate);
					next(soundObj);
				} catch (error: any) {
					console.log(`[Audio Error][seek]: ${error?.message}`);
				}
			})();
		};

export const stop = (playbackObject: Audio.Sound) =>
	(next: (soundObj: {} | null) => void = () => { }) => {
		(async () => {
			try {
				if ('stopAsync' in playbackObject && 'unloadAsync' in playbackObject) {
					const soundObj = await playbackObject?.stopAsync();
					await playbackObject?.unloadAsync();
					next(soundObj);
				} else {
					next(null);
				}
			} catch (error: any) {
				console.log(`[Audio Error][stop]: ${error?.message}`);
			}
		})();
	};
