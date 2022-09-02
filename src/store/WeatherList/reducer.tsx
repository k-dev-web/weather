const reducer = (state:any = {
    load: false, list: [], self:{},currPage:1,dispatch: () => {
    },setTotalPages: () => {
    }
}, action: any) => {
    switch (action.type) {
        case "LOAD LIST":
            return {...state,load: true, list: Object.entries(state.self).length?[state.self,...(action.data.locations.length===5?action.data.locations.slice(0,-1):action.data.locations)]:action.data.locations,currPage:action.data.page}
        case "NEW LIST":
            return {...state,load: true, list: []};
        case "LOAD PROD":
            return {...state,load: true, };
        case "ADD LIST INIT-DATA":
            return {...state,load: false,  dispatch: action.data.dispatch, setTotalPages:action.data.setTotalPages};
        case "ADD LIST SELF":
            return {...state,load: true, list:[action.data,...(state.list.length===5?state.list.slice(0,-1):state.list)],self:action.data};

        default:
            return state;
    }
};


export default reducer;
