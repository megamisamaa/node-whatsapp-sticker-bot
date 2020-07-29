const wa = require('@open-wa/wa-automate');
const moment = require('moment-timezone');

const start = async (client) => {
	console.log(moment.tz('Asia/Jakarta').format() + ' => Bot stiker dimulai');
	// force curr session
	client.onStateChanged((state) => {
		console.log('statechanged', state);
		if (state === 'CONFLICT') client.forceRefocus();
	});
	// handling message
	client.onMessage(async (message) => {
		// image with text #sticker
		if (message.type === 'image' && message.caption === '#sticker') {
			console.log(moment.tz('Asia/Jakarta').format() + ' => Ada yang membuat stiker: ' + message.from + ' ( ' + message.sender.pushname + ' | ' + message.chat.name + ' )');
			const mediaData = await wa.decryptMedia(message);
			const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString('base64')}`;
			client.sendImageAsSticker(message.from, imageBase64);
		}
		// quoted image with text #sticker
		if (message.quotedMsg && message.quotedMsg.type === 'image' && message.body === '#sticker') {
			console.log(moment.tz('Asia/Jakarta').format() + ' => Ada yang membuat stiker: ' + message.from + ' ( ' + message.sender.pushname + ' | ' + message.chat.name + ' )');
			const mediaData = await wa.decryptMedia(message.quotedMsg);
			const imageBase64 = `data:${message.quotedMsg.mimetype};base64,${mediaData.toString('base64')}`;
			client.sendImageAsSticker(message.from, imageBase64);
		}
		// hello message
		if (message.body === '#hi' || message.body === '#hai' || message.body === '#halo' || message.body === '#hello') {
			client.sendText(message.from, 'Hai, untuk membuat stiker kirim gambar atau quote sebuah gambar dengan caption #sticker');
		}
	});
};

// start wa client
wa.create()
	.then((client) => start(client))
	.catch((error) => console.log(error));
