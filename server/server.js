#!/usr/bin/env node

process.title = 'mediasoup-demo-server';
process.env.DEBUG = process.env.DEBUG || '*INFO* *WARN* *ERROR*';

const config = require('./config');

/* eslint-disable no-console */
//console.log('process.env.DEBUG:', process.env.DEBUG);
//console.log('config.js:\n%s', JSON.stringify(config, null, '  '));
/* eslint-enable no-console */

const fs = require('fs');
const https = require('https');
const url = require('url');
const protoo = require('protoo-server');
const mediasoup = require('mediasoup');
const express = require('express');
const bodyParser = require('body-parser');
const { AwaitQueue } = require('awaitqueue');
const Logger = require('./lib/Logger');
const utils = require('./lib/utils');
const Room = require('./lib/Room');
const interactiveServer = require('./lib/interactiveServer');
const interactiveClient = require('./lib/interactiveClient');
const randomstring = require("randomstring");
const path = require('path');


const logger = new Logger();

// Async queue to manage rooms.
// @type {AwaitQueue}
const queue = new AwaitQueue();

// Map of Room instances indexed by roomId.
// @type {Map<Number, Room>}
const rooms = new Map();


// Map of breakout Room instances indexed by roomId.
// @type {Map<Number, Room>}
const breakoutrooms = new Map();

// HTTPS server.
// @type {https.Server}
let httpsServer;

// Express application.
// @type {Function}
let expressApp;

// Protoo WebSocket server.
// @type {protoo.WebSocketServer}
let protooWebSocketServer;

// mediasoup Workers.
// @type {Array<mediasoup.Worker>}
const mediasoupWorkers = [];

// Index of next mediasoup Worker to use.
// @type {Number}
let nextMediasoupWorkerIdx = 0;

run();

async function run()
{
	// Open the interactive server.
	await interactiveServer();

	// Open the interactive client.
	if (process.env.INTERACTIVE === 'true' || process.env.INTERACTIVE === '1')
		await interactiveClient();

	// Run a mediasoup Worker.
	await runMediasoupWorkers();

	// Create Express app.
	await createExpressApp();

	// Run HTTPS server.
	await runHttpsServer();

	// Run a protoo WebSocketServer.
	await runProtooWebSocketServer();

	// Log rooms status every X seconds.
	setInterval(() =>
	{
		//console.log("Main rooms Vimala",rooms);
		//console.log("breakout rooms Vimala",breakoutrooms);
		for (const room of rooms.values())
		{
			
			room.logStatus();
		}
	}, 120000);
}

/**
 * Launch as many mediasoup Workers as given in the configuration file.
 */
async function runMediasoupWorkers()
{
	const { numWorkers } = config.mediasoup;

	logger.info('running %d mediasoup Workers...', numWorkers);

	for (let i = 0; i < numWorkers; ++i)
	{
		const worker = await mediasoup.createWorker(
			{
				logLevel   : config.mediasoup.workerSettings.logLevel,
				logTags    : config.mediasoup.workerSettings.logTags,
				rtcMinPort : Number(config.mediasoup.workerSettings.rtcMinPort),
				rtcMaxPort : Number(config.mediasoup.workerSettings.rtcMaxPort)
			});

		worker.on('died', () =>
		{
			logger.error(
				'mediasoup Worker died, exiting  in 2 seconds... [pid:%d]', worker.pid);

			setTimeout(() => process.exit(1), 2000);
		});

		mediasoupWorkers.push(worker);

		// Create a WebRtcServer in this Worker.
		if (process.env.MEDIASOUP_USE_WEBRTC_SERVER !== 'false')
		{
			// Each mediasoup Worker will run its own WebRtcServer, so those cannot
			// share the same listening ports. Hence we increase the value in config.js
			// for each Worker.
			const webRtcServerOptions = utils.clone(config.mediasoup.webRtcServerOptions);
			const portIncrement = mediasoupWorkers.length - 1;

			for (const listenInfo of webRtcServerOptions.listenInfos)
			{
				listenInfo.port += portIncrement;
			}

			const webRtcServer = await worker.createWebRtcServer(webRtcServerOptions);

			worker.appData.webRtcServer = webRtcServer;
		}

		// Log worker resource usage every X seconds.
		setInterval(async () =>
		{
			const usage = await worker.getResourceUsage();

			logger.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
		}, 120000);
	}
}

/**
 * Create an Express based API server to manage Broadcaster requests.
 */
