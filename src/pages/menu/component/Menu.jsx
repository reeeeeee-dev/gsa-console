import React from 'react';
import styles from "./Menu.styles.scss";
import {Sidenav} from "../../../common/navigation/component/Sidenav";


export function Menu() {
    return (
        <div> 
            <div class="rootDiv">
                Welcome to the Main Menu Page!
                {/*This is where everything relating to transaction component in here, 
                this is where everything displayed will go, aka like fields*/}
            
            </div>
            <Sidenav/>
        </div>
    )
}

//export default Transaction;