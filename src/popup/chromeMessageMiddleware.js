import * as c from './constants'

export default  postMessage=>store => next => action => {
    if (action.type === c.APPLY) {
        postMessage(action);
    }
    return next(action);
}