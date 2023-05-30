const initialState = {};

const breakoutroompeers = (state = initialState, action) =>
{
	
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

		case 'ADD_BREAK_PEER':
		{
			const { peer } = action.payload;

			return { ...state, [peer.id]: peer };
		}

		
		default:
		{
			return state;
		}
	}
};

export default breakoutroompeers;
