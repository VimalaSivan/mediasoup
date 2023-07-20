import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import * as cookiesManager from '../cookiesManager';
import * as appPropTypes from './appPropTypes';
import { withRoomContext } from '../RoomContext';
import * as stateActions from '../redux/stateActions';
import PeerView from './PeerView';

class Me extends React.Component
{
	constructor(props)
	{
		super(props);

		this._mounted = false;
		this._rootNode = null;
		this.broadcast_flag  = 0;
	}
	async getData() {
		
		

		if(this.broadcast_flag == 0){ 
			console.log('this.props.broadcast_id',this.props.broadcast_id);

				try { 
					if(this.props.broadcast_id != 0){
						this.deleteBroadcasting(this.props.broadcast_id);
					}
					this.addBroadCasting();
				 } catch (error) {
						console.log("error----", error)
				 }
			}
		  else{  

		         this.deleteBroadcasting(this.props.broadcast_id);

			 }
				

		}
		async addBroadCasting(){
						let BROADCASTER_ID;
						let currentRoomid = location.href.split("&")[1].split("=")[1];
						console.log("Room Id :: ",currentRoomid);
						this.broadcast_flag  = 1;
						const res = await fetch('https://192.168.43.239:4443/rooms/'+currentRoomid+'/broadcast',{
								mode: 'no-cors',
								method: "get",
								headers: {
										"Content-Type": "application/json"
								}
		                });
						console.log("Broadcasting res ::", JSON.stringify(res))
						BROADCASTER_ID = JSON.stringify(res);
		}
	    async deleteBroadcasting(broadcast_id){
				 console.log("broadcast_id :: ",broadcast_id);
				 this.broadcast_flag  = 0;
				 let currentRoomid = location.href.split("&")[1].split("=")[1];
				 console.log("Room Id :: ",currentRoomid);

				let qryUrl = 'https://192.168.43.239:4443/rooms/'+currentRoomid+'/deleteBroadcast/'+broadcast_id;

				 try { 
					 const res = await fetch(qryUrl,{
							 mode: 'no-cors',
							 method: "get",
							 headers: {
									 "Content-Type": "application/json"
							 }
					 });
					 this.broadcast_flag  = 0;
					 console.log("Delete Broadcasting res ::", JSON.stringify(res))
					} catch (error) {
							console.log("error----", error)
					}
	}
  	 async pauseProducer() {
			try { 
				   

				
			} catch (error) {
					console.log("error----", error)
			}
	}

	render()
	{
		const {
			roomClient,
			connected,
			me,
			audioProducer,
			videoProducer,
			faceDetection,
			chatMap,
			onSetStatsPeerId,
			onSetBreakoutPeerId,
			broadcast_id
		} = this.props;

		let micState;

		if (!me.canSendMic)
			micState = 'unsupported';
		else if (!audioProducer)
			micState = 'unsupported';
		else if (!audioProducer.paused)
			micState = 'on';
		else
			micState = 'off';

		let webcamState;

		if (!me.canSendWebcam)
			webcamState = 'unsupported';
		else if (videoProducer && videoProducer.type !== 'share')
			webcamState = 'on';
		else
			webcamState = 'off';

		let changeWebcamState;

		if (Boolean(videoProducer) && videoProducer.type !== 'share' && me.canChangeWebcam)
			changeWebcamState = 'on';
		else
			changeWebcamState = 'unsupported';

		let shareState;

		if (Boolean(videoProducer) && videoProducer.type === 'share')
			shareState = 'on';
		else
			shareState = 'off';

		const videoVisible = Boolean(videoProducer) && !videoProducer.paused;

		let tip;

		if (!me.displayNameSet)
			tip = 'Click on your name to change it';

		return (
			<div
				data-component='Me'
				ref={(node) => (this._rootNode = node)}
				data-tip={tip}
				data-tip-disable={!tip}
			>
				<If condition={connected}>
					<div className='controls'>
						<div
							className={classnames('button', 'mic', micState)}
							onClick={() =>
							{
								micState === 'on'
									? roomClient.muteMic()
									: roomClient.unmuteMic();
							}}
						/>

							{/* <div
							className={classnames('button', 'mic', micState)}
							onClick={() =>
							{
								roomClient.pauseBroadcast();
							}}
						/> */}

						<div
							className={classnames('button', 'webcam', webcamState, {
								disabled : me.webcamInProgress || me.shareInProgress
							})}
							onClick={() =>
							{
								if (webcamState === 'on')
								{
									cookiesManager.setDevices({ webcamEnabled: false });
									roomClient.disableWebcam();
								}
								else
								{
									cookiesManager.setDevices({ webcamEnabled: true });
									roomClient.enableWebcam();
								}
							}}
						/>

						<div
							className={classnames('button', 'change-webcam', changeWebcamState, {
								disabled : me.webcamInProgress || me.shareInProgress
							})}
							onClick={() => roomClient.changeWebcam()}
						/>

						<div
							className={classnames('button', 'share', shareState, {
								disabled : me.shareInProgress || me.webcamInProgress
							})}
							onClick={() =>
							{
								if (shareState === 'on')
									roomClient.disableShare();
								else
									roomClient.enableShare();
							}}
						/>

						<If condition={this.props.role_flag == 1}>
						 <div title="Start/Stop" className={classnames('button', 'broadcast')}  onClick={() => this.getData()} />
						</If>


						{/* <div title="Start/Stop" className={classnames('button', 'broadcast')}  onClick={() => this.getData()} /> */}

						<div className={classnames('button', 'chat-icon')} onClick={() =>
							{
								roomClient.openChatDiv(chatMap);
							}} >
						{/* <span className="badge"></span> */}
						</div>

					</div>
				</If>

				<PeerView
					isMe
					peer={me}
					audioProducerId={audioProducer ? audioProducer.id : null}
					videoProducerId={videoProducer ? videoProducer.id : null}
					audioRtpParameters={audioProducer ? audioProducer.rtpParameters : null}
					videoRtpParameters={videoProducer ? videoProducer.rtpParameters : null}
					audioTrack={audioProducer ? audioProducer.track : null}
					videoTrack={videoProducer ? videoProducer.track : null}
					videoVisible={videoVisible}
					audioCodec={audioProducer ? audioProducer.codec : null}
					videoCodec={videoProducer ? videoProducer.codec : null}
					audioScore={audioProducer ? audioProducer.score : null}
					videoScore={videoProducer ? videoProducer.score : null}
					faceDetection={faceDetection}
					onChangeDisplayName={(displayName) =>
					{
						roomClient.changeDisplayName(displayName);
					}}
					onChangeMaxSendingSpatialLayer={(spatialLayer) =>
					{
						roomClient.setMaxSendingSpatialLayer(spatialLayer);
					}}
					onStatsClick={onSetStatsPeerId}
					onBreakoutClick={() =>
					{
						roomClient.openbreakout();
					}}
					onExpandClick={(className,peerId) =>
					{
						roomClient.windowMaxMin(className,peerId);
					}}
				/>

				<ReactTooltip
					type='light'
					effect='solid'
					delayShow={100}
					delayHide={100}
					delayUpdate={50}
				/>
			</div>
		);
	}

