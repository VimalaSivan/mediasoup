import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import clipboardCopy from 'clipboard-copy';
import * as appPropTypes from './appPropTypes';
import { withRoomContext } from '../RoomContext';
import * as requestActions from '../redux/requestActions';
import { Appear } from './transitions';
import Me from './Me';
import ChatInput from './ChatInput';
import Peers from './Peers';
import Stats from './Stats';
import Breakout from './Breakout';
import Notifications from './Notifications';
import NetworkThrottle from './NetworkThrottle';

class Room extends React.Component {
	render() {
		const {
			roomClient,
			room,
			me,
			amActiveSpeaker,
			onRoomLinkCopy
		} = this.props;
		const slideStyles = {
			position: 'absolute',
			top: '-35px',
			right: '7px',
			cursor: 'pointer',
			backgroundcolor: '#fff',
			border: '1px solid #ccc',
			height: '25px',
			display: 'flex',
			justifycontent: 'center',
			alignitems: 'center',
			display:'none'
		  };

		if (room.isOpenbreak == undefined) {
			room.isOpenbreak = false;
		}
		if (room.isOpenbreak) {
			room.isOpenState = false;
		}
		else {
			room.isOpenState = true;
		}
		if (room.isOpenState == undefined) {
			room.isOpenState = false;
		}
		if (!room.isOpenState) {

			room.isOpenbreak = true;
		}
		else {

			room.isOpenbreak = false;
		}
		return (
			<Appear duration={300}>
				<div data-component='Room'>
					<Notifications />

					<div id="flagDiv"></div>

					<div id="stateDiv" className='state'  >
						<div className={classnames('icon', room.state)} />
						<p className={classnames('text', room.state)}>{room.state}</p>
					</div>

					<div className='room-link-wrapper'>
						<div className='room-link'>
							<a
								className='link'
								href={room.url}
								target='_blank'
								rel='noopener noreferrer'
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
							>
								invitation link
							</a>
						</div>
					</div>
					
					<Peers />
					
					<div id="meDiv"
						className={classnames('me-container', {
							'active-speaker': amActiveSpeaker
						})}
					>
						<Me />
					</div>

					

					<div className='sidebar'>
						<div
							className={classnames('button', 'hide-videos', {
								on: me.audioOnly,
								disabled: me.audioOnlyInProgress
							})}
							data-tip={'Show/hide participants\' video'}
							onClick={() => {
								me.audioOnly
									? roomClient.disableAudioOnly()
									: roomClient.enableAudioOnly();
							}}
						/>

						<div
							className={classnames('button', 'mute-audio', {
								on: me.audioMuted
							})}
							data-tip={'Mute/unmute participants\' audio'}
							onClick={() => {
								me.audioMuted
									? roomClient.unmuteAudio()
									: roomClient.muteAudio();
							}}
						/>

						<div
							className={classnames('button', 'restart-ice', {
								disabled: me.restartIceInProgress
							})}
							data-tip='Restart ICE'
							onClick={() => roomClient.restartIce()}
						/>
						<div id="slideDiv" style={slideStyles}
						onClick={() => roomClient.hideShowOtherWindows()}
						data-tip='Hide/Show'
						>
				
							<span className='icon-background'></span>
						</div>
					</div>
					

					
					<Breakout 
						onAddRoom={(displayName) =>
							{
								roomClient.addRoom(displayName);
							}}
					/>
					

					<If condition={window.NETWORK_THROTTLE_SECRET}>
						<NetworkThrottle
							secret={window.NETWORK_THROTTLE_SECRET}
						/>
					</If>

					<ReactTooltip
						type='light'
						effect='solid'
						delayShow={100}
						delayHide={100}
						delayUpdate={50}
					/>
				</div>
			</Appear>
		);
	}

	componentDidMount() {
		const { roomClient } = this.props;
		roomClient.join();
	}
}

Room.propTypes =
{
	roomClient: PropTypes.any.isRequired,
	room: appPropTypes.Room.isRequired,
	me: appPropTypes.Me.isRequired,
	amActiveSpeaker: PropTypes.bool.isRequired,
	onRoomLinkCopy: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {

	const url = new URL(location.href);
	const params = url.searchParams;
	const keys = Array.from(params.keys()).slice(0, 2);
	const urlWithParams = keys.map(key => `${key}=${params.get(key)}`).join('&');
	const urlWithFirstTwoParams = `${url.origin}${url.pathname}?${urlWithParams}`;

	
	return {
		room: state.room,
		me: state.me,
		amActiveSpeaker: state.me.id === state.room.activeSpeakerId,
		fullRoomid:urlWithFirstTwoParams
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onRoomLinkCopy: () => {
			dispatch(requestActions.notify(
				{
					text: 'Room link copied to the clipboard'
				}));
		}
	};
};

const RoomContainer = withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps
)(Room));

export default RoomContainer;