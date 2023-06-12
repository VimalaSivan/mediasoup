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
import thunk from 'redux-thunk';
import reducers from '../redux/reducers';
const reduxMiddlewares = [thunk];
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
			btnDiff: 1
		};
		this.node = React.createRef()
	}

	

	joinParentRoom = (e) => {

		let roomId   = this.state.parentId;
		let roomName = "";
		let peerId = "0";
		let parentId = this.state.parentId;

		console.log('parentRoomId', parentId);
		console.log('roomId', roomId);
		console.log('roomName', roomName);

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

		var newURL = location.href.split("&")[0] + "&roomId=" + roomId;


		var currentRoomid = location.href.split("&")[1].split("=")[1];
		const consumerReplicas = urlParser.query.consumerReplicas;
		this.props.roomClient.roomId = currentRoomid;
		this.props.roomClient.peerId = peerId;
		this.props.roomClient.roomName ="";
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
		this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas
		this.props.roomClient._protooUrl = getProtooUrl({ currentRoomid, peerId, consumerReplicas });

		list.push({ id: currentRoomid, name: "Main room" });
		this.setState({ list: list });
		this.state.mainRoomId = roomId;
		this.state.roomName = roomName;
		//this.props.roomClient.breakoutRooms = { id: currentRoomid, name: "Main room" };
		//console.log("addbreakRooms", this.props.roomClient);
		//this.props.roomClient.addbreakRooms({ id: currentRoomid, name: "Main room" });
		
		window.history.pushState({}, document.title, newURL);
		console.log('newlist', JSON.stringify(list));
		if (typeof (list) != "undefined") {
		//	localStorage.setItem("testObject", JSON.stringify(list));
		window.sessionStorage.setItem("testObject", JSON.stringify(list));
		}
		this.state.removeHideShow = false;
		this.state.inviteHideShow = false;
		
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
		this.props.roomClient._protooUrl = getProtooUrl({ roomId,roomName, peerId, consumerReplicas });
		console.log("joinParticipant", this.props.roomClient);
		
		// window.CLIENT = this.props.roomClient;
		// // eslint-disable-next-line require-atomic-updates
		// console.log("window.CLIENT",window.CLIENT);
		//window.location.reload(true)
		this.props.roomClient.join();
	}

	joinParticipant = (e, parentId,roomId,roomName) => {

		// let roomId   = event.currentTarget.id;
		// let roomName = event.currentTarget.getAttribute('name');
		let peerId = "0";
		this.state.parentId = parentId;
		console.log('parentRoomId', parentId);
		console.log('roomId', roomId);
		console.log('roomName', roomName);

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

		var newURL = location.href.split("&")[0] + "&roomId=" + roomId;


		var currentRoomid = location.href.split("&")[1].split("=")[1];
		const consumerReplicas = urlParser.query.consumerReplicas;
		this.props.roomClient.roomId = currentRoomid;
		this.props.roomClient.peerId = peerId;
		this.props.roomClient.roomName ="";
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
		this.props.roomClient._protooUrl = getProtooUrl({ roomId,roomName, peerId, consumerReplicas,parentId });
		console.log("joinParticipant", this.props.roomClient);

		// window.CLIENT = this.props.roomClient;
		// // eslint-disable-next-line require-atomic-updates
		// console.log("window.CLIENT",window.CLIENT);
		//window.location.reload(true)
		this.props.roomClient.join();
		
	}

	showParticipants = (btnDiff) => {
		if(btnDiff == 1){
			this.setState({ showing: true })
			this.setState({ showingbtn: true })
			this.setState({ showingBtnNext: false })
			this.setState({ btnDiff: 2 })
		}
		if(btnDiff == 2){
			this.setState({ showing: false })
			this.setState({ showingbtn: false })
			this.setState({ showingBtnNext: true })
			this.setState({ btnDiff: 1 })
		}

	}

	// joinParticipant = (event) => {

	// 	let assId   = event.currentTarget.id;
	// 	let breakOutRoomName = event.currentTarget.getAttribute('name');
    //     let peerId = "0";

	// 	// const list = [...this.state.list]
	// 	// const peerId = 0;
	// 	// const urlParser = new UrlParse(window.location.href, true);
	// 	// console.log('urlParser', urlParser);
	// 	// const device = deviceInfo();

		

	// 	// var newURL = location.href.split("&")[0] + "&roomId=" + "0";

	// 	// var currentRoomid = location.href.split("&")[1].split("=")[1];
	// 	// const consumerReplicas = urlParser.query.consumerReplicas;
	// 	// this.props.roomClient.roomId = currentRoomid;
	// 	// this.props.roomClient.peerId = peerId;
	// 	// this.props.roomClient.roomName ="";
	// 	// this.props.roomClient.device = device
	// 	// this.props.roomClient.handlerName = urlParser.query.handlerName || urlParser.query.handler;
	// 	// this.props.roomClient.useSimulcast = urlParser.query.simulcast !== 'false';
	// 	// this.props.roomClient.useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
	// 	// this.props.roomClient.forceTcp = urlParser.query.forceTcp === 'true';
	// 	// this.props.roomClient.produce = urlParser.query.produce !== 'false';
	// 	// this.props.roomClient.consume = urlParser.query.consume !== 'false';
	// 	// this.props.roomClient.forceH264 = urlParser.query.forceH264 === 'true';
	// 	// this.props.roomClient.forceVP9 = urlParser.query.forceVP9 === 'true';
	// 	// this.props.roomClient.svc = urlParser.query.svc;
	// 	// this.props.roomClient.datachannel = urlParser.query.datachannel !== 'false';
	// 	// this.props.roomClient.info = urlParser.query.info === 'true';
	// 	// this.props.roomClient.faceDetection = urlParser.query.faceDetection === 'true';
	// 	// this.props.roomClient.externalVideo = urlParser.query.externalVideo === 'true';
	// 	// this.props.roomClient.throttleSecret = urlParser.query.throttleSecret;
	// 	// this.props.roomClient.e2eKey = urlParser.query.e2eKey;
	// 	// this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas
	// 	// this.props.roomClient._protooUrl = getProtooUrl({ currentRoomid, peerId, consumerReplicas });

	// 	// list.push({ id: currentRoomid, name: "Main room" });
	// 	// this.setState({ list: list });
	// 	// this.state.mainRoomId = currentRoomid;
	// 	// this.props.roomClient.breakoutRooms = { id: currentRoomid, name: "Main room" };
	// 	// console.log("addbreakRooms", this.props.roomClient);
	// 	// this.props.roomClient.addbreakRooms({ id: currentRoomid, name: "Main room" });
		
	// 	// window.history.pushState({}, document.title, newURL);
	// 	// console.log('newlist', JSON.stringify(list));
	// 	// if (typeof (list) != "undefined") {
	// 	// //	localStorage.setItem("testObject", JSON.stringify(list));
	// 	// window.sessionStorage.setItem("testObject", JSON.stringify(list));
	// 	// }
	// 	// this.state.removeHideShow = true;
	// 	// this.state.inviteHideShow = false;
		
	// 	// //return false;
	// 	// this.props.roomClient.closePeer();
	// 	// this.props.roomClient.roomId = assId;
	// 	// this.props.roomClient.roomName =breakOutRoomName;
	// 	// this.props.roomClient.peerId = "0";
	// 	// this.props.roomClient.device = device
	// 	// this.props.roomClient.handlerName = urlParser.query.handlerName || urlParser.query.handler;
	// 	// this.props.roomClient.useSimulcast = urlParser.query.simulcast !== 'false';
	// 	// this.props.roomClient.useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
	// 	// this.props.roomClient.forceTcp = urlParser.query.forceTcp === 'true';
	// 	// this.props.roomClient.produce = urlParser.query.produce !== 'false';
	// 	// this.props.roomClient.consume = urlParser.query.consume !== 'false';
	// 	// this.props.roomClient.forceH264 = urlParser.query.forceH264 === 'true';
	// 	// this.props.roomClient.forceVP9 = urlParser.query.forceVP9 === 'true';
	// 	// this.props.roomClient.svc = urlParser.query.svc;
	// 	// this.props.roomClient.datachannel = urlParser.query.datachannel !== 'false';
	// 	// this.props.roomClient.info = urlParser.query.info === 'true';
	// 	// this.props.roomClient.faceDetection = urlParser.query.faceDetection === 'true';
	// 	// this.props.roomClient.externalVideo = urlParser.query.externalVideo === 'true';
	// 	// this.props.roomClient.throttleSecret = urlParser.query.throttleSecret;
	// 	// this.props.roomClient.e2eKey = urlParser.query.e2eKey;
	// 	// this.props.roomClient.consumerReplicas = urlParser.query.consumerReplicas;
	// 	// this.props.roomClient._protooUrl = getProtooUrl({ roomId, peerId, consumerReplicas });
	// 	// console.log("joinParticipant", this.props.roomClient);


	// 	//this.props.roomClient.closePeer();		
	// 	const urlParser = new UrlParse(window.location.href, true);
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

	// 	const device = deviceInfo();
	// 	const consumerReplicas = urlParser.query.consumerReplicas;
	// 	this.props.roomClient.consumerReplicas = consumerReplicas;
	// 	this.props.roomClient.roomId = assId;
	// 	this.props.roomClient.roomName =breakOutRoomName;
	// 	this.props.roomClient.peerId = "0";
	// 	this.props.roomClient.device = device

	// 	this.props.roomClient._protooUrl = getProtooUrl({ assId, breakOutRoomName, peerId, consumerReplicas });


	// 	this.props.roomClient.join();

	// }


	 add = () => {


		const list = [...this.state.list]
		let roomId = randomString({ length: 8 }).toLowerCase();
		var arrCount = list.length + 1;
		var itemCount = this.state.itemName +'#' + arrCount
		console.log("itemCount",itemCount);
		list.push({ id: roomId, name: itemCount });
		const currentRoomid = location.href.split("&")[1].split("=")[1];

		this.setState({ list: list });
		this.setState({ itemName: 'Breakoutroom' })
		this.setState({ itemId: roomId })
		//console.log('breakoutroomlist', list);
		if (typeof (list) != "undefined") {
		//	localStorage.setItem("testObject", JSON.stringify(list));
		//window.sessionStorage.setItem("testObject", JSON.stringify(list));
		}
		//const peerId = randomString({ length: 8 }).toLowerCase();
		const peerId = "0";

		const roomName =  'Breakoutroom'+arrCount;
		//const displayName = '';
		const urlParser = new UrlParse(window.location.href, true);
		//console.log('urlParser', urlParser);
		//const peerId = randomString({ length: 8 }).toLowerCase();
		// Get current device info.
		const device = deviceInfo();
		const consumerReplicas = urlParser.query.consumerReplicas;
		//console.log(roomId);
		this.props.roomClient.roomId = roomId
		this.props.roomClient.peerId = "0"
		this.props.roomClient.roomName =roomName;
		this.props.roomClient.device = device
		this.props.roomClient.displayName = itemCount;
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
		roomId = currentRoomid;
		this.props.roomClient._protooUrl = getProtooUrl({ roomId, roomName, peerId, consumerReplicas });
		//this.props.roomClient.breakoutRooms = { id: roomId, name: itemCount };
	
		// this.props.roomClient.assId = currentRoomid;
		// console.log("currentRoomid :: ",currentRoomid);
		// console.log("this.props.roomClient ::: ",this.props.roomClient);
		//this.props.roomClient.addbreakRooms();

		//console.log("added",this.props.roomClient);

		// NOTE: For debugging.
		// eslint-disable-next-line require-atomic-updates
		window.CLIENT = this.props.roomClient;
		// eslint-disable-next-line require-atomic-updates

		console.log("window.CLIENT",window.CLIENT);

	//this.props.roomClient.addbreakRooms({ id: roomId, name: itemCount });
		 //window.location.reload(true)
		 this.props.roomClient.join();
		//const { roomClient }	= this.props;

		//this.props.roomClient.join();
	}

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
			onAddRoom
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
			
		const renderData = () => {

			return this.props.breakoutRooms?.map((item, index) => {
				return (
					<div name={"box" + index + "Hover"} class="list-item-container breakout-room-container css-bw62qe-container-container"

						data-testid="492c1f08-5a28-4203-bf55-a0c4cb1790a1"><div>
							<div class="css-9mpzhf-arrowContainer">
								<div class="jitsi-icon jitsi-icon-default ">
									<svg height="14" width="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd" d="M20.03 16.28a.75.75 0 0 1-1.06 0L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06Z"></path></svg></div></div> </div>
						<div class="css-1qbw81c-detailsContainer">
							<div class="css-1dkn5fp-name">
								<span class="css-15zs0dc-roomName">{item.name} (0)</span>
							</div>

							<div class="actions joinbuttons css-t4kzjs-actionsContainer">
								<button onClick={(e) => {
									this.joinParticipant(e, item.id,item.name);
								}} aria-label="Join" class="css-1c2ihpo-button-primary-small-button"
									data-testid="join-room-e87519e8-c2dd-4a67-89a6-1b735b217443" title="Join" type="button">
									<span class="">Join</span></button>
								<button aria-label="More" class="iconButton css-10p0shd-button-primary-iconButton-small" title="More" type="button"><div class="jitsi-icon jitsi-icon-default ">
									<svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM4.5 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z">

									</path></svg></div></button></div>
						</div>
						{/* <div class="ignore-child css-a6wji9-contextMenu-contextMenuHidden" role="menu" 
				style="top: 220px;">
				<div class="css-es5z1v-contextMenuItemGroup">
				<div aria-label="Remove" class="css-uf170q-contextMenuItem" 
				id="remove-room-undefined" role="menuitem">
				<div class="jitsi-icon jitsi-icon-default css-1i0btwg-contextMenuItemIcon">
				<svg height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path d="M18.53 6.53a.75.75 0 0 0-1.06-1.06L12 10.94 6.53 5.47a.75.75 0 0 0-1.06 1.06L10.94 12l-5.47 5.47a.75.75 0 1 0 1.06 1.06L12 13.06l5.47 5.47a.75.75 0 1 0 1.06-1.06L13.06 12l5.47-5.47Z"></path>
				</svg></div>
				<span class="css-1oh4e10-text">Remove</span>
				</div></div></div> */}
					</div>
				)
			})
		}

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
						onClick={(e) => {this.showParticipants(this.state.btnDiff);}} 
						viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path  style={{ display: (this.state.showingbtn ? 'block' : 'none') }}  fill-rule="evenodd" clip-rule="evenodd" d="M20.03 16.28a.75.75 0 0 1-1.06 0L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06Z"></path>
										<path  style={{ display: (this.state.showingBtnNext ? 'block' : 'none') }}  fill-rule="evenodd" clip-rule="evenodd" d="M3.97 7.72a.75.75 0 0 1 1.06 0L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 0-1.06Z"></path>
						</svg></div></div> </div>
				   <div class="css-1qbw81c-detailsContainer">
					<div class="css-1dkn5fp-name">
						<span class="css-15zs0dc-roomName">{key} ({nestedArray.filter(item => item.displayName != 'HEADER').length})</span>
					</div>

					<div class="actions joinbuttons css-t4kzjs-actionsContainer">
						<button onClick={(e) => {
									this.joinParticipant(e,nestedArray[0].parentRoomId,nestedArray[0].roomId,nestedArray[0].breakoutroomName);
						 }}
						   aria-label="Join" class="css-1c2ihpo-button-primary-small-button"
							data-testid="join-room-e87519e8-c2dd-4a67-89a6-1b735b217443" id={nestedArray[0].roomId} name={nestedArray[0].breakoutroomName} title="Join" type="button">
							<span class="">Join</span></button>
						<button aria-label="More" class="iconButton css-10p0shd-button-primary-iconButton-small" title="More" type="button"><div class="jitsi-icon jitsi-icon-default ">
							<svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM4.5 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z">

							</path></svg></div></button></div>
				      </div>
				   </div>

			   {/* {nestedArray.map((value, index) => (

				<div style={{ display: (this.state.showing ? '' : 'none') }} class="list-item-container css-1nxmpxc-container" 
				id="participant-item-aacb482d-1a35-482e-93a9-2cf5a35b5fce@meet.jit.si/FYpi0ONSgGFh">
				<div class="css-1qbw81c-detailsContainer">
				<div class="css-1dkn5fp-name"><div class="css-14p5y54-nameContainer">
				<div style={{color: 'white'}} class="css-1lacpev-name"><b> {value.displayName}  </b></div></div></div>
				<div class="indicators css-lribt2-indicators">
				</div>
				</div></div>
                ))} */}

				
					</Fragment>
			 ))}

				</div>




				);
		     }
		}


		return (
			<div data-component='Breakout' >
				<div className={classnames('content', { visible: peerId })}>

					<div className='header'>
						<div className='info'>
							<div
								className='close-icon'
								onClick={onClose}
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

									clipboardCopy(room.url)
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
						<br></br>
						<If condition={this.state.removeHideShow}>

							<button 
							onClick={(e) => {
								this.joinParentRoom(e);
					         }}
							aria-label="Leave breakout room" class="css-10s0o5q-button-destructive-medium-fullWidth" title="Leave breakout room" type="button">
								<span class="">Leave breakout room</span>
							</button>
						</If>

						<br></br>
						<div id="breakout-rooms-list">
						{renderMap()}

						</div>

						<br></br>
						{/* <If condition={this.props.breakoutbtn}> */}
						<button
							// onClick={(e) => {
							// 	this.add();
							// }}

							onClick={({ displayName }) => onAddRoom(currentRoomid)}

							aria-label="Add breakout room" class="css-1t1ycip-button-secondary-medium-fullWidth" title="Add breakout room" type="button">
							<span class="">Add breakout room</span></button>
 
					</div>
				</div>
			</div>




		);
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
	onAddRoom: PropTypes.func
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

	
	let floors = [];
	let breaksroom = [];
	let breaksroomNotFilter = [];
	let breakoutbtn = false;
	let nestedMap = new Map();
	
	floors.push({ id: me.id, value: state.me.displayName + ' (you)', roonName: 'MainRoom',roomId: state.me.roomId });
	
	
	//for (const peersId of Object.keys(peers)) {

		const participant = Object.keys(peers).length;
		let peerCnt = participant + 1;

		if (participant >= 1) {
			
		const peersId = Object.keys(peers)[0];
		const peersArray = Object.values(peers);

		for (const peer of peersArray) {
			if(nestedMap.has(peer.breakoutroomName))
			{
				let tmpArry = nestedMap.get(peer.breakoutroomName);
				tmpArry.push(peer);
				nestedMap.set(peer.breakoutroomName,tmpArry);
			}
			else
			{
			let tmpArry = [];
			tmpArry.push(peer);
			nestedMap.set(peer.breakoutroomName,tmpArry);
			}					
		}

		console.log('nestedMap   :: ',nestedMap);

		
		const filteredData =peersArray.filter((peersId)=> peersId.displayName != 'HEADER' )
		const finalData = filteredData.filter((peersId)=> state.me.id != peersId.id )
		for (const peersDatas of finalData) {
			floors.push({ id: peersDatas.id, value: peersDatas.displayName, roonName: peersDatas.breakoutroomName,roomId: peersDatas.roomId });
		}
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
	return {
		peerId: peer.id,
		room: state.room,
		isMe: state.me,
		meNow: state.me,
		DisplayName: state.me.displayName,
		countPeers: floorsData.length,
		peersNew: floorsData,
		firstletter: firstletter,
		breakoutRooms: newArray,
		breakoutbtn : breakoutbtn,
		breaksroomNotFilter:newArray1,
		nestedMap : nestedMap
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onClose: () => dispatch(stateActions.setBreakoutPeerId(null)),
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
