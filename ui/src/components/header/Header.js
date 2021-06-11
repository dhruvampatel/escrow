import './Header.css';
import { useHistory } from "react-router-dom";

const Header = () => {
    const history = useHistory();

    return(
        <nav style={{backgroundColor: 'wheat'}}>
            <div className='d-flex justify-content-center'>
                <div className='d-flex flex-row header'>
                    <button onClick={() => history.push('/buyer')} className='btn link'>
                        Buyer
                    </button>
                    <button onClick={() => history.push('/agent')} className='btn link'>
                        Agent
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Header;