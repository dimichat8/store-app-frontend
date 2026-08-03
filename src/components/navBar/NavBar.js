import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHouseChimney, faEuroSign, faBreadSlice, faCookieBite, 
    faPizzaSlice, faWineBottle, faFolderOpen, faBookMedical, 
    faClockRotateLeft, faCommentDots, faCalendarDays, faCalendarPlus, 
    faBookOpen, faNotesMedical, faClipboard, faListAlt, faInbox
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate  } from 'react-router-dom'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../navBar/NavBar.css';
import Settings from '../settings/Settings';
import { useAuth } from '../AuthProvider';
import NotificationBell from '../notes/NotificationBell';
import ApiService from '../ApiService';


const NavBar = ( ) => {
    const { logout, username } = useAuth();

    const items = [
        {
            template: () => (
                <Link to="/home" className="p-menuitem-link nav-link">
                    <FontAwesomeIcon icon={faHouseChimney} style={{ marginRight: '0.5em' }} />
                    Αρχική σελίδα
                </Link>
            )
        },
        {
            template: () => (
                <div className="p-menuitem-link nav-link">
                    <FontAwesomeIcon icon={faEuroSign} style={{ marginRight: '0.5em' }} />
                    Τιμοκατάλογος
                </div>
            ),
            items: [
                {
                    template: () => (
                        <Link to="/breadlist" className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faBreadSlice} style={{ marginRight: '0.5em' }} />
                            Άρτος
                        </Link>
                    )
                },
                {
                    template: () => (
                        <Link to="/breakfast" className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faCookieBite} style={{ marginRight: '0.5em' }} />
                            Πρωινά
                        </Link>
                    )
                },
                {
                    template: () => (
                        <div className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faPizzaSlice} style={{ marginRight: '0.5em' }} />
                            Πίτσες
                        </div>
                    ),
                    items: [
                        {
                            template: () => (
                                <Link to="/cookedpizza" className="p-menuitem-link nav-link">
                                    Ψημένες
                                </Link>
                            )
                        },
                        {
                            template: () => (
                                <Link to="/uncookedpizza" className="p-menuitem-link nav-link">
                                    Άψητες
                                </Link>
                            )
                        }
                    ]
                },
                {
                    template: () => (
                        <div className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faWineBottle} style={{ marginRight: '0.5em' }} />
                            Κάβα
                        </div>
                    ),
                    items: [
                        { template: () => <Link to="/drinks" className="p-menuitem-link nav-link">Ποτά</Link> },
                        { template: () => <Link to="/wines" className="p-menuitem-link nav-link">Κρασιά</Link> },
                        { template: () => <Link to="/beers" className="p-menuitem-link nav-link">Μπύρες</Link> },
                        { template: () => <Link to="/softdrinks" className="p-menuitem-link nav-link">Αναψυκτικά</Link> }
                    ]
                }
            ]
        },
        {
            template: () => (
                <div className="p-menuitem-link nav-link">
                    <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: '0.5em' }} />
                    Παραγγελίες
                </div>
            ),
            items: [
                {
                    template: () => (
                        <Link to="/show/history" className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: '0.5em' }} />
                            Προβολή Ιστορικού
                        </Link>
                    )
                },
                {
                    template: () => (
                        <Link to="/addorder" className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faBookMedical} style={{ marginRight: '0.5em' }} />
                            Προσθήκη Παραγγελίας
                        </Link>
                    )
                }
            ]
        },
        {
            template: () => (
                <div className="p-menuitem-link nav-link">
                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5em' }} />
                    Πρόγραμμα
                </div>
            ),
            items: [
                {
                    template: () => (
                        <Link to="/schedule" className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5em' }} />
                            Πρόγραμμα
                        </Link>
                    )
                },
                {
                    template: () => (
                        <Link to="/addschedule" className="p-menuitem-link nav-link">
                            <FontAwesomeIcon icon={faCalendarPlus} style={{ marginRight: '0.5em' }} />
                            Προσθήκη Προγράμματος
                        </Link>
                    )
                }
            ]
        },
        {
            template: () => (
                <div className="p-menuitem-link nav-link">
                    <FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '0.5em' }} />
                    Σημειώσεις
                </div>
            ),
            items: [
                { template: () => <Link to="/notes/show/calendar" className="p-menuitem-link nav-link"><FontAwesomeIcon icon={faClipboard} style={{ marginRight: '0.5em' }} />Σημειώσεις</Link> },
                { template: () => <Link to="/notes/add/calendar" className="p-menuitem-link nav-link"><FontAwesomeIcon icon={faNotesMedical} style={{ marginRight: '0.5em' }} />Προσθήκη Σημείωσης</Link> }
            ]
        },
        {
             template: () => (
                                <Link
                                    to="/chat/show/all/conversation"
                                    className="p-menuitem-link nav-link"
                                >
                                    <FontAwesomeIcon icon={faCommentDots} style={{ marginRight: '0.5em' }} />
                                    Συνομιλίες
                                </Link>
            )
        },
        {
            template: () => 
                                <Link
                                    to="/chat"
                                    className="p-menuitem-link nav-link"
                                >
                                    <FontAwesomeIcon icon={faCommentDots} style={{ marginRight: '0.5em' }} />
                                    Συν
                                </Link>
        },
        {
            template: () => 
                                <Link
                                    to="/pos"
                                    className="p-menuitem-link nav-link"
                                >
                                    <FontAwesomeIcon icon={faEuroSign} style={{ marginRight: '0.5em' }} />
                                    Σκανάρισμα
                                </Link>
        }
    ];

    const start = (
        <div className="image-wrapper">
            <img alt="logo" src="/nyxtas.png" className="mr-2 rounded-image" />
        </div>
    );

    const end = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
        <span className="welcome user">
            Γεία σας 😁 <br />
            <b>{username ? username : 'Guest'}</b>
        </span>
        <Button 
            label="Αποσύνδεση" 
            icon="pi pi-sign-out" 
            className="custom-black-button" 
            rounded
            onClick={async () => {
                try {
                     await logout();
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            }}
        />
        <div className="notification-bell-wrapper" style={{ display: 'inline-flex', position: 'relative' }}>
            <NotificationBell />
        </div>
    </div>
);

    return (
        <div>
            <div className="card">
                <Menubar model={items} start={start} end={end} />
            </div>
        </div>
    );
};

export default NavBar;