async function createExpressApp()
{
	logger.info('creating Express app...');

	expressApp = express();

	expressApp.use(bodyParser.json());

	/**
	 * For every API request, verify that the roomId in the path matches and
	 * existing room.
	 */
	expressApp.param(
		'roomId', (req, res, next, roomId) =>
		{
			// The room must exist for all API requests.
			if (!rooms.has(roomId))
			{
				const error = new Error(`room with id "${roomId}" not found`);

				error.status = 404;
				throw error;
			}

			req.room = rooms.get(roomId);
			
			logger.info("req.room",req.room);
			next();
		});

	/**
	 * API GET resource that returns the mediasoup Router RTP capabilities of
	 * the room.
	 */
	expressApp.get(
		'/rooms/:roomId', (req, res) =>
		{

			logger.info('Node server method calling....  : ');
			const data = req.room.getRouterRtpCapabilities();

			res.status(200).json(data);
		});


		// expressApp.get('/api/greet', (req, res) => {
		// 	logger.info('Node server method calling....  : ');
		// 	const name = req.query.name || 'Guest';
		// 	logger.info('Node server method calling....  : ',name);
		// 	res.send(`Hello, ${name}!`);
		//   });

	// 	expressApp.get(
	// 		'/rooms/:roomId/addroom', (req, res) => {
	// 		var url = req.url; room_id = url.split('/')[2];
	// 		console.log("======= Add romm request ===========");
	// 		console.log("=======RoomId===========",room_id);
	// 		createChildRoom("BreakOut01","0");
	// 		const msg = "Success";
	// 		res.status(200).send(msg);
	//  });

		expressApp.get(
			'/rooms/:roomId/broadcast', (req, res) => {
			var url = req.url; room_id = url.split('/')[2];
			const { exec } = require("child_process");

			const files = fs.readdirSync('../broadcasters/video');
  			// Choose a random index
  			const randomIndex = Math.floor(Math.random() * files.length);
  			// Get the random file from the chosen index
  			const randomFile = files[randomIndex];
			const media_file = '../broadcasters/video/'+randomFile;
			console.log("Random file name :::",media_file);

			exec("../broadcasters/gstreamer.sh", {
					env: {
							'SERVER_URL': 'https://192.168.1.34:4443', 
							'ROOM_ID': `${room_id}`,
							'MEDIA_FILE': `${media_file}`
					}
			}, (error, stdout, stderr) => {
					if (error) {
							console.log(`error: ${error.message}`);
							return;
					} if (stderr) {
							console.log(`stderr: ${stderr}`);
							return;
					}
					console.log(`stdout: ${stdout}`);
			});
			console.log("Broadcast file running");
			const msg = "Running broadcast file";
			res.status(200).send(msg);
	 });
	/**
	 * POST API to create a Broadcaster.
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters', async (req, res, next) =>
		{
			const {
				id,
				displayName,
				device,
				rtpCapabilities
			} = req.body;

			try
			{

				var url = req.url; room_id = url.split('/')[2];

				const data = await req.room.createBroadcaster(
					{
						id,
						displayName,
						device,
						rtpCapabilities,
						room_id
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});

	/**
	 * DELETE API to delete a Broadcaster.
	 */
	expressApp.delete(
		'/rooms/:roomId/broadcasters/:broadcasterId', (req, res) =>
		{
			const { broadcasterId } = req.params;

			req.room.deleteBroadcaster({ broadcasterId });

			res.status(200).send('broadcaster deleted');
		});

	/**
	 * POST API to create a mediasoup Transport associated to a Broadcaster.
	 * It can be a PlainTransport or a WebRtcTransport depending on the
	 * type parameters in the body. There are also additional parameters for
	 * PlainTransport.
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters/:broadcasterId/transports',
		async (req, res, next) =>
		{
			const { broadcasterId } = req.params;
			const { type, rtcpMux, comedia, sctpCapabilities } = req.body;

			try
			{
				const data = await req.room.createBroadcasterTransport(
					{
						broadcasterId,
						type,
						rtcpMux,
						comedia, 
						sctpCapabilities
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});

	/**
	 * POST API to connect a Transport belonging to a Broadcaster. Not needed
	 * for PlainTransport if it was created with comedia option set to true.
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters/:broadcasterId/transports/:transportId/connect',
		async (req, res, next) =>
		{
			const { broadcasterId, transportId } = req.params;
			const { dtlsParameters } = req.body;

			try
			{
				const data = await req.room.connectBroadcasterTransport(
					{
						broadcasterId,
						transportId,
						dtlsParameters
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});

	/**
	 * POST API to create a mediasoup Producer associated to a Broadcaster.
	 * The exact Transport in which the Producer must be created is signaled in
	 * the URL path. Body parameters include kind and rtpParameters of the
	 * Producer.
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters/:broadcasterId/transports/:transportId/producers',
		async (req, res, next) =>
		{
			const { broadcasterId, transportId } = req.params;
			const { kind, rtpParameters } = req.body;

			try
			{
				const data = await req.room.createBroadcasterProducer(
					{
						broadcasterId,
						transportId,
						kind,
						rtpParameters
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});


		

	/**
	 * POST API to create a mediasoup Consumer associated to a Broadcaster.
	 * The exact Transport in which the Consumer must be created is signaled in
	 * the URL path. Query parameters must include the desired producerId to
	 * consume.
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters/:broadcasterId/transports/:transportId/consume',
		async (req, res, next) =>
		{
			const { broadcasterId, transportId } = req.params;
			const { producerId } = req.query;

			try
			{
				const data = await req.room.createBroadcasterConsumer(
					{
						broadcasterId,
						transportId,
						producerId
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});

	/**
	 * POST API to create a mediasoup DataConsumer associated to a Broadcaster.
	 * The exact Transport in which the DataConsumer must be created is signaled in
	 * the URL path. Query body must include the desired producerId to
	 * consume.
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters/:broadcasterId/transports/:transportId/consume/data',
		async (req, res, next) =>
		{
			const { broadcasterId, transportId } = req.params;
			const { dataProducerId } = req.body;

			try
			{
				const data = await req.room.createBroadcasterDataConsumer(
					{
						broadcasterId,
						transportId,
						dataProducerId
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});
	
	/**
	 * POST API to create a mediasoup DataProducer associated to a Broadcaster.
	 * The exact Transport in which the DataProducer must be created is signaled in
	 */
	expressApp.post(
		'/rooms/:roomId/broadcasters/:broadcasterId/transports/:transportId/produce/data',
		async (req, res, next) =>
		{
			const { broadcasterId, transportId } = req.params;
			const { label, protocol, sctpStreamParameters, appData } = req.body;

			try
			{
				const data = await req.room.createBroadcasterDataProducer(
					{
						broadcasterId,
						transportId,
						label,
						protocol,
						sctpStreamParameters,
						appData
					});

				res.status(200).json(data);
			}
			catch (error)
			{
				next(error);
			}
		});

	/**
	 * Error handler.
	 */
	expressApp.use(
		(error, req, res, next) =>
		{
			if (error)
			{
				logger.warn('Express app %s', String(error));

				error.status = error.status || (error.name === 'TypeError' ? 400 : 500);

				res.statusMessage = error.message;
				res.status(error.status).send(String(error));
			}
			else
			{
				next();
			}
		});
}

