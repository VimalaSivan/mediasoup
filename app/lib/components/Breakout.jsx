// import React from 'react';
import React, { useEffect, useState,Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import clipboardCopy from 'clipboard-copy';
import { Appear } from './transitions';
import RoomClient from '../RoomClient';
import { withRoomContext } from '../RoomContext';
import * as stateActions from '../redux/stateActions';
import * as appPropTypes from './appPropTypes';
import * as requestActions from '../redux/requestActions';
import randomString from 'random-string';
import deviceInfo from '../deviceInfo';
import UrlParse from 'url-parse';
import * as cookiesManager from '../cookiesManager';
import { getProtooUrl } from '../urlFactory';
import randomName from '../randomName';
import * as faceapi from 'face-api.js';
import thunk from 'redux-thunk';
import reducers from '../redux/reducers';
const http = require('http');
const reduxMiddlewares = [thunk];
const BotMessageRegex = new RegExp('^@bot (.*)');
class Breakout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: 'React',
			data: [0],
			list: [],
			itemName: 'Breakoutroom',
			term: "",
			removeHideShow: false,
			inviteHideShow:true,
			mainRoomId:0,
			showing: false,
			showingbtn:false,
			showingBtnNext:true,
			btnDiff: 1,
			active: false,
            activeIdList:[],
			text : ''
		};
		this.node = React.createRef()
		this.showParticipants.bind(this);

		// TextArea element got via React ref.
		// @type {HTMLElement}
		this._textareaElem = null;


	}

	// joinParentRoom = (e) => {

	// 	try { 
	// 		let currentRoomid = location.href.split("&")[1].split("=")[1];
	// 		 console.log("currentRoomid :: ",currentRoomid);
	// 		 const res = await fetch('https://192.168.1.34:4443/rooms/'+currentRoomid+'/broadcast',{
	// 				 mode: 'no-cors',
	// 				 method: "get",
	// 				 headers: {
	// 						 "Content-Type": "application/json"
	// 				 }
	// 		 });

	// 		 console.log("data----", JSON.stringify(res))
	// 		} 
	// 	catch (error) {
	// 				console.log("error----", error)
	// 		}
	// }
	

	joinParentRoom = (e) => {

		let roomId   = "";
		let roomName = "";
		let peerId = "0";
		let parentId = "0";
		
		const urlParser = new UrlParse(window.location.href, true);
		const device = deviceInfo();

		roomId = location.href.split("&")[1].split("=")[1];
		const consumerReplicas = urlParser.query.consumerReplicas;
		roomName = document.getElementById('brId').value;
		document.getElementById('brId').value = '';
		
		this.props.roomClient.roomId = roomId;
		this.props.roomClient.roomName = roomName;
		this.props.roomClient.peerId = peerId;
		this.props.roomClient.device = device
		this.props.roomClient.handlerName = urlParser.query.handlerName || urlParser.query.handler;
		this.props.roomClient.useSimulcast = urlParser.query.simulcast !== 'false';
		this.props.roomClient.useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
		this.props.roomClient.forceTcp = urlParser.query.forceTcp === 'true';
		this.props.roomClient.produce = urlParser.query.produce !== 'false';
		this.props.roomClient.consume = urlParser.query.consume !== 'false';
		this.props.roomClient.forceH264 = urlParser.query.forceH264 === 'true';
		this.props.roomClient.forceVP9 = urlParser.query.forceVP9 === 'true';
		this.props.roomClient.svc = urlParser.query.svc;
		this.props.roomClient.datachannel = urlParser.query.datachannel !== 'false';
		this.props.roomClient.info = urlParser.query.info === 'true';
		this.props.roomClient.faceDetection = urlParser.query.faceDetection === 'true';
		this.props.roomClient.externalVideo = urlParser.query.externalVideo === 'true';
		this.props.roomClient.throttleSecret = urlParser.query.throttleSecret;
		this.props.roomClient.e2eKey = urlParser.query.e2eKey;
		this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas;
		this.props.roomClient._protooUrl = getProtooUrl({ roomId,roomName, peerId, consumerReplicas,parentId });

		window.CLIENT = this.props.roomClient;
		this.props.roomClient._addRoom();
		
	}


	// joinParticipant = (e, parentId,roomId,roomName) => {
		
	// 		let roomId  = "7saqo123";
	// 		let roomName = "BreakOut";

	// 	    const url = 'https://192.168.1.35:3000/?info=true&roomId='+roomId;

	// 		http.get(url, (response) => {
	// 		let data = '';

	// 		response.on('data', (chunk) => {
	// 			data += chunk;
	// 		});

	// 		response.on('end', () => {
	// 			console.log(data);
	// 		});
	// 		}).on('error', (error) => {
	// 		console.error('Error:', error);
	// 		});

	// }



	// joinParticipantBK = (e, parentId,roomId,roomName) => {

	// const urlParser = new UrlParse(window.location.href, true);
	// console.log('urlParse',urlParser);
	// const peerId = '0';
	// //let peerId = urlParser.query.peerId;
	// let roomId = roomId;
	// let roomName = roomName;
	// let displayName =
	// 	urlParser.query.displayName || (cookiesManager.getUser() || {}).displayName;
	// const handlerName = urlParser.query.handlerName || urlParser.query.handler;
	// const useSimulcast = urlParser.query.simulcast !== 'false';
	// const useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
	// const forceTcp = urlParser.query.forceTcp === 'true';
	// const produce = urlParser.query.produce !== 'false';
	// const consume = urlParser.query.consume !== 'false';
	// const forceH264 = urlParser.query.forceH264 === 'true';
	// const forceVP9 = urlParser.query.forceVP9 === 'true';
	// const svc = urlParser.query.svc;
	// const datachannel = urlParser.query.datachannel !== 'false';
	// const info = urlParser.query.info === 'true';
	// const faceDetection = urlParser.query.faceDetection === 'true';
	// const externalVideo = urlParser.query.externalVideo === 'true';
	// const throttleSecret = urlParser.query.throttleSecret;
	// const e2eKey = urlParser.query.e2eKey;
	// const consumerReplicas = urlParser.query.consumerReplicas;

	// // Enable face detection on demand.
	// if (faceDetection)
	// 	await faceapi.loadTinyFaceDetectorModel('/resources/face-detector-models');

	// if (info)
	// {
	// 	// eslint-disable-next-line require-atomic-updates
	// 	window.SHOW_INFO = true;
	// }

	// if (throttleSecret)
	// {
	// 	// eslint-disable-next-line require-atomic-updates
	// 	window.NETWORK_THROTTLE_SECRET = throttleSecret;
	// }

	// if (!roomId)
	// {
	// 	roomId = randomString({ length: 8 }).toLowerCase();

	// 	urlParser.query.roomId = roomId;
	// 	window.history.pushState('', '', urlParser.toString());
	// }

	// // Get the effective/shareable Room URL.
	// const roomUrlParser = new UrlParse(window.location.href, true);

	// for (const key of Object.keys(roomUrlParser.query))
	// {
	// 	// Don't keep some custom params.
	// 	switch (key)
	// 	{
	// 		case 'roomId':
	// 		case 'roomName':
	// 		case 'handlerName':
	// 		case 'handler':
	// 		case 'simulcast':
	// 		case 'sharingSimulcast':
	// 		case 'produce':
	// 		case 'consume':
	// 		case 'forceH264':
	// 		case 'forceVP9':
	// 		case 'forceTcp':
	// 		case 'svc':
	// 		case 'datachannel':
	// 		case 'info':
	// 		case 'faceDetection':
	// 		case 'externalVideo':
	// 		case 'throttleSecret':
	// 		case 'e2eKey':
	// 		case 'consumerReplicas':
	// 			break;

	// 		default:
	// 			delete roomUrlParser.query[key];
	// 	}
	// }
	// delete roomUrlParser.hash;

	// const roomUrl = roomUrlParser.toString();

	// let displayNameSet;

	// // If displayName was provided via URL or Cookie, we are done.
	// if (displayName)
	// {
	// 	displayNameSet = true;
	// }
	// // Otherwise pick a random name and mark as "not set".
	// else
	// {
	// 	displayNameSet = false;
	// 	displayName = randomName();
	// }
	// console.log('roomUrl',roomUrl);

	// // Get current device info.
	// const device = deviceInfo();


	
	// store.dispatch(
	// 	stateActions.setRoomUrl(roomUrl));

	// store.dispatch(
	// 	stateActions.setRoomFaceDetection(faceDetection));

	// // store.dispatch(
	// // 	stateActions.setMe({ peerId, displayName, displayNameSet, device }));

	// roomClient = new RoomClient(
	// 	{
	// 		roomId,
	// 		roomName,
	// 		peerId,
	// 		displayName,
	// 		device,
	// 		handlerName : handlerName,
	// 		useSimulcast,
	// 		useSharingSimulcast,
	// 		forceTcp,
	// 		produce,
	// 		consume,
	// 		forceH264,
	// 		forceVP9,
	// 		svc,
	// 		datachannel,
	// 		externalVideo,
	// 		e2eKey,
	// 		consumerReplicas
	// 	});

	// // NOTE: For debugging.
	// // eslint-disable-next-line require-atomic-updates
	// window.CLIENT = roomClient;
	// // eslint-disable-next-line require-atomic-updates
	// window.CC = roomClient;
	// console.log("window.CLIENT",window.CLIENT)

	// }

	

	joinParticipant = (e, parentId,roomId,roomName,displayName) => {

		

		// let roomId   = event.currentTarget.id;
		// let roomName = event.currentTarget.getAttribute('name');
		let peerId = "0";
		this.state.parentId = parentId;
		

		if (typeof (parentId) === "undefined") 
		 parentId = "0";

		console.log('parentRoomId', parentId);
		console.log('roomId', roomId);
		console.log('roomName', roomName);

		// roomId  = "7saqo123";
		// peerId = "123456";
		// roomName = "BreakOut";


		const list = [...this.state.list]
		//console.log('current peerId', this.props.peerId);
		//console.log('current Breakout roomId', roomId);
		//this.props.roomClient.closePeer();
		//const peerId = this.props.peerId;
		//const displayName = '';
		const urlParser = new UrlParse(window.location.href, true);
		console.log('urlParser', urlParser);
		//const peerId = randomString({ length: 8 }).toLowerCase();
		// Get current device info.
		const device = deviceInfo();
		var newURL;
		const urlParams = new URL(location.href);
		const role_flag = urlParams.searchParams.get('flag');


		if(role_flag == 1)
		  newURL = location.href.split("&")[0] + "&roomId=" + roomId+ "&displayName=" + displayName+ "&flag=" + role_flag;
		else
		  newURL = location.href.split("&")[0] + "&roomId=" + roomId+ "&displayName=" + displayName;


		var currentRoomid = location.href.split("&")[1].split("=")[1];
		const consumerReplicas = urlParser.query.consumerReplicas;
		this.props.roomClient.roomId = currentRoomid;
		this.props.roomClient.peerId = peerId;
		this.props.roomClient.roomName ="";
		this.props.roomClient.device = device
		this.props.roomClient.handlerName = urlParser.query.handlerName || urlParser.query.handler;
		this.props.roomClient.useSimulcast = urlParser.query.simulcast === 'true';
		this.props.roomClient.useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
		this.props.roomClient.forceTcp = urlParser.query.forceTcp === 'true';
		this.props.roomClient.produce = urlParser.query.produce === 'true';
		this.props.roomClient.consume = urlParser.query.consume === 'true';
		this.props.roomClient.forceH264 = urlParser.query.forceH264 === 'true';
		this.props.roomClient.forceVP9 = urlParser.query.forceVP9 === 'true';
		this.props.roomClient.svc = urlParser.query.svc;
		this.props.roomClient.datachannel = urlParser.query.datachannel === 'true';
		this.props.roomClient.info = urlParser.query.info === 'true';
		this.props.roomClient.faceDetection = urlParser.query.faceDetection === 'true';
		this.props.roomClient.externalVideo = urlParser.query.externalVideo === 'true';
		this.props.roomClient.throttleSecret = urlParser.query.throttleSecret;
		this.props.roomClient.e2eKey = urlParser.query.e2eKey;
		this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas
		this.props.roomClient._protooUrl = getProtooUrl({ currentRoomid, peerId, consumerReplicas });

		list.push({ id: currentRoomid, name: "Main room" });
		this.setState({ list: list });
		this.state.mainRoomId = roomId;
		//this.props.roomClient.breakoutRooms = { id: currentRoomid, name: "Main room" };
		//console.log("addbreakRooms", this.props.roomClient);
		//this.props.roomClient.addbreakRooms({ id: currentRoomid, name: "Main room" });
		
		window.history.pushState({}, document.title, newURL);
		console.log('newlist', JSON.stringify(list));
		if (typeof (list) != "undefined") {
		//	localStorage.setItem("testObject", JSON.stringify(list));
		window.sessionStorage.setItem("testObject", JSON.stringify(list));
		}
		this.state.removeHideShow = true;
		this.state.inviteHideShow = false;
		cookiesManager.setUser(displayName);
		//return false;
		this.props.roomClient.closePeer();
		this.props.roomClient.roomId = roomId;
		this.props.roomClient.roomName =roomName;
		this.props.roomClient.peerId = peerId;
		this.props.roomClient.device = device
		this.props.roomClient.handlerName = urlParser.query.handlerName || urlParser.query.handler;
		this.props.roomClient.useSimulcast = urlParser.query.simulcast !== 'false';
		this.props.roomClient.useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
		this.props.roomClient.forceTcp = urlParser.query.forceTcp === 'true';
		this.props.roomClient.produce = urlParser.query.produce !== 'false';
		this.props.roomClient.consume = urlParser.query.consume !== 'false';
		this.props.roomClient.forceH264 = urlParser.query.forceH264 === 'true';
		this.props.roomClient.forceVP9 = urlParser.query.forceVP9 === 'true';
		this.props.roomClient.svc = urlParser.query.svc;
		this.props.roomClient.datachannel = urlParser.query.datachannel !== 'false';
		this.props.roomClient.info = urlParser.query.info === 'true';
		this.props.roomClient.faceDetection = urlParser.query.faceDetection === 'true';
		this.props.roomClient.externalVideo = urlParser.query.externalVideo === 'true';
		this.props.roomClient.throttleSecret = urlParser.query.throttleSecret;
		this.props.roomClient.e2eKey = urlParser.query.e2eKey;
		this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas;
		this.props.roomClient.breakoutRooms = parentId;
		this.props.roomClient._protooUrl = getProtooUrl({ roomId,roomName, peerId, consumerReplicas,parentId });
		console.log("joinParticipant", this.props.roomClient);
	
		 window.CLIENT = this.props.roomClient;
		
		// // eslint-disable-next-line require-atomic-updates
		// console.log("window.CLIENT",window.CLIENT);
		//window.location.reload(true)
		//this.props.roomClient.join();
		//this.props.roomClient.join();

		//window.location.href = this.props.roomClient._protooUrl;

		 setTimeout(() => {
			location.reload();
		  }, 1000);
		
		//window.location.reload(true);

	//    console.log("window.location.href :::", window.location.href);

	// 	const url = new URL(window.location.href);
  	// 		  url.searchParams.append('roomName',roomName);
	// 			url.searchParams.append('parentId',parentId);

	// 	console.log("url.toString() :::", url.toString());

	// 	// Use the modified URL to reload the window
	// 	window.location.href = url.toString();
		
	}

	showParticipants = (btnDiff,key) => {
		const currentState = this.state.active;
		if(btnDiff == 1){
			//this.setState({ showing: true })
			this.setState({ active: !currentState});
			this.setState({ showingbtn: true })
			this.setState({ showingBtnNext: false })
			this.setState({ btnDiff: 2 })
		}
		if(btnDiff == 2){
			//this.setState({ showing: false })
			this.setState({ active: !currentState});
			this.setState({ showingbtn: false })
			this.setState({ showingBtnNext: true })
			this.setState({ btnDiff: 1 })
		}
		
        
        if(this.state.activeIdList.find(element => element == key)){
            this.state.activeIdList = this.state.activeIdList.filter(item => item !== key);
        }else{
            this.state.activeIdList.push(key);
        }
	}

	add = () => {

		try {
			const currentRoomid = location.href.split("&")[1].split("=")[1];
			 const res =  fetch('https://192.168.1.35:4443/rooms/'+currentRoomid+'/addroom',{
					 mode: 'no-cors',
					 method: "get",
					 headers: {
							 "Content-Type": "application/json"
					 }
          });

		  console.log("add room response ---> ", JSON.stringify(res))
	    } catch (error) {
			 console.log("error----", error)
	    }

	}


	//  add = () => {


	// 	const list = [...this.state.list]
	// 	let roomId = randomString({ length: 8 }).toLowerCase();
	// 	var arrCount = list.length + 1;
	// 	var itemCount = this.state.itemName +'#' + arrCount
	// 	console.log("itemCount",itemCount);
	// 	list.push({ id: roomId, name: itemCount });
	// 	const currentRoomid = location.href.split("&")[1].split("=")[1];

	// 	this.setState({ list: list });
	// 	this.setState({ itemName: 'Breakoutroom' })
	// 	this.setState({ itemId: roomId })
	// 	//console.log('breakoutroomlist', list);
	// 	if (typeof (list) != "undefined") {
	// 	//	localStorage.setItem("testObject", JSON.stringify(list));
	// 	//window.sessionStorage.setItem("testObject", JSON.stringify(list));
	// 	}
	// 	//const peerId = randomString({ length: 8 }).toLowerCase();
	// 	const peerId = "0";

	// 	const roomName =  'Breakoutroom'+arrCount;
	// 	//const displayName = '';
	// 	const urlParser = new UrlParse(window.location.href, true);
	// 	//console.log('urlParser', urlParser);
	// 	//const peerId = randomString({ length: 8 }).toLowerCase();
	// 	// Get current device info.
	// 	const device = deviceInfo();
	// 	const consumerReplicas = urlParser.query.consumerReplicas;
	// 	//console.log(roomId);
	// 	this.props.roomClient.roomId = roomId
	// 	this.props.roomClient.peerId = "0"
	// 	this.props.roomClient.roomName =roomName;
	// 	this.props.roomClient.device = device
	// 	this.props.roomClient.displayName = itemCount;
	// 	this.props.roomClient.handlerName = urlParser.query.handlerName || urlParser.query.handler;
	// 	this.props.roomClient.useSimulcast = urlParser.query.simulcast !== 'false';
	// 	this.props.roomClient.useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
	// 	this.props.roomClient.forceTcp = urlParser.query.forceTcp === 'true';
	// 	this.props.roomClient.produce = urlParser.query.produce !== 'false';
	// 	this.props.roomClient.consume = urlParser.query.consume !== 'false';
	// 	this.props.roomClient.forceH264 = urlParser.query.forceH264 === 'true';
	// 	this.props.roomClient.forceVP9 = urlParser.query.forceVP9 === 'true';
	// 	this.props.roomClient.svc = urlParser.query.svc;
	// 	this.props.roomClient.datachannel = urlParser.query.datachannel !== 'false';
	// 	this.props.roomClient.info = urlParser.query.info === 'true';
	// 	this.props.roomClient.faceDetection = urlParser.query.faceDetection === 'true';
	// 	this.props.roomClient.externalVideo = urlParser.query.externalVideo === 'true';
	// 	this.props.roomClient.throttleSecret = urlParser.query.throttleSecret;
	// 	this.props.roomClient.e2eKey = urlParser.query.e2eKey;
	// 	this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas;
	// 	roomId = currentRoomid;
	// 	this.props.roomClient._protooUrl = getProtooUrl({ roomId, roomName, peerId, consumerReplicas });

	// 	// NOTE: For debugging.
	// 	// eslint-disable-next-line require-atomic-updates
	// 	window.CLIENT = this.props.roomClient;
	// 	// eslint-disable-next-line require-atomic-updates

	// 	console.log("window.CLIENT",window.CLIENT);
	// 	this.props.roomClient.join();
	// }

	componentWillUpdate(nextProps, nextState) {
		// console.log('nextState: ',nextState);
		console.log('nextState: ',nextState);
		//if(JSON.stringify(nextProps.breakoutRooms))
		if (typeof (nextProps.breakoutRooms) != "undefined") {
			
			//localStorage.setItem("testObject", JSON.stringify(nextProps.breakoutRooms));
		}

	}

	render() {


		const filteredData = this.props.peersNew?.filter(
			(name) =>
				// match all names if term is empty
				this.state.term === "" ||
				// otherwise see if the name starts with the term
				//name.value.toLowerCase().startsWith(this.state.term.toLowerCase())
				name.value.toLowerCase().indexOf(this.state.term.toLowerCase()) !== -1
		);

		console.log('Client side :::',this.props.peersNew);

		var currentRoomid = location.href.split("&")[1].split("=")[1];
		//console.log(location.href.split("&")[1].split("=")[1]);
		var filterArrdata = this.props.breaksroomNotFilter?.filter(item => item.id === currentRoomid)
		
		let RoomDet = "Meeting participants";
		console.log(filterArrdata,"filterArrdata");
		if (filterArrdata?.length > 0) {
			if (typeof (filterArrdata[0]?.name) != "undefined") {
				console.log(filterArrdata[0]?.name);
				
				if(filterArrdata[0]?.name == 'Main room'){
					RoomDet = "Meeting participants";
					this.state.inviteHideShow = true;
					this.state.list = this.props.breaksroomNotFilter;
					
				}else{

				
				RoomDet = filterArrdata[0]?.name;
				this.state.inviteHideShow = false;
				this.state.list = this.props.breaksroomNotFilter;
				}
			}
			else {
				RoomDet = "Meeting participants";
				this.state.inviteHideShow = true;
				this.state.list = this.props.breaksroomNotFilter;
			}
		}
		else {
			RoomDet = "Meeting participants";
			this.state.inviteHideShow = true;
			this.state.list = this.props.breaksroomNotFilter;
		}
		//this.state.list = this.props.breakoutRooms;
		
		// let updatedTasks  =     this.state.list?.filter(task => task.id !== currentRoomid);
		
		// console.log('Breakout room list new',this.state.list)
		//this.setState({ tasks: updatedTasks });
		const {
			roomClient,
			peerId,
			room,
			isMe,
			meNow,
			onClose,
			onRoomLinkCopy,
			DisplayName,
			countPeers,
			peersNew,
			firstletter,
			onAddRoom,
			connected,
			chatDataProducer,
			botDataProducer
		} = this.props;


		let updatedStateList = this.state.list?.filter(
			(task) =>
			task.id !== currentRoomid
			//console.log(currentRoomid,'  ',task.id)
			);
			//console.log('updatedStateList',updatedStateList)
			//console.log('updatedStateList',this.state.list)
			this.state.list = updatedStateList;
			var currentRoomid = location.href.split("&")[1].split("=")[1];
			if (typeof (this.state.list) != "undefined") {
				if (this.state.list.length > 0) {
					let updatedTasks  =     this.state.list?.filter(task => task.id == currentRoomid);
					console.log('updatedTasks',updatedTasks)
					if (updatedTasks.length == 0) {
			           //this.state.list = [ ...this.state.list, { id: this.state.mainRoomId, name: "Main room" } ]
					}
				}
			}
			//this.state.list.push({ id: this.state.mainRoomId, name: "Main room" });
			

		const renderMap = () => {

			const myMap = this.props.nestedMap;
			console.log("Nested Map ---> ",this.props.nestedMap);

			if (typeof myMap !== "undefined" && myMap !== "") {
				return (
					<div>
					{/* <div>
						{Array.from(myMap.entries()).map(([key, nestedArray]) => (
						<div key={key}>
							<h3>{key}</h3>
							<ul>
							{nestedArray.map((value, index) => (
								<li key={index}>{value.id}</li>
							))}
							</ul>
						</div>
						))}
					</div> */}
				
			{Array.from(myMap.entries()).map(([key, nestedArray]) => (
				<Fragment>
				<div name={"box" + key + "Hover"} class="list-item-container breakout-room-container css-bw62qe-container-container"

				data-testid="492c1f08-5a28-4203-bf55-a0c4cb1790a1"><div>
					<div class="css-9mpzhf-arrowContainer">
						<div class="jitsi-icon jitsi-icon-default ">
						<svg height="14" width="14" 
						onClick={(e) => {this.showParticipants(this.state.btnDiff,key);}} 
						viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path  className={(this.state.activeIdList.find(element => element == key))? "active-div" :"hide"} fill-rule="evenodd" clip-rule="evenodd" d="M20.03 16.28a.75.75 0 0 1-1.06 0L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06Z"></path>
										<path  className={(this.state.activeIdList.find(element => element == key))? "hide" :"active-div"}  fill-rule="evenodd" clip-rule="evenodd" d="M3.97 7.72a.75.75 0 0 1 1.06 0L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 0-1.06Z"></path>
						</svg></div></div> </div>
				   <div class="css-1qbw81c-detailsContainer">
					<div class="css-1dkn5fp-name">
						<span class="css-15zs0dc-roomName">{key} ({nestedArray.filter(item => item.displayName != 'HEADER').length})</span>
					</div>

					<div class="actions joinbuttons css-t4kzjs-actionsContainer">
						<button onClick={(e) => {
									this.joinParticipant(e,nestedArray[0].parentRoomId,nestedArray[0].roomId,nestedArray[0].breakoutroomName,this.props.DisplayName);
						 }}
						   aria-label="Join" class="css-1c2ihpo-button-primary-small-button"
							data-testid="join-room-e87519e8-c2dd-4a67-89a6-1b735b217443" id={nestedArray[0].roomId} name={nestedArray[0].breakoutroomName} title="Join" type="button">
							<span class="">Join</span></button>
						<button aria-label="More" class="iconButton css-10p0shd-button-primary-iconButton-small" title="More" type="button"><div class="jitsi-icon jitsi-icon-default ">
							<svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM4.5 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z">

							</path></svg></div></button></div>
				      </div>
				   </div>
				
			   {nestedArray.map((value, index) => (
				<If condition={(value.displayName != 'HEADER')}>
				<div className={(this.state.activeIdList.find(element => element == key))? "active-div" :"hide"}  class="list-item-container css-1nxmpxc-container" 
				id="participant-item-aacb482d-1a35-482e-93a9-2cf5a35b5fce@meet.jit.si/FYpi0ONSgGFh">
				<div class="css-1qbw81c-detailsContainer">
				<div class="css-1dkn5fp-name"><div class="css-14p5y54-nameContainer">
				<div style={{color: 'white'}} class="css-1lacpev-name">
				<span class="css-15zs0dc-roomName">{value.displayName}</span>
				</div></div></div>
				<div class="indicators css-lribt2-indicators">
				</div>
				</div></div>
				</If>
                ))}

				
					</Fragment>
			 ))}

				</div>




				);
		     }
		}


		const { text } = this.state;

		const disabled = !connected || (!chatDataProducer && !botDataProducer);

		return (
			<div data-component='Breakout' >
				<div style={{display:"none"}} id="BreakoutDiv" className={classnames('content', { visible: peerId })}>

					<div className='header'>
						<div className='info'>
							<div
								className='close-icon'
								onClick={this.onCloseBreak.bind(this)}
							/></div>
						<div style={{ color: '#FFF' }} className='stats'>

							<div className='meetingVal'>{RoomDet} ({countPeers})</div>
							<br></br>
							<If condition={this.state.inviteHideShow}>

							<button aria-label="Invite Someone"
								onClick={(event) => {
									// If this is a 'Open in new window/tab' don't prevent
									// click default action.
									if (
										event.ctrlKey || event.shiftKey || event.metaKey ||
										// Middle click (IE > 9 and everyone else).
										(event.button && event.button === 1)
									) {
										return;
									}

									event.preventDefault();

									clipboardCopy(this.props.fullRoomid)
										.then(onRoomLinkCopy);
								}}
								class="css-1bts3k5-button-primary-medium-fullWidth" title="Invite Someone" type="button"><div class="jitsi-icon jitsi-icon-default ">
									<svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path d="M17.25 9.75a.75.75 0 0 0 1.5 0v-3h3a.75.75 0 0 0 0-1.5h-3v-3a.75.75 0 0 0-1.5 0v3h-3a.75.75 0 0 0 0 1.5h3v3Z">

										</path>
										<path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 9.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm-1.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM13.5 18.75c0 2.071-2.686 3.75-6 3.75s-6-1.679-6-3.75c0-2.071 2.686-3.75 6-3.75s6 1.679 6 3.75Zm-1.5 0c0 .332-.22.859-1.052 1.38-.812.507-2.027.87-3.448.87-1.42 0-2.636-.363-3.448-.87C3.22 19.609 3 19.082 3 18.75c0-.332.22-.859 1.052-1.38.812-.507 2.027-.87 3.448-.87 1.42 0 2.636.363 3.448.87.833.521 1.052 1.048 1.052 1.38Z"></path></svg>
								</div><span class="css-1wulk6c-textWithIcon">Invite Someone</span>
								</button>
								</If>

						</div>

						<br></br>
						<div class="css-ukg2h7-inputContainer-search">
							<div class="css-1m7m6m3-fieldContainer">
								<input class="css-7s8ua3-input-clearableInput"
									placeholder="Search participants"
									type="text"
									value={this.state.term} // make this a controlled input, prevents space from showing
									onChange={(event) => {
										if (event.target.value.endsWith(' ')) {
											alert('Please don\'t enter space.');
										} else {
											this.setState({ term: event.target.value });
										}
									}}
								/>

							</div>
						</div>
						<br></br>
						<br></br>

						<div  style={{color: 'burlywood'}} className='meetingVal'> {this.props.currentRoomName} :</div>
						<br></br>

						{filteredData?.map((item, index) => {
							return <div>
								<div class="list-item-container css-i7if01-container" id="participant-item-00353cc3">
									<div><div class="avatar participant-avatar jss40">
										<text dominant-baseline="central" fill="rgba(255,255,255,1)" font-size="40pt" text-anchor="middle" x="50" y="50">{item.value.substring(0, 1)}
										</text></div></div>
									<div class="css-1qbw81c-detailsContainer">
										<div class="css-1dkn5fp-name">
											<div class="css-14p5y54-nameContainer">
												<div class="css-1lacpev-name">{item.value}</div>
											</div></div>
									</div>
								</div>
							</div>
						})}

						{this.props.curRoomPeers?.map((item, index) => {
							return <div>
								<div class="list-item-container css-i7if01-container" id="participant-item-00353cc3">
									<div><div class="avatar participant-avatar jss40">
										<text dominant-baseline="central" fill="rgba(255,255,255,1)" font-size="40pt" text-anchor="middle" x="50" y="50">{item.displayName.substring(0, 1)}
										</text></div></div>
									<div class="css-1qbw81c-detailsContainer">
										<div class="css-1dkn5fp-name">
											<div class="css-14p5y54-nameContainer">
												<div class="css-1lacpev-name">{item.displayName}</div>
											</div></div>
											<div className='indicators'>
												<If condition={!(Boolean(item.audioConsumer) && !item.audioConsumer.locallyPaused && !item.audioConsumer.remotelyPaused)}>
													<div className='icon mic-off' />
												</If>

												<If condition={!item.videoConsumer}>
													<div className='icon webcam-off' />
												</If>
											</div>
									</div>
								</div>
							</div>
						})}


						<br></br>
						{/* <If condition={this.state.removeHideShow}>

							<button 
							onClick={(e) => {
								this.joinParentRoom(e);
					         }}
							aria-label="Leave breakout room" class="css-10s0o5q-button-destructive-medium-fullWidth" title="Leave breakout room" type="button">
								<span class="">Leave breakout room</span>
							</button>
						</If> */}

						<br></br>
						<div id="breakout-rooms-list">
						{renderMap()}

						</div>

						<br></br>
						{/* <If condition={this.props.breakoutbtn}> */}
						{/* <button
							// onClick={(e) => {
							// 	this.joinParentRoom(e)
							// }}

							onClick={({ displayName }) => onAddRoom(currentRoomid)}

							aria-label="Add breakout room" class="css-1t1ycip-button-secondary-medium-fullWidth" title="Add breakout room" type="button">
							<span class="">Add breakout room</span></button> */}


							<div class="rmcontainer">
								<input id="brId" type="text" style={{color: 'white'}} placeholder="Enter breakout room name" class="rmtext-box"></input>
								<button
								// onClick={({ displayName }) => onAddRoom(currentRoomid)}

								onClick={(e) => {
								this.joinParentRoom(e)
								}}

								class="rmbtn">Add</button>
							</div>
 
					</div>
				</div>

				{/* --------------- chat Div  */}

				<div style={{display:"none"}} id="chatDiv"  data-component='ChatInput' className={classnames('content', { visible: peerId })}>
					<div className='header'>
					
						<section
						 style={{ width:'35%',height:'93%',position:'fixed',zIndex:'1000',right:'10px',bottom:'0px'}}
						 className="msger">
						<header className="msger-header">
							<div style={{fontWeight: 'bold'}} className="msger-header-title">
							<i className="fas fa-comment-alt"></i>Chat
							</div>
							<div className='info-added'>
							<div className='close-icon-added' onClick={this.onCloseChatDiv.bind(this)}/></div>
							<div className="msger-header-options">
							<span><i className="fas fa-cog"></i></span>
							</div>
						</header>

						<main id="msgCnt" className="msger-chat">
							
							{/* <div className="msg left-msg">
								<div
								className="msg-img"
								style={{ backgroundImage: `url(https://image.flaticon.com/icons/svg/327/327779.svg)`}}>
								</div>

								<div className="msg-bubble">
									<div className="msg-info">
									<div className="msg-info-name">BOT</div>
									<div className="msg-info-time">12:45</div>
									</div>

									<div className="msg-text">
									Hi, welcome to SimpleChat! Go ahead and send me a message.
									</div>
								</div>
							</div> */}


							{/* <div className="msg right-msg">
								<div
								className="msg-img"
								style={{ backgroundImage: `url(https://image.flaticon.com/icons/svg/145/145867.svg)`}}>	
								</div>

								<div className="msg-bubble">
									<div className="msg-info">
									<div className="msg-info-name">Sajad</div>
									<div className="msg-info-time">12:46</div>
									</div>

									<div className="msg-text">
									You can change your name in JS section!
									</div>
								</div>
							</div> */}

						</main>

						<form className="msger-inputarea">
							{/* <input type="text" className="msger-input" placeholder="Enter your message..."/> */}
							<textarea class="msger-input" 
								ref={(elem) => { this._textareaElem = elem; }}
								placeholder={disabled ? 'Chat unavailable' : 'Write here...'}
								dir='auto'
								autoComplete='off'
								disabled={disabled}
								value={text}
								onChange={this.handleChange.bind(this)}
								onKeyPress={this.handleKeyPress.bind(this)}
							/>
							{/* <button type="submit" className="msger-send-btn">Send</button> */}
						</form>
						</section>
					
 
					</div>
				</div>

			</div>




		);
	}

	handleChange(event)
	{
		const text = event.target.value;
		this.setState({ text });
	}
	onCloseBreak(){
		const { roomClient } = this.props;
		roomClient.closeBreakoutDiv();
	}
	onCloseChatDiv(){
		const { roomClient } = this.props;
		roomClient.closeChatDiv();
	}
	handleKeyPress(event)
	{
		// If Shift + Enter do nothing.
		if (event.key !== 'Enter' || (event.shiftKey || event.ctrlKey))
			return;

		// Don't add the sending Enter into the value.
		event.preventDefault();

		let text = this.state.text.trim();
		this.setState({ text: '' });

		if (text)
		{
			const { roomClient } = this.props;
			const match = BotMessageRegex.exec(text);

			// Chat message.
			if (!match)
			{
				text = text.trim();
				roomClient.sendChatMessage(text);
			}
			// Message to the bot.
			else
			{
				text = match[1].trim();
				roomClient.sendBotMessage(text);
			}
		}
	}
	
	componentDidUpdate(prevProps) {
		const { peerId, room } = this.props;
	}

}

