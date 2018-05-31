global.config = {

	stations: [{
		station_name: {
			full: "Insanity Radio 103.2FM",
			medium: "Insanity Radio",
			short: "Insanity"
		},
		content: {
			audio: {
				// iOS doesn't support our HLS, there is a blip in SBR decoding at the start of each chunk
				// As a result, every 5 seconds quality sounds terrible for 0.1s
				ios: 'https://stream.cor.insanityradio.com/insanity128.aac',
				android: 'https://stream.cor.insanityradio.com/insanity/hls/insanity.m3u8'
			},
			video: {
				ios: 'https://stream.cor.insanityradio.com/manifest/hls/video.m3u8',
				android: 'https://stream.cor.insanityradio.com/manifest/hls/video.m3u8'
			}
		}
	}]

}