/**
 * Create a Node.js HTTPS server. It listens in the IP and port given in the
 * configuration file and reuses the Express application as request listener.
 */
async function runHttpsServer()
{
	logger.info('running an HTTPS server...');

	// HTTPS server for the protoo WebSocket server.
	const tls =
	{
		cert : fs.readFileSync(config.https.tls.cert),
		key  : fs.readFileSync(config.https.tls.key)
	};

	httpsServer = https.createServer(tls, expressApp);

	await new Promise((resolve) =>
	{
		httpsServer.listen(
			Number(config.https.listenPort), config.https.listenIp, resolve);
	});
}

/**
 * Create a protoo WebSocketServer to allow WebSocket connections from browsers.
 */
async function runProtooWebSocketServer()
{
	logger.info('running protoo WebSocketServer...');

	// Create the protoo WebSocket server.
	protooWebSocketServer = new protoo.WebSocketServer(httpsServer,
		{
			maxReceivedFrameSize     : 960000, // 960 KBytes.
			maxReceivedMessageSize   : 960000,
			fragmentOutgoingMessages : true,
			fragmentationThreshold   : 960000
		});

	// Handle connections from clients.
	protooWebSocketServer.on('connectionrequest', (info, accept, reject) =>
	{
		// The client indicates the roomId and peerId in the URL query.
		//console.log('websocket info',info);
		const u = url.parse(info.request.url, true);
		let roomId = u.query['roomId'];
		let peerId = u.query['peerId'];
		let roomName = u.query['roomName'];
		let parentId = u.query['parentId'];
		
		let associateId = '';
		// if (roomId.includes("$")){
		//   roomId = roomId.split('$')[0];
		//   associateId = roomId.split('$')[1];
		// }

		

		// if(peerId == 0){
		//     associateId = roomId;
		//     // Generate a random string of specified length
		// 	roomId = randomstring.generate(8);
	    // }
		

		
		logger.info('Room Id --> ', roomId);
		logger.info('parentId --> ', parentId);
		logger.info('peerId --> ', peerId);
		

		//const roomId ="pqupbb9x";
		//const peerId ="glwtakli";
		//const breakoutroomId = 'zedz7dup';

		if (!roomId || !peerId)
		{
			reject(400, 'Connection request without roomId and/or peerId');

			return;
		}

		let consumerReplicas = Number(u.query['consumerReplicas']);

		if (isNaN(consumerReplicas))
		{
			consumerReplicas = 0;
		}

		logger.info(
			'protoo connection request [roomId:%s, roomName:%s, peerId:%s, address:%s, origin:%s]',
			roomId, roomName, peerId, info.socket.remoteAddress, info.origin);

		// Serialize this code into the queue to avoid that two peers connecting at
		// the same time with the same roomId create two separate rooms with same
		// roomId.
		queue.push(async () =>
		{
			// console.log("break details",roomName.includes('Break'));
			// if(roomName.includes('Break')){
			// 	const room = await getOrCreateBreakoutRoom({ roomId, roomName, consumerReplicas });
			// 	// Accept the protoo WebSocket connection.
			// 	const protooWebSocketTransport = accept();
				
			// 	//console.log("peerId Details2",peerId);
			// 	room.handleProtooConnection({ peerId, protooWebSocketTransport });
			// }
			// else{
				let nestedRoomId = '0';
				// let room;
				
				// if(peerId == 0){
				// 	logger.info('<----------- If block calling   ---------->');
				// 	//nestedRoomId = await getNestedRommId({ parentId, roomName});
				// 	associateId = parentId;
				// 	//roomId   =  nestedRoomId;
				// 	let roomInfo={};
				// 	let room = rooms.get(roomId);
	 			// 	if (!room)
				// 	 roomInfo = checkRoomInfo({roomId});

				// 	 if (Object.keys(roomInfo).length !== 0) {
				// 	    logger.info('roomInfo.roomName ::',roomInfo.roomName);
				// 	    roomName = roomInfo.roomName;
				// 	 }



				//     room = await getOrCreateRoom({ roomId, roomName, consumerReplicas});
				// 	if(associateId != '0' && associateId != roomId)
				//     room = await getAllNestedPeers({ room, associateId});
				// 	//notifyAssPeers({ room });
				// 	peerId = randomstring.generate(8);
				// 	const protooWebSocketTransport = accept();
				// 	//logger.info('peerId before   ::  -->', peerId);
				// 	room.handleProtooConnection({ peerId, protooWebSocketTransport });
				// 	// if(associateId != roomId)
				// 	// setAssociatePeer({ room, associateId});
				// 	// notifyAssPeers({ room, peerId,associateId});
				// 	// accept();
		        // }
				// else{


					let roomInfo={};
					parentId = '0';
					let room = rooms.get(roomId);
	 				if (!room){
					 roomInfo = await checkRoomInfo({roomId});

						if (Object.keys(roomInfo).length != 0) {
						logger.info('Creating Child room ::',roomInfo.roomName);
						roomName = roomInfo.roomName;
						parentId = roomInfo.parentId;
						}
					}
					else
					parentId = room._rootId;

					//  parentId = (parentId === '0')? roomId : parentId;

					 logger.info('Parent Id::',parentId);
					 logger.info('Room Name ::',roomName);

					room = await getOrCreateRoom({ roomId, roomName, consumerReplicas, parentId});
					room = await getAllNestedPeers({ room,roomId,parentId });
					// Accept the protoo WebSocket connection.
					const protooWebSocketTransport = accept();
					//console.log("peerId Details2",peerId);
					room.handleProtooConnection({ peerId, protooWebSocketTransport });
					// logger.info('After handleProtooConnection  ::  -->', room);
				// }
			//}
		})
			.catch((error) =>
			{
				logger.error('room creation or room joining failed:%o', error);

				reject(error);
			});
	});

	protooWebSocketServer.on('addingRoom', (info, accept, reject) =>
	{
		logger.info('<-------- adding room --------> ');

	});


}

