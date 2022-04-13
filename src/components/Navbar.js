import React, {useContext, useState} from 'react';
import { UserContext } from './UserContext';

const Navbar = (props) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [userContext] = useContext(UserContext);

    const handleOnChange = (event) => {
        setSearchTerm(event.target.value);
    }

    return (
        <div className='welcome-details' >
        <nav className="bp4-navbar .modifier bp4-dark">
            <div className="bp4-navbar-group bp4-align-left">
                <div className="bp4-navbar-heading"> Welcome&nbsp;
                        <strong>
                            {userContext.details.firstName}
                            {userContext.details.lastName &&
                            " " + userContext.details.lastName}
                        </strong> !</div>
                <span className="bp4-navbar-divider"></span>
                <button className="bp4-button bp4-minimal bp4-icon-star" >Favourites</button>
                <button className="bp4-button bp4-minimal bp4-icon-circle-arrow-up" >Popular</button>
            </div>
            <div className="bp4-navbar-group bp4-align-right">
                <form onSubmit={props.searchMovie(searchTerm)}>
                <input className="bp4-input" placeholder="Search Movie..." value={searchTerm} onChange={handleOnChange} type="text" />
                </form>
                <span className="bp4-navbar-divider"></span>
                <button className="bp4-button bp4-minimal bp4-icon-antenna" onClick={props.refetchHandler}>Refetch</button>
                <button className="bp4-button bp4-minimal bp4-icon-log-out" onClick={props.logoutHandler}>Logout</button>
            </div>
        </nav>
    </div>
    );
}

export default Navbar;