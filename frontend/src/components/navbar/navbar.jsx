import styles from "./navbar.module.css"
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEventNote, MdOutlineMenu  } from "react-icons/md";
import { Drawer } from "@mui/material";
import { useState } from "react";


export default function Navbar() {
    
    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
    }


    return(
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarItems}>
                    <img src="/logo.png" alt="Logo" className={styles.logo} />
                    <div className={styles.navbarLinksContainer}>
                        <a href="#" className={styles.navbarLink}>Home</a>
                        <a href="#" className={styles.navbarLink}>Events</a>
                        <MdOutlineEventNote className={styles.navbarLink}/>
                        <FaRegUser className={styles.navbarLink} />
                    </div>
            </div>
            <div className={styles.mobileNavbarItems}>
                <img src="/logo.png" alt="Logo" className={styles.logo} />
                <div className={styles.mobileNavbarBtns}>
                        <MdOutlineEventNote className={styles.navbarLink}/>
                        <MdOutlineMenu className={styles.navbarLink} onClick={handleOpenMenu} />
                </div>
            </div>
            <Drawer
            anchor='right'
            open={openMenu}
            onClose={handleOpenMenu}>
                <div className={styles.drawer}>
                    <a href="#" className={styles.navbarLink}>Home</a>
                    <a href="#" className={styles.navbarLink}>Profile</a>
                    <a href="#" className={styles.navbarLink}>News</a>
                </div>
            </Drawer>
        </nav>
    )
}