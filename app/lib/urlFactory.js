let protooPort = 4443;

if (window.location.hostname === 'test.mediasoup.org')
	protooPort = 4444;

export function getProtooUrl({ roomId, roomName, peerId, consumerReplicas,parentId})
{
	const hostname = window.location.hostname;

	return `wss://${hostname}:${protooPort}/?roomId=${roomId}&roomName=${roomName}&peerId=${peerId}&consumerReplicas=${consumerReplicas}&parentId=${parentId}`;
}
