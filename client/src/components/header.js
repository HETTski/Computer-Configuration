import {FaBars, FaTimes} from 'react-icons/fa';
import DarkMode from '../DarkMode/DarkMode';

export default function Header(){
    return (
        <nav className='nav'>
            <a href="/" className="site-title">Computer Informations</a>
            <ul>
                <li><a href="/processor">Processor</a></li>
                <li><a href="/software">Software</a></li>
                <li><a href="/operatingsystem">Operating System</a></li>
                <DarkMode />
            </ul>

        </nav>
    );
}