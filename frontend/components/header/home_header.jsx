import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {ROUTE_PROFILES, ROUTE_HOME, ROUTE_MOVIES, ROUTE_TV_SHOWS, ROUTE_SEARCH, editSearchRoute} from '../../util/route_utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faSortDown, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {fetchProfiles} from '../../actions/profile/profile_action'

import {CURRENT_PROFILE_ID} from '../../util/constants'
import { signout } from '../../actions/session/session_actions';
import { findType } from '../../util/util';

class HomeHeader extends React.Component {
    constructor(props){
        super(props)
    
        this.state = {searchBarVisible: false, path: this.props.location.pathname};
        this.showSearchBar = this.showSearchBar.bind(this);
        this.hideSearchBar = this.hideSearchBar.bind(this);
        this.signout = this.signout.bind(this);   
        this.openManageProfile = this.openManageProfile.bind(this);
        this.checkNavActiveStatus = this.checkNavActiveStatus.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
    }

    checkNavActiveStatus(expectedRoute){
        return this.state.path === expectedRoute;
    }

    componentDidMount(){
        this.props.fetchProfiles();

        ///show search bar if on search route
        if(this.props.location.pathname.includes(ROUTE_SEARCH)){
            this.showSearchBar();
        }else{
            this.hideSearchBar();
        }
    }

    showSearchBar(e){
        this.setState({searchBarVisible: true});
        
        const inputSearchElement = document.getElementById("search-input");

        //added this because of async
        //listen for change in in the input field
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.attributeName == "class"){
                    inputSearchElement.select();
                }
            });    
        });

        observer.observe(inputSearchElement, {
            attributes: true
        });

        // this.props.history.push(ROUTE_SEARCH)
    }

    hideSearchBar(e){
        this.setState({searchBarVisible: false});
        document.getElementById("search-input").value="";
        // debugger
        this.props.history.replace(ROUTE_HOME);
    }

    signout(e){
        e.preventDefault();
        this.props.signout();
    }
   
    openManageProfile(e){
        e.preventDefault();
        this.props.history.push(ROUTE_PROFILES)
    }

    componentDidUpdate(prevProps){
        if(this.props.location.pathname !== prevProps.location.pathname){
            this.setState({path: this.props.location.pathname});
        }
    }

    searchQuery(e){
        // debugger
        this.props.history.push(editSearchRoute(e.target.value));
    }
    

    render(){
    //    //debugger
        return (
            <header>
                <nav className="splash-nav">
                    <div className="home-nav-contianer-1">
                        <a href="#">
                            <img className="splash-nav-logo home-nav-logo" src={window.logo} alt="FriendsFlix logo"/>
                        </a>
                        <ul className={`home-nav-items-list `}>
                            <li><Link className={`home-nav-item  ${this.checkNavActiveStatus(ROUTE_HOME) ? "active" : ""}`} to={ROUTE_HOME}>Home</Link></li>
                            <li><Link className={`home-nav-item  ${this.checkNavActiveStatus(ROUTE_TV_SHOWS) ? "active" : ""}`}  to={ROUTE_TV_SHOWS}>TV Shows</Link></li>
                            <li><Link className={`home-nav-item  ${this.checkNavActiveStatus(ROUTE_MOVIES) ? "active" : ""}`} to={ROUTE_MOVIES}>Movies</Link></li>
                            {/* <li><Link className="home-nav-item" to="">My List</Link></li> */}
                        </ul>
                    </div>
                    
                    <div className={`home-nav-container-2 `}>
                        <div className={`home-nav-search-container  ${this.state.searchBarVisible ? "search-background" : "" }`}>
                            <FontAwesomeIcon  className="home-nav-search-icon" onClick={this.showSearchBar} icon={faSearch}/>
                            <input className={`home-nav-search-input ${!this.state.searchBarVisible ? "hidden" : "" }`}   id="search-input" placeholder="Search" type="text" name="search" onChange={this.searchQuery}/>
                            <FontAwesomeIcon onClick={this.hideSearchBar} className={!this.state.searchBarVisible ? "hidden" : "home-nav-search-close-icon" } icon={faTimesCircle}/>
                        </div>
                        
                        <span className="home-nav-profile-pic">
                            <span style={{backgroundColor: this.props.currentProfile.color }}><p>{this.props.currentProfile.title[0]}</p></span>
                            <FontAwesomeIcon className="home-nav-profile-down" icon={faSortDown}/>
                        </span>
                        <div className="profile-drop-down">
                            <div className="profile-drop-down-sub-container">
                                <ul className="profile-drop-down-list">
                                    <li onClick={this.openManageProfile} className="profile-drop-down-item">Manage Profile</li>
                                    <li onClick={this.signout} className="profile-drop-down-item">Sign Out</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

const mSTP = (state)=>{
    let id = state.session[CURRENT_PROFILE_ID];
    return {
        currentProfile: state.entities.profiles[id] ? state.entities.profiles[id] : {title: "D", color : "rgba(255, 255, 255, 0)"},
    }
}

const mDTP = (dispatch)=>{
    return{
        fetchProfiles: ()=>dispatch(fetchProfiles()),
        signout:()=>dispatch(signout()),
    }
}
export default withRouter(connect(mSTP, mDTP)(HomeHeader));