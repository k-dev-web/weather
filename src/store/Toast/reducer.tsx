const reducer = (state: any[] = [], action: any) => {
    switch (action.type) {
        case "NEW TOAST":
            return [...state, action.data];

        case "DELETE TOAST":
            return action.data;
        default:
            return state;
    }
};


export default reducer;
