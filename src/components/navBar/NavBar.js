import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHouseChimney,
    faEuroSign, 
    faBreadSlice, 
    faCookieBite, 
    faPizzaSlice,
    faWineBottle,
    faWhiskeyGlass,
    faWineGlassEmpty,
    faBeerMugEmpty,
    faGlassWater,
    faFolderOpen,
    faBookMedical,
    faClockRotateLeft,
    faCalendarDays,
    faCalendarPlus, 
    faBookOpen,
    faNotesMedical,
    faClipboard
} from '@fortawesome/free-solid-svg-icons';import { Link } from 'react-router-dom'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../navBar/NavBar.css';
import Settings from '../settings/Settings';
import { Dialog } from 'primereact/dialog';

const NavBar = ({ setImageUrl }) => {

    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const toggleSettingsVisibility = () => {
        setIsSettingsVisible(!isSettingsVisible);
    };

    const items = [
        {
            label: (
                <Link to="/home" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faHouseChimney} style={{ marginRight: '0.5em' }} />
                        Αρχική σελίδα
                    </div>
                </Link>
            )
        },
        {
            label: (
                <div className="nav-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <FontAwesomeIcon icon={faEuroSign} style={{ marginRight: '0.5em' }} />
                    Τιμοκατάλογος
                </div>
            ),
            items: [
                {
                    label: (
                        <Link to="/breadlist" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faBreadSlice} style={{ marginRight: '0.5em' }} />
                                Άρτος
                            </div>
                        </Link>
                    )

                },
                {
                    label: (
                        <Link to="/breakfast" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faCookieBite} style={{ marginRight: '0.5em' }} />
                                Πρωινά
                            </div>
                        </Link>
                    )

                },
                {
                    label: (
                        <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faPizzaSlice} style={{ marginRight: '0.5em' }} />
                            Πίτσες
                        </div>
                    ),
                    items: [
                        {
                            label: (
                                <Link to="/cookedpizza" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div  style={{ display: 'flex', alignItems: 'center' }}>
                                        Ψημένες
                                    </div>
                                </Link>
                            ),
                        },
                        {
                            label: (
                                <Link to="/uncookedpizza" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        Άψητες
                                    </div>
                                </Link>
                            )
                        }
                    ]
                },
                {
                    
                    label: (
                        <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faWineBottle} style={{ marginRight: '0.5em' }} />
                            Κάβα
                        </div>
                    ),
                    items: [
                        {   
                            label: (
                                <Link to="/drinks" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                                        Ποτά
                                    </div>
                                </Link>
                            )
                        },
                        {
                            label: (
                                <Link to="/wines" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                                        Κρασιά
                                    </div>
                                </Link>
                            )
                        },
                        {   
                            label: (
                                <Link to="/beers" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                                        Μπύρες
                                    </div>
                                </Link>
                            )
                        },
                        {   
                            label: (
                                <Link to="/softdrinks" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                                        Αναψυκτικά
                                    </div>
                                </Link>
                            )
                        }
                    ]
                },
                {
                    label: '',
                    icon: 'pi pi-fw pi-user-minus',

                },
            ]
        },
        {
            label: (
                <div className="nav-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: '0.5em' }} />
                    Παραγγελίες
                </div>
            ),
            items: [
                {
                    label: (
                        <Link to="/addorder" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faBookMedical} style={{ marginRight: '0.5em' }} />
                                Προσθήκη Παραγγελίας
                            </div>
                        </Link>
                    )
                    
                },
                {
                    label: (
                        <Link to="/addorder" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: '0.5em' }} />
                                Προβολή Ιστορικού
                            </div>
                        </Link>
                    ),
                    items: [
                        {
                            label: 'Remove',
                            icon: 'pi pi-fw pi-calendar-minus'
                        }
                    ]
                }
            ]
        },
        {
            label: (
                    <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5em' }} />
                        Πρόγραμμα
                    </div>
            ),
                items: [
                    {   
                        label: (
                            <Link to="/schedule" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5em' }} />
                                    Πρόγραμμα
                                </div>
                            </Link>
                        )
                },
                {
                    label: (
                        <Link to="/addschedule" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faCalendarPlus} style={{ marginRight: '0.5em' }} />
                                 Προσθήκη Προγράμματος
                            </div>
                        </Link>
                    )
                }
            ]
        },{
            label: (
                    <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '0.5em' }} />
                        Σημειώσεις
                    </div>
            ), 
            items: [
                    { label: (
                        <Link to="/notes/calendar" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '0.5em' }} />
                                Σημειώσεις
                            </div>
                        </Link>
                        )
                    },
                    {
                        label: (
                            <Link to="/notes/calendar" className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faNotesMedical} style={{ marginRight: '0.5em' }} />
                                    Προσθήκη
                                </div>
                            </Link>
                            ), 
                    }
                ]
        }
    ];

    const start = (
        <div className="image-wrapper">
            <div style={{ textAlign: 'center', marginRight: '15px' }}>  
                <img 
                    alt="logo" 
                    src="/photos/nyxtas.png" 
                    className="mr-2 rounded-image" 
                />
            </div>
        </div>
    );

    const end = (
        <div className="flex align-items-center">
        {/* <InputText placeholder="Αναζήτηση" type="text" className="search-input mr-2" rounded /> */}
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button 
                    label="Είσοδος" 
                    icon="pi pi-sign-in" 
                    className="custom-black-button" 
                    rounded 
                />
            </Link>
            <Button 
                icon="pi pi-cog" 
                className="setting-button" 
                rounded 
                outlined 
                aria-label="Settings" 
                onClick={toggleSettingsVisibility} // Show settings dialog
            />

            {/* Dialog for Settings */}
            <Dialog
                header="Ρυθμίσεις" 
                visible={isSettingsVisible} 
                onHide={toggleSettingsVisibility} // Hide dialog on close
                style={{ width: '400px' }} // Set a fixed width for the dialog
            >
                <Settings /> {/* Include the Settings component */}
            </Dialog>
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