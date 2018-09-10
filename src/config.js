import { Platform } from 'react-native';

let config = global.config = {

	stations: [{
		station_name: {
			full: "Insanity Radio 103.2FM",
			medium: "Insanity Radio",
			short: "Insanity"
		},
		content: {
			audio: {
				// iOS doesn't support our HLS, there is a blip in SBR decoding at the start of each chunk
				// As a result, every 5 seconds quality sounds terrible for 0.1s.
				// Maybe one day, this bug will be fixed... Until then, Icecast!

				ios: 'https://scdnc.insanityradio.com/dash/hls/insanity/index.m3u8',
				android: 'https://scdnc.insanityradio.com/dash/dash/insanity/index.mpd',
				other: 'https://stream.cor.insanityradio.com/insanity128.mp3'
			},
			video: {
				ios: 'https://stream.cor.insanityradio.com/manifest/hls/video.m3u8',
				android: 'https://stream.cor.insanityradio.com/manifest/hls/video.m3u8',
				other: 'https://stream.cor.insanityradio.com/manifest/hls/video.m3u8'
			}
		}
	}]

}

let stationConfig = function (station) {

	let platform = Platform.OS; 
	let myConfig = station;

	this.getNormalisedPlatform = function () {
		switch (platform) {
			case 'ios': return 'ios';
			case 'android': return 'android';
			default: return 'unknown';
		}
	}

	this.getURLForAudio = function () {

		let platform = this.getNormalisedPlatform();
		return myConfig.content.audio[platform]

	}

	this.getURLForVideo = function () {

		let platform = this.getNormalisedPlatform();
		return myConfig.content.video[platform]

	}

	this.getStationName = function () {
		return myConfig.station_name;
	}

}

let Config = new stationConfig(config.stations[0])

export default Config;