import React, {useState} from "react"
import Fight from '../../views/Fight/Fight'
import Pack from '../../views/Pack/Pack'
import Skills from '../../views/Skills/Skills'
import Edit from '../../views/EditPage.js'
import Spells from '../../views/Spells/Spells'
import './MultiPannelViewer.css'
import SideNav from "../SideNav/SideNav"

export default function MultiPannelViewer() {
    const [ pannels, setPannels ] = useState(['skills', 'edit'])
    const windowWidth = window.innerWidth

    function getPannel(num) {


        let header = 'Fight'
        let body = <Fight />
        if(pannels[num] === 'pack') {
            header = "Pack"
            body = <Pack />
        }
        else if (pannels[num] === 'skills') {
            header = 'Skills'
            body = <Skills />
        }
        else if(pannels[num] === 'edit') {
            header = 'Edit'
            body = <Edit />
        }
        else if(pannels[num] === 'spells') {
            header = 'Spells'
            body = <Spells />
        }

        return (
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div className="pannel-header"> 
                    <h2 >{header}</h2>
                </div>
                <div className="pannel-body-container">
                    {body}
                </div>
            </div>
        )
    }

    function addPannel(p) {
        if(pannels[0] !== p && pannels[1] !== p) {
            const ps = [...pannels]
            ps[1] = ps[0]
            ps[0] = p

            setPannels(ps)
        }
    }

    return (
        <div id="pannels-container">
            <div>
                <SideNav addPannel={addPannel} pannels={pannels} />
            </div>
            <div id="all-the-pannels" >
                <div className="pannel-in-viewer"> {getPannel(0)}</div>
                {windowWidth > 1100 && <div className="pannel-in-viewer second-pannel"> {getPannel(1)}</div>}
            </div>
        </div>
    )
}