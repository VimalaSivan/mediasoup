import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as appPropTypes from './appPropTypes';
import { Appear } from './transitions';
import Peer from './Peer';

const Peers = ({ peers, activeSpeakerId }) =>
{
	return (
		<div data-component='Peers'>
		
			{
				peers.map((peer) =>
				{
					return (
						<Appear key={peer.id} duration={1000}>
							<div
								className={classnames('peer-container', {
									'active-speaker' : peer.id === activeSpeakerId
								})}
							>
								<Peer id={peer.id} />
							</div>
						</Appear>
					);
				})
			}
		</div>
	);
};

Peers.propTypes =
{
	peers           : PropTypes.arrayOf(appPropTypes.Peer).isRequired,
	activeSpeakerId : PropTypes.string
};

const mapStateToProps = (state) =>
{
	const peersArray = Object.values(state.peers);
	console.log("peersArray",peersArray);
	console.log(' peersArray state.me.id',state.me.id);
	console.log(' state ---> ',state);
	//for (const peersId of peersArray) {
		//console.log("peersId",peersId.id);

	const currentRoomid = location.href.split("&")[1].split("=")[1];
	console.log(' currentRoomid ---> ',currentRoomid);
		
	const filteredData =peersArray.filter((peersId)=> peersId.displayName != 'HEADER' && peersId.roomId == currentRoomid )
	console.log("peersArray filteredData",filteredData);
	const finalData = filteredData.filter((peersId)=> state.me.id != peersId.id )
	//}
	console.log("peersArray remove",finalData);
	return {
		peers           : finalData,
		activeSpeakerId : state.room.activeSpeakerId
	};
};

const PeersContainer = connect(
	mapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.peers === next.peers &&
				prev.room.activeSpeakerId === next.room.activeSpeakerId
			);
		}
	}
)(Peers);

export default PeersContainer;
