import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as appPropTypes from './appPropTypes';
import { withRoomContext } from '../RoomContext';
import * as stateActions from '../redux/stateActions';
import PeerView from './PeerView';

const Peer = (props) =>
{
	const {
		roomClient,
		peer,
		audioConsumer,
		videoConsumer,
		audioMuted,
		faceDetection,
		onExpandClick,
		onSetStatsPeerId,
		onSetBreakoutPeerId,
		consumerValue,
		peersArr
	} = props;

	const audioEnabled = (
		Boolean(audioConsumer) &&
		!audioConsumer.locallyPaused &&
		!audioConsumer.remotelyPaused
	);

	const videoVisible = (
		Boolean(videoConsumer) &&
		!videoConsumer.locallyPaused &&
		!videoConsumer.remotelyPaused
	);
	
	if(consumerValue){
		//console.log('ClassName',peer.id);
		console.log('consumerValue Id',consumerValue);
		console.log('consumerValue peerId',peersArr);
		if(typeof (consumerValue) !== "undefined"){
		    if(peersArr.length > 0){
				var peersNew  = peersArr.find(item =>
					{
						return item.consumers.find(item =>  (item==consumerValue.id));			
					}			
					); 
					console.log('consumerValue peersArr New',peersNew);
					let ClassName = "icon expand "+peersNew.id;
					console.log('consumerValue peersArr New',peersNew);
					roomClient.windowMaxMin(ClassName,peersNew.id);
					
			}
	    }
	}
	if(peersArr.length > 0){
		var peersBroadCast  = peersArr.find(item =>
			{
				return (item.displayName=="Broadcaster");			
			}			
			); 
			if(typeof (peersBroadCast) !== "undefined"){
				console.log('peersBroadCast',peersBroadCast);
				let ClassNameBroadCast = "icon expand "+peersBroadCast.id;
				roomClient.windowMaxMin(ClassNameBroadCast,peersBroadCast.id);
			}
			
	}
	return (
		
		//console.log(this.props.peersArr);
		<div data-component='Peer'>
			<div className='indicators'>
				<If condition={!audioEnabled}>
					<div className='icon mic-off' />
				</If>

				<If condition={!videoConsumer}>
					<div className='icon webcam-off' />
				</If>
			</div>

			<PeerView
				peer={peer}
				audioConsumerId={audioConsumer ? audioConsumer.id : null}
				videoConsumerId={videoConsumer ? videoConsumer.id : null}
				audioRtpParameters={audioConsumer ? audioConsumer.rtpParameters : null}
				videoRtpParameters={videoConsumer ? videoConsumer.rtpParameters : null}
				consumerSpatialLayers={videoConsumer ? videoConsumer.spatialLayers : null}
				consumerTemporalLayers={videoConsumer ? videoConsumer.temporalLayers : null}
				consumerCurrentSpatialLayer={
					videoConsumer ? videoConsumer.currentSpatialLayer : null
				}
				consumerCurrentTemporalLayer={
					videoConsumer ? videoConsumer.currentTemporalLayer : null
				}
				consumerPreferredSpatialLayer={
					videoConsumer ? videoConsumer.preferredSpatialLayer : null
				}
				consumerPreferredTemporalLayer={
					videoConsumer ? videoConsumer.preferredTemporalLayer : null
				}
				consumerPriority={videoConsumer ? videoConsumer.priority : null}
				audioTrack={audioConsumer ? audioConsumer.track : null}
				videoTrack={videoConsumer ? videoConsumer.track : null}
				audioMuted={audioMuted}
				videoVisible={videoVisible}
				videoMultiLayer={videoConsumer && videoConsumer.type !== 'simple'}
				audioCodec={audioConsumer ? audioConsumer.codec : null}
				videoCodec={videoConsumer ? videoConsumer.codec : null}
				audioScore={audioConsumer ? audioConsumer.score : null}
				videoScore={videoConsumer ? videoConsumer.score : null}
				faceDetection={faceDetection}
				onChangeVideoPreferredLayers={(spatialLayer, temporalLayer) =>
				{
					roomClient.setConsumerPreferredLayers(
						videoConsumer.id, spatialLayer, temporalLayer);
				}}
				onChangeVideoPriority={(priority) =>
				{
					roomClient.setConsumerPriority(videoConsumer.id, priority);
				}}
				onRequestKeyFrame={() =>
				{
					roomClient.requestConsumerKeyFrame(videoConsumer.id);
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
				//{onSetBreakoutPeerId}
			/>
		</div>
	);
};

Peer.propTypes =
{
	roomClient       : PropTypes.any.isRequired,
	peer             : appPropTypes.Peer.isRequired,
	audioConsumer    : appPropTypes.Consumer,
	videoConsumer    : appPropTypes.Consumer,
	audioMuted       : PropTypes.bool,
	faceDetection    : PropTypes.bool.isRequired,
	onSetStatsPeerId : PropTypes.func.isRequired,
	onSetBreakoutPeerId : PropTypes.func.isRequired,
	onExpandClick: PropTypes.func
};

const mapStateToProps = (state, { id }) =>
{
	const me = state.me;
	const peer = state.peers[id];
	const consumersArray = peer.consumers
		.map((consumerId) => state.consumers[consumerId]);
	const audioConsumer =
		consumersArray.find((consumer) => consumer.track.kind === 'audio');
	const videoConsumer =
		consumersArray.find((consumer) => consumer.track.kind === 'video');
	console.log("consumersArray ::",state.consumers);
	const consumersNewArray = Object.values(state.consumers);
	const consumerValue = consumersNewArray.find(consumers => consumers.type == 'simulcast');
	console.log("consumerValue",consumerValue);
	
	return {
		peer,
		audioConsumer,
		videoConsumer,
		audioMuted    : me.audioMuted,
		faceDetection : state.room.faceDetection,
		consumerValue:consumerValue,
		peersArr : Object.values(state.peers)
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onSetStatsPeerId : (peerId,isOpenState) => dispatch(stateActions.setRoomStatsPeerId(peerId,isOpenState)),
		onSetBreakoutPeerId : (peerId,isOpenbreak) => dispatch(stateActions.setBreakoutPeerId(peerId,isOpenbreak))
	};
};

const PeerContainer = withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps
)(Peer));

export default PeerContainer;