/**
 * Get a Associate room peers.
 */
 async function checkRoomInfo({ roomId })
 {
	 let roomInfo={};

	 rooms.forEach((value, key) => {

		if (value._childId.has(roomId)) {
			// logger.info('child Ids :: ',value._childId);
			// logger.info('child Ids room name  :: ',value._childId.get(roomId));
			let rootId = (value._rootId === '0') ? value._roomId : value._rootId;
			roomInfo =
			{
				parentId : rootId,
				roomName : value._childId.get(roomId)
			};
			return true;
		}

	  });
	 
	 return roomInfo;
 }

 /**
 * Get a Associate room peers.
 */
  async function getAllNestedPeers({ room, roomId, parentId })
  {
	  let ass_peers=[];
 
	  rooms.forEach((value, key) => {
		
			if (room._rootId === '0' && room._childId.has(value._roomId)){
				// logger.info('===== Inside If =====');
				let classValuesArray = Array.from(value._protooRoom._peers.values());
				ass_peers = ass_peers.concat(classValuesArray.filter((peer) => peer.data.joined));
			}
		   else if (value._rootId === room._rootId || value._roomId === room._rootId){
			// logger.info('===== _rootId matched =====');
			 let classValuesArray = Array.from(value._protooRoom._peers.values());
			 ass_peers = ass_peers.concat(classValuesArray.filter((peer) => peer.data.joined));
			}

	   });
 
	   room._breakoutRoomsObj =  ass_peers;
	//    logger.info('ass_peers  : ', ass_peers);

	  return room;
  }

 /**
 * Get a Associate room peers.
 */
  async function getAllNestedPeersBK2({ room, roomId, parentId })
  {
	  let ass_room;
	  let ass_peers=[];

	  logger.info('roomId  : ', roomId);
	  logger.info('parentId  : ', parentId);
 
	  if (typeof parentId !== "undefined" && parentId !== "" && parentId !== "0"  && parentId !== roomId) {
		  ass_room = rooms.get(parentId);
 
		  if (typeof ass_room !== "undefined" && ass_room !== "") {
			  room._rootId = parentId;
			  let classValuesArray = Array.from(ass_room._protooRoom._peers.values());
			  ass_peers = classValuesArray.filter((peer) => peer.data.joined);
		  }
	  }

	  logger.info('parent ass_peers  : ', ass_peers);
 
	  rooms.forEach((value, key) => {
		  if (value._childId.has(roomId) && value._roomId !== parentId){
			 let classValuesArray = Array.from(value._protooRoom._peers.values());
			 ass_peers.concat(classValuesArray.filter((peer) => peer.data.joined));
			}
	   });
 
	   room._breakoutRoomsObj =  ass_peers;
	   logger.info('ass_peers  : ', ass_peers);
	  
	  return room;
  }

