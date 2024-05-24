'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Logo from '../../assets/logo.svg';
import './navbar.css';
import MenuIcon from '@mui/icons-material/Menu';

/**
 * Creates a responsive navigation bar with a toggle menu for
 * mobile devices and links for different pages.
 * @return {*} – Returns the Navbar component.
 */
export default function Navbar() {
	const [openLinks, setOpenLinks] = useState(false);
	// New state to track if the page has loaded
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		// Check if the page has fully loaded
		if (document.readyState === 'complete') {
			setLoaded(true);
		}
	}, []);

	const toggleNavbar = () => {
		setOpenLinks(!openLinks);
	};

	// Function to close the mobile menu
	const closeMobileMenu = () => {
		setOpenLinks(false);
	};

	return (
		<div className="navbar-container">
			{/* Logo for desktop */}
			<div className={`logo-desktop ${loaded ? 'loaded' : ''}`}>
				<Image height="40" width="40" src={Logo} alt="Logo" />
				<div className="logo-text">DishDelish</div>
			</div>
			<div className={`leftSide ${openLinks ? 'show-mobile-menu' : ''}`}>
				{/* Logo and text for mobile toggle menu */}
				<div className="close-icon" onClick={toggleNavbar}>
					{/* Close Icon */}
				</div>
				<ul>
					{/* navigation/close mobile menu on click */}
					<li>
						<Link href="/" onClick={closeMobileMenu}>
              Home
						</Link>
					</li>
					<li>
						<Link href="/about" onClick={closeMobileMenu}>
              About
						</Link>
					</li>
					<li>
						<Link href="/menu" onClick={closeMobileMenu}>
              Recipes
						</Link>
					</li>
					<li>
						<Link href="/profile" onClick={closeMobileMenu}>
              Profile
						</Link>
					</li>
				</ul>
			</div>

			<div className="rightSide">
				<Link href="/" onClick={closeMobileMenu}>
					Home
				</Link>
				<Link href="/about" onClick={closeMobileMenu}>
					About
				</Link>
				<Link href="/menu" onClick={closeMobileMenu}>
					Recipes
				</Link>
				<Link href="/profile" className="icon" onClick={closeMobileMenu}>
					<AccountCircleRoundedIcon />
				</Link>
				<button className="hamburger-button" onClick={toggleNavbar}>
					<MenuIcon/>
				</button>
			</div>
		</div>
	);
}

