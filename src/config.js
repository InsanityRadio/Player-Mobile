import { AsyncStorage, Platform } from 'react-native';

let VERSION = global.VERSION = '1.2';

let config = global.config = {

	stations: [{
		station_name: {
			full: "Insanity Radio 103.2FM",
			medium: "Insanity Radio",
			short: "Insanity"
		},
		bootstrap: 'https://insanityradio.com/listen/bootstrap.json',

		// Bootstrap should provide us with the following info. We should load it on boot. 
		_content: {
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
			},
			schedule: 'https://insanityradio.com/listen/load_status.json',
			meta: 'https://webapi.insanityradio.com/subscribe?id=1&last=1'
		}
	}]

}

let stationConfig = function (station) {

	let platform = Platform.OS; 
	let myConfig = station;

	this.version = VERSION;

	this.loadConfig = function () {

		return AsyncStorage.getItem('@Insanity:config').then((config) => {

			try {
				if (config != null && JSON.parse(config).version > 0) {
					config = JSON.parse(config)
					console.log('Loaded saved configuration, its version number is', config.version);
					myConfig.content = config.config;
				} else {
					console.log('No configuration saved, using default')
					myConfig.content = myConfig._content;
				}
			} catch (e) {
				// Did something go wrong loading our data? Delete it and use the default.
				AsyncStorage.setItem('@Insanity:config', null);
				console.warn('Saved configuration is corrupt, using default')
				myConfig.content = myConfig._content;
			}

			this.loadConfigFromServer();

			return myConfig;

		})
		.catch((e) => {
			AsyncStorage.setItem('@Insanity:config', null);
			console.warn('Exception was thrown somewhere in AsyncStorage, wiping & using default')
			myConfig.content = myConfig._content;
			// Return allows us to continue like normal
			return myConfig;
		})

	}

	this.loadConfigFromServer = function () {
		fetch(myConfig.bootstrap + '?version=' + VERSION)
		.then((data) => data.json())
		.then((data) => this.setConfig(data))
		.catch((e) => x.warn('Error loading web data!', e))
	}

	this.setConfig = function (config) {
		console.log('Reloaded configuration, its version number is', config.version)
		AsyncStorage.setItem('@Insanity:config', JSON.stringify(config))
	}

	this.getURLForSchedule = function () {
		return myConfig.content.schedule + '?version=' + VERSION;
	}

	this.getURLForNowPlaying = function () {
		return myConfig.content.meta;
	}

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