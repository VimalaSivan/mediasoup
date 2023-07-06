let mediaQueryDetectorElem;

export function initialize()
{
	// Media query detector stuff.
	mediaQueryDetectorElem =
		document.getElementById('mediasoup-demo-app-media-query-detector');

	return Promise.resolve();
}

export function isDesktop()
{
	return Boolean(mediaQueryDetectorElem.offsetParent);
}

export function isMobile()
{
	return !mediaQueryDetectorElem.offsetParent;
}

export function submitForm() {
	var overlay = document.getElementById('popupOverlay');
	overlay.style.display = 'none';

	alert("Room Name : "+document.getElementById('roomName') +"Display Name :"+document.getElementById('displayName'));

  }