/**
 * Get a Associate room peers.
 */
 async function getAllNestedPeersBK({ room, associateId})
 {
	 let ass_room;
	 let ass_peers=[];

	 if (typeof associateId !== "undefined" && associateId !== "") {
		 ass_room = rooms.get(associateId);

		 if (typeof ass_room !== "undefined" && ass_room !== "") {
			 room._rootId = associateId;
			 let classValuesArray = Array.from(ass_room._protooRoom._peers.values());
			 //logger.info('classValuesArray : ', classValuesArray);
			 ass_peers = classValuesArray.filter((peer) => peer.data.joined);
			 //logger.info('ass_peers  : ', ass_peers);
			
		 }
	 }

	 rooms.forEach((value, key) => {
		if (value._rootId === associateId) {
			 
			let classValuesArray = Array.from(value._protooRoom._peers.values());
			ass_peers = ass_peers.push(classValuesArray.filter((peer) => peer.data.joined));

		   }
	  });

	  room._breakoutRoomsObj =  ass_peers;
	  logger.info('ass_peers  : ', ass_peers);
	 
	 return room;
 }


async function createChildRoom(roomName,parentRoomId)
{
	let room;
	let consumerReplicas = 0;
	
	let roomId = randomstring.generate(8);
	logger.info('<----------- Else block calling   ---------->');
	room = await getOrCreateRoom({ roomId, roomName, consumerReplicas});
	// Accept the protoo WebSocket connection.
	createPeer(room);
}

async function createPeer(room)
{
	console.info('########### createPeer ###############');


	let device = {
		flag    : 'broadcaster',
		name    : 'Unknown device',
		version : '0'
	};
	let peerId  = randomstring.generate(8);
    let  peer = room._protooRoom.createPeer(peerId, "");
	let displayName = 'BreakOutRoom' + randomstring.generate(8);
	
	let roomId  = randomstring.generate(8);

	try
	{
		peer._id = peerId;
		peer.data.breakoutroomName = displayName;
		peer.data.consume = '';
		peer.data.joined = true;
		peer.data.displayName = 'HEADER';				

		// Have mediasoup related maps ready even before the Peer joins since we
		// allow creating Transports before joining.
		peer.data.transports = new Map();
		peer.data.producers = new Map();
		peer.data.consumers = new Map();
		peer.data.dataProducers = new Map();
		peer.data.dataConsumers = new Map();
		peer.data.roomId = roomId;
		peer.data.parentId = parentId;
		peer.data.breakoutroom = '';
		

		peer.data.device = device;
		peer.data.rtpCapabilities = "";
		peer.data.sctpCapabilities = "";
	}
	catch (error)
	{
		logger.error('protooRoom.createPeer() failed:%o', error);
	}

	//logger.info('Dummy Peer  ::: ', peer);

	room._protooRoom.peers.push(peer);

	// let joinedPeers =
	// [
	// 	...this._getJoinedPeers(),
	// 	...this._broadcasters.values()
	// ];

	// let joinedAssPeers =
	// [
	// 	...this._getAssJoinedPeers(),
	// 	...this._broadcasters.values()
	// ];

	// // _breakoutRoomsObj contains breakout room's peers
	//   console.info(' JoinedPeers :::',joinedPeers);

	
	// for (const joinedPeer of joinedPeers)
	// {
	// 	// Create Consumers for existing Producers.
	// 	for (const producer of joinedPeer.data.producers.values())
	// 	{
	// 		this._createConsumer(
	// 			{
	// 				consumerPeer : peer,
	// 				producerPeer : joinedPeer,
	// 				producer
	// 			});
	// 	}

	// 	// Create DataConsumers for existing DataProducers.
	// 	for (const dataProducer of joinedPeer.data.dataProducers.values())
	// 	{
	// 		if (dataProducer.label === 'bot')
	// 			continue;

	// 		this._createDataConsumer(
	// 			{
	// 				dataConsumerPeer : peer,
	// 				dataProducerPeer : joinedPeer,
	// 				dataProducer
	// 			});
	// 	}
	// }

	// // Create DataConsumers for bot DataProducer.
	// this._createDataConsumer(
	// 	{
	// 		dataConsumerPeer : peer,
	// 		dataProducerPeer : null,
	// 		dataProducer     : this._bot.dataProducer
	// 	});

	// // Notify other joined Peers.
	// for (const otherPeer of this._getAssJoinedPeers({ excludePeer: peer }))
	// {
	// 	otherPeer.notify(
	// 		'newPeer',
	// 		{
	// 			id           : peerId,
	// 			displayName  : 'HEADER',
	// 			device       : device,
	// 			breakoutroomName : displayName,
	// 			roomId : roomId,
	// 			parentRoomId: this._roomId
	// 		})
	// 		.catch(() => {});
	// }

	
}



/**
 * Get next mediasoup Worker.
 */
function getMediasoupWorker()
{
	const worker = mediasoupWorkers[nextMediasoupWorkerIdx];

	if (++nextMediasoupWorkerIdx === mediasoupWorkers.length)
		nextMediasoupWorkerIdx = 0;

	return worker;
}

/**
 * Get a Room instance (or create one if it does not exist).
 */
async function getOrCreateRoom({ roomId, roomName, consumerReplicas, parentId})
{
	
	let room = rooms.get(roomId);

	// If the Room does not exist create a new one.
	if (!room)
	{
		logger.info('creating a new Room. [roomId:%s]', roomId);
		
		const mediasoupWorker = getMediasoupWorker();

		room = await Room.create({ mediasoupWorker, roomId, consumerReplicas })
		room._roomName = roomName;
		if(parentId !== roomId)
		room._rootId = parentId;
		room._rooms = rooms;
		room._childId= new Map();
		rooms.set(roomId, room);
		// logger.info('New Room details  -->', room);
		
		room.on('close', () => rooms.delete(roomId));
	}

	logger.info('All rooms  -->', rooms);
	
	
	return room;
	
}