Breakout.propTypes =
{
	roomClient: PropTypes.any.isRequired,
	room: appPropTypes.Room.isRequired,
	peerId: PropTypes.string,
	isMe: PropTypes.bool,
	meNow: appPropTypes.Me.isRequired,
	onClose: PropTypes.func.isRequired,
	onRoomLinkCopy: PropTypes.func.isRequired,
	DisplayName: PropTypes.string,
	countPeers: PropTypes.number,
	peersNew: PropTypes.any.isRequired,
	firstletter: PropTypes.any.isRequired,
	breakoutRooms: PropTypes.any.isRequired,
	onAddRoom: PropTypes.func,
	roomClient       : PropTypes.any.isRequired,
	connected        : PropTypes.bool.isRequired,
	chatDataProducer : PropTypes.any,
	botDataProducer  : PropTypes.any
};

const mapStateToProps = (state) => {

	console.log('mapStateToProps method : ', state);

	const breakoutroomArray = Object.values(state.breakoutroom);
	const { room, me, peers, consumers, dataConsumers } = state;
	const { statsPeerId } = room;
	
	if (!statsPeerId)
		return {};

	const isMe = statsPeerId === me.id;
	const peer = isMe ? me : peers[statsPeerId];
	const participant = Object.keys(peers).length;
	let peerCnt = participant + 1;
	let peersArrCnt =	0;
	const peersId = Object.keys(peers)[0];
	let peersArray = Object.values(peers);
	
	let floors = [];
	let breaksroom = [];
	let breaksroomNotFilter = [];
	let breakoutbtn = false;
	let nestedMap = new Map();
	let curRoomPeers = new Map();
	let curPeerArry;
	let currentRoomid = location.href.split("&")[1].split("=")[1];
	const matchingValue = peersArray.find(peers => peers.roomId === currentRoomid);

	//console.log('Current Room Name ::',matchingValue.breakoutroomName);

	let currentRoomName = (typeof (matchingValue) != "undefined") ? matchingValue.breakoutroomName : "Main Room";

	floors.push({ id: me.id, value: state.me.displayName + ' (you)', roonName: currentRoomName,roomId: state.me.roomId });

    //peersArray = peersArray.filter(item => item.id !== me.id);

	
	//for (const peersId of Object.keys(peers)) {

		
		

		console.log('peersArray ===> ',peersArray);

		for (const peer of peersArray) {
			if(peer.roomId == currentRoomid){
				peersArrCnt++;
			}
		}
		

		

	    if (participant >= 1) {
		
		     for (const peer of peersArray) {
			
				if(peer.breakoutroomName == currentRoomName)
				{
					if(curRoomPeers.has(peer.breakoutroomName))
					{
						let tmpArry = curRoomPeers.get(peer.breakoutroomName);
						tmpArry.push(peer);
						curRoomPeers.set(peer.breakoutroomName,tmpArry);
					}
					else
					{
						let tmpArry = [];
						tmpArry.push(peer);
						curRoomPeers.set(peer.breakoutroomName,tmpArry);
					}
			    }	
				else
				{
					if(nestedMap.has(peer.breakoutroomName))
					{
						if(peer.displayName != 'Broadcaster'){
							let tmpArry = nestedMap.get(peer.breakoutroomName);
							tmpArry.push(peer);
							nestedMap.set(peer.breakoutroomName,tmpArry);
						}
					}
					else
					{
						if(peer.displayName != 'Broadcaster'){
							let tmpArry = [];
							tmpArry.push(peer);
							nestedMap.set(peer.breakoutroomName,tmpArry);
					    }
					}			
				}				
		    }

		console.log('Other room peers   :: ',nestedMap);
		console.log('Current room peers   :: ',curRoomPeers);

	  if(typeof (matchingValue) != "undefined"){
	   curPeerArry = curRoomPeers.get(currentRoomName);
	   curPeerArry =curPeerArry.filter((peersId)=> peersId.displayName != 'HEADER' && peersId.displayName != 'Broadcaster' && state.me.id != peersId.id );
	  }

	  console.log('Current room peers   :: ',curPeerArry);
	  var NewcurPeerArry = curPeerArry.map(function(el) {
		var o = Object.assign({}, el);
		const peerArr = state.peers[o.id];
		const consumersArray = peerArr.consumers
			.map((consumerId) => state.consumers[consumerId]);
		const audioConsumer =
			consumersArray.find((consumer) => consumer.track.kind === 'audio');
		const videoConsumer =
			consumersArray.find((consumer) => consumer.track.kind === 'video');
			//console.log("audioConsumer",audioConsumer);
		o.audioConsumer = audioConsumer;
		o.videoConsumer = videoConsumer;
		return o;
	  })

	   let filteredData=[];
	   let finalData=[];
	   if (peersArray.length != 0){
		 filteredData = peersArray.filter((peersId)=> peersId.displayName != 'HEADER' );
		 finalData = filteredData.filter((peersId)=> state.me.id != peersId.id );
	   }

	   let filteredPeers = peersArray.filter((peersId)=> peersId.displayName != 'HEADER' && peersId.displayName != 'Broadcaster');
	   peersArrCnt = filteredPeers.length;

	   console.log('Total peer count   :: ',peersArrCnt);

		
		// for (const peersDatas of finalData) {
		// 	floors.push({ id: peersDatas.id, value: peersDatas.displayName, roonName: peersDatas.breakoutroomName,roomId: peersDatas.roomId });
		// }
		const breakoutRoomsData =peersArray.filter((peersId)=> peersId.id == 0 )
		for (const peersDatas of breakoutRoomsData) {
			breaksroom.push({ id: peersDatas.id, name: peersDatas.breakoutroomName });
		}
		//floors.push({ id: peersId, value: peers[peersId].displayName, roonName: 'Main Room' });
		const urlParser = new UrlParse(window.location.href, true);
		//console.log('urlParser roomId', urlParser.query.roomId);
		let currentRoomIds =  urlParser.query.roomId;
		if (Object.keys(state.peers[peersId].breakoutroom || {}).length > 0) {
			//console.log('roomId', state.peers[peersId].breakoutroom);
			for (const roomId of Object.keys(state.peers[peersId].breakoutroom)) {
				//console.log('roomId', state.peers[peersId].breakoutroom[roomId].id);
				if(currentRoomIds != state.peers[peersId].breakoutroom[roomId].id){
					//breaksroom.push({ id: state.peers[peersId].breakoutroom[roomId].id, name: state.peers[peersId].breakoutroom[roomId].name });
				}
				breaksroomNotFilter.push({ id: state.peers[peersId].breakoutroom[roomId].id, name: state.peers[peersId].breakoutroom[roomId].name });
				
	
			}
		}

	}
	if (peerCnt > 1) {
		breakoutbtn = true;
	}
	else
	{
		breakoutbtn = false;
	}
	//function removeDuplicate(arr, prop) {
		var new_arr = [];
		var lookup = {};
		for (var i in breaksroom) {
			lookup[breaksroom[i]['name']] = breaksroom[i];
		}
		for (i in lookup) {
			new_arr.push(lookup[i]);
		}
		var	newArray =  new_arr;
		var new_arr1 = [];
		var lookup1 = {};
		if(breaksroomNotFilter.length > 0){
			
			for (var i in breaksroomNotFilter) {
				lookup1[breaksroomNotFilter[i]['name']] = breaksroomNotFilter[i];
			}
			for (i in lookup1) {
				new_arr1.push(lookup1[i]);
			}
			
		}
		var	newArray1 =  new_arr1;
	//}
	//var newArray = removeDuplicate(breaksroom, 'id');
	console.log('floors   :: ',floors);
	const firstletter = state.me.displayName.substring(0, 1);
	console.log('all data', state);
	let floorsData = floors.filter((peersId)=> peersId.roomId == state.me.roomId )
	console.log('floors data', floorsData);

	// props for chat 
	const dataProducersArray = Object.values(state.dataProducers);
	const chatDataProducer = dataProducersArray
		.find((dataProducer) => dataProducer.label === 'chat');
	const botDataProducer = dataProducersArray
		.find((dataProducer) => dataProducer.label === 'bot');

        // Fetch urlWithFirstTwoParams
		const url = new URL(location.href);
		const params = url.searchParams;
		const keys = Array.from(params.keys()).slice(0, 2);
		const urlWithParams = keys.map(key => `${key}=${params.get(key)}`).join('&');
		const urlWithFirstTwoParams = `${url.origin}${url.pathname}?${urlWithParams}`;


	return {
		peerId: peer.id,
		room: state.room,
		isMe: state.me,
		meNow: state.me,
		DisplayName: state.me.displayName,
		countPeers: peersArrCnt,
		peersNew: floorsData,
		firstletter: firstletter,
		breakoutRooms: newArray,
		breakoutbtn : breakoutbtn,
		breaksroomNotFilter:newArray1,
		nestedMap : nestedMap,
		currentRoomName : currentRoomName,
		curRoomPeers : NewcurPeerArry,
		fullRoomid:urlWithFirstTwoParams,
		connected : state.room.state === 'connected',
		chatDataProducer,
		botDataProducer
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		//onClose: () => dispatch(stateActions.setBreakoutPeerId(null)),
		onClose : () => {
			RoomClient.closeBreakoutDiv()
		},
		onRoomLinkCopy: () => {
			dispatch(requestActions.notify(
				{
					text: 'Room link copied to the clipboard'
				}));
		}
	};
};

const BreakoutContainer = withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
)(Breakout));

export default BreakoutContainer;
