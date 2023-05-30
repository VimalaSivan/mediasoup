const initialState = {};

const breakoutroom = (state = initialState, action) =>
{
	console.log('action breakoutroom test',action);
	switch (action.type)
	{
		case 'SET_ROOM_STATE':
		{
			const roomState = action.payload.state;

			if (roomState === 'closed')
				return {};
			else
				return state;
		}
        case 'ADD_ROOM':
		{
			const { room } = action.payload;

			return { ...state, [room.id]: room };
		}
		
		case 'SET_PEER_BREAKOUT':
		{	
			console.log('action.payload',action.payload);
			const { room } = action.payload;

			return { ...state, [room.id]: room };
		}

		default:
			return state;
	}
};

export default breakoutroom;
