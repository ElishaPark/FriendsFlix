import {connect} from 'react-redux';

import { signup, clearErrors } from '../../actions/session/session_actions';
import Signup from './signup';
import {SIGN_UP} from '../../util/constants'

const mSTP = (state)=>{
    return {
        formType: SIGN_UP,
        errors: state.errors.session,
    }
}

const mDTP = (dispatch)=>{
    return {
        action: (user)=>dispatch(signup(user)),
        clearErrors: ()=>dispatch(clearErrors()),
    }
}

export default connect(mSTP, mDTP)(Signup)