	componentDidMount()
	{
		this._mounted = true;

		setTimeout(() =>
		{
			if (!this._mounted || this.props.me.displayNameSet)
				return;

			ReactTooltip.show(this._rootNode);
		}, 4000);
	}

	componentWillUnmount()
	{
		this._mounted = false;
	}

	componentDidUpdate(prevProps)
	{
		if (!prevProps.me.displayNameSet && this.props.me.displayNameSet)
			ReactTooltip.hide(this._rootNode);
	}
}

Me.propTypes =
{
	roomClient       : PropTypes.any.isRequired,
	connected        : PropTypes.bool.isRequired,
	me               : appPropTypes.Me.isRequired,
	audioProducer    : appPropTypes.Producer,
	videoProducer    : appPropTypes.Producer,
	faceDetection    : PropTypes.bool.isRequired,
	onSetStatsPeerId : PropTypes.func.isRequired,
	onSetBreakoutPeerId : PropTypes.func.isRequired
};

const mapStateToProps = (state) =>
{
	const producersArray = Object.values(state.producers);
	const audioProducer =
		producersArray.find((producer) => producer.track.kind === 'audio');
	const videoProducer =
		producersArray.find((producer) => producer.track.kind === 'video');
		console.log('state in Me :: ', state);
		let broadcast_id    = 0;

		const currentRoomid = location.href.split("&")[1].split("=")[1];
		const peersArray    = Object.values(state.peers);
		const matchingValue = peersArray.find(peersId => peersId.displayName == 'Broadcaster' && peersId.roomId == currentRoomid);
		if(typeof (matchingValue) != "undefined" && matchingValue != "")
           broadcast_id     = matchingValue.id;
		   
		// const rootPeer = peersArray.find(peersId => peersId.roleFlag == 1 && peersId.roomId == currentRoomid && state.me.id == peersId.id);
		// if(typeof (rootPeer) != "undefined" && rootPeer != "")
        //    role_flag        = 1;

		const urlParams = new URL(location.href);
		const role_flag = urlParams.searchParams.get('flag');


	return {
		connected     : state.room.state === 'connected',
		me            : state.me,
		audioProducer : audioProducer,
		videoProducer : videoProducer,
		faceDetection : state.room.faceDetection,
		chatMap:state.room.chatData,
		broadcast_id  : broadcast_id,
		role_flag  : role_flag
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onSetStatsPeerId : (peerId,isOpenState) => dispatch(stateActions.setRoomStatsPeerId(peerId,isOpenState)),
		onSetBreakoutPeerId : (peerId,isOpenbreak) => dispatch(stateActions.setBreakoutPeerId(peerId,isOpenbreak))
	};
};

const MeContainer = withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps
)(Me));

export default MeContainer;