/**
 * Get a Associate room peers.
 */
 async function getOrSetAssociateRooms({ room, associateId})
 {
	 let ass_room;
	 let ass_peers=[];
 
	 logger.info('Peers  : ', room._protooRoom._peers);
	 logger.info('parent Id :::  : ',associateId);
	 
	 if (typeof associateId !== "undefined" && associateId !== "") {
		 ass_room = rooms.get(associateId);
		 logger.info('associateRoom  details : ', ass_room);

		 if (typeof ass_room !== "undefined" && ass_room !== "") {
			 room._rootId = associateId;
			 let classValuesArray = Array.from(ass_room._protooRoom._peers.values());
			 logger.info('classValuesArray : ', classValuesArray);
			 ass_peers = classValuesArray.filter((peer) => peer.data.joined);
			 logger.info('ass_peers  : ', ass_peers);
			 room._breakoutRoomsObj =  ass_peers;
			 logger.info('main room fetching  : ', room);
		 }
	 }
	
	 
	 return room;
 }

 

 /**
 * Get  nested room id.
 */
  async function getNestedRommId({parentId, roomName})
  {
	  let ass_room;
	  let ass_peers=[];
	  let nestedRoomId = "0";

	  logger.info('associateId in getNestedRommId   : ', parentId);
  
	  if (typeof parentId !== "undefined" && parentId !== "") {
		  ass_room = rooms.get(parentId);
		  logger.info('ass_room in getNestedRommId   : ', ass_room);
		  logger.info('roomName in getNestedRommId   : ', roomName);
		  if (typeof ass_room !== "undefined" && ass_room !== "") {
			  let classValuesArray = Array.from(ass_room._protooRoom._peers.values());
			  logger.info('classValuesArray in getNestedRommId   : ', classValuesArray);
			  ass_peers = classValuesArray.filter((peer) => peer.data.breakoutroomName == roomName);
			  logger.info('ass_peers in getNestedRommId   : ', ass_peers);
			  logger.info('Nested room Id   : ', ass_peers[0].data.breakoutroomId);
			  nestedRoomId = ass_peers[0].data.breakoutroomId;
		  }
	  }
	  
	  return nestedRoomId;
  }


/**
 * Get a Associate room peers.
 */
   async function setAssociatePeer({ room, associateId})
   {
	   let ass_room;
	   let ass_peers=[];
	   
	   if (typeof associateId !== "undefined" && associateId !== "") {
		   ass_room = rooms.get(associateId);
		   logger.info('setAssociatePeer --> associateRoom  details : ', ass_room);
 
		   if (typeof ass_room !== "undefined" && ass_room !== "") {
			   let classValuesArray = Array.from(ass_room._protooRoom._peers.values());
			   let curRoomPeers = Array.from(room._protooRoom._peers.values());
			   let mergedArray = classValuesArray.concat(curRoomPeers);
			   mergedArray = mergedArray.filter((peer) => peer.data.joined && peer.data.joined);
			   ass_room._breakoutRoomsObj =  mergedArray;
			   //ass_room._protooRoom._peers = mergedArray;
			   logger.info('ass_room --> setAssociatePeer   :::: ', ass_room);
		   }
	   }
   }

/**
 * Get a Room instance (or create one if it does not exist).
 */
 async function notifyAssPeers({ room, peerId, associateId })
 {
	let joinedPeers;
	let curRoomPeers = Array.from(room._protooRoom._peers.values());
	curPeer = curRoomPeers.filter((peer) => peer._id == peerId);

	if (typeof room._breakoutRoomsObj !== "undefined" && Array.isArray(room._breakoutRoomsObj) && room._breakoutRoomsObj.length !== 0)
			joinedPeers = room._breakoutRoomsObj;

		// Notify the new Peer to all other Peers.
	if (typeof joinedPeers !== "undefined" && joinedPeers !== "") {
		for (const otherPeer of joinedPeers)
		{
			otherPeer.notify(
				'newPeer',
				{
					id           : peerId,
					displayName  : curPeer[0].data.displayName,
					device       : curPeer[0].data.device,
					breakoutroomName : curPeer[0].data.breakoutroomName,
					roomId : curPeer[0].data.roomId,
					parentId: associateId
				})
				.catch(() => {});
		}
	}
 }




 
