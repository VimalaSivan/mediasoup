import jsCookie from 'js-cookie';

const USER_COOKIE = 'mediasoup-demo.user';
const DEVICES_COOKIE = 'mediasoup-demo.devices';
const BREAKOUTS_COOKIE = 'mediasoup-demo.breakouts';
export function getUser()
{
	return jsCookie.getJSON(USER_COOKIE);
}

export function setUser({ displayName })
{
	jsCookie.set(USER_COOKIE, { displayName });
}

export function getDevices()
{
	return jsCookie.getJSON(DEVICES_COOKIE);
}

export function setDevices({ webcamEnabled })
{
	jsCookie.set(DEVICES_COOKIE, { webcamEnabled });
}


export function getBreakouts()
{
	return jsCookie.getJSON(BREAKOUTS_COOKIE);
}

export function setBreakouts(breakRooms )
{
	jsCookie.set(BREAKOUTS_COOKIE, breakRooms );
}
