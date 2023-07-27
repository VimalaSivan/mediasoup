import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as appPropTypes from './appPropTypes';
import { Appear } from './transitions';
import Peer from './Peer';

const Peers = ({ peers, activeSpeakerId }) =>
{

	const slideStyles = {
		position: 'absolute',
		top: '10px',
		right: '10px',
		cursor: 'pointer',
		backgroundcolor: '#fff',
		border: '1px solid #ccc',
		height: '25px',
		display: 'flex',
		justifycontent: 'center',
		alignitems: 'center',
		display:'none'
	  };


	return (
		<div>
		<div id="fullDiv"> </div>
		<div id="contentDiv" style={{display:"inline-flex" }} data-component='Peers'>
		
			
		
			{
				peers.map((peer) =>
				{

					const peerStyles = {
						width: '280px',
						height: '250px',
						
					  };

					return (
						<Appear key={peer.id} duration={1000}>
						
								<div  id={`div_register_${peer.id}`}
									style={peerStyles}
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
			
	   </div></div>
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
	const currentRoomid = location.href.split("&")[1].split("=")[1];

		
	const filteredData =peersArray.filter((peersId)=> peersId.displayName != 'HEADER' && peersId.roomId == currentRoomid)

	const finalData = filteredData.filter((peersId)=> state.me.id != peersId.id )


	
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
