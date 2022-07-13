import React, {useEffect, useState} from "react"
import Fight from '../../views/Fight/Fight'
import Pack from '../../views/Pack/Pack'
import Skills from '../../views/Skills/Skills'
import Edit from '../../views/EditPage.js'
import Spells from '../../views/Spells/Spells'
import './MultiPannelViewer.css'
import SideNav from "../SideNav/SideNav"
import { getAllSpells, writeCharacterToDb } from "../../assets/services"
import Roller from '../../components/Roller/Roller'
import { FaEdit } from 'react-icons/fa'
import {AiFillSave} from 'react-icons/ai'

export default function MultiPannelViewer() {
    const windowWidth = window.innerWidth
    const [ pannelOne, setPannelOne ] = useState('skills')
    const [ pannelTwo, setPannelTwo ] = useState(windowWidth > 1099 ? 'fight' : null)
    const [ pannelOneEditMode, setPannelOneEditMode ] = useState(false)
    const [ pannelTwoEditMode, setPannelTwoEditMode ] = useState(false)
    const [ pannelToAdd, setPannelToAdd ] = useState(null)
    const [ transitionActive, setTransitionActive ] = useState(true)
    const [ formula, setFormula ] = useState('')
    const [ fullSpellList, setfullSpellList ] = useState([])

    useEffect(() => {

        async function getFullSpellList() {
            const spells = await getAllSpells()
            console.log(spells)
            setfullSpellList(spells)
        }

        if(!fullSpellList.length) {
            getFullSpellList()
        }
    }, [])

    function getPannel(num) {
        let toGet = pannelOne
        let isEditMode = pannelOneEditMode
        let setEditMode = setPannelOneEditMode


        if(num === -1) {
            if(!pannelToAdd)
                return null

            toGet = pannelToAdd
        }

        else if(num === 1) {
            toGet = pannelTwo
            isEditMode = pannelTwoEditMode
            setEditMode = setPannelTwoEditMode
        }

        let header = 'Fight'
        let body = <Fight setFormula={setFormula} editMode={isEditMode} />
        
        
        if(toGet === 'pack') {
            header = "Pack"
            body = <Pack />
        }
        else if (toGet === 'skills') {
            header = 'Skills'
            body = <Skills setFormula={setFormula} editMode={isEditMode} />
        }
        else if(toGet === 'edit') {
            header = 'Edit'
            body = <Edit />
        }
        else if(toGet === 'spells') {
            header = 'Spells'
            body = <Spells editMode={isEditMode} fullSpellList={fullSpellList} />
        }

        return (
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div className="pannel-header"> 
                    {isEditMode ? 
                        <AiFillSave className="header-action" onClick={() => setEditMode(false)} /> 
                        : <FaEdit onClick={() => setEditMode(true)} className="header-action" />
                    }
                    <h2 >{header}</h2>
                </div>
                <div className="pannel-body-container">
                    {body}
                </div>
            </div>
        )
    }

    function addPannel(p) {

        setPannelOneEditMode(false)
        setPannelTwoEditMode(false)

        setPannelToAdd(p)
        setTransitionActive(true)

        setTimeout(() => {
            if(pannelOne !== p && pannelTwo !== p) {
                if(windowWidth > 1099)
                    setPannelTwo(pannelOne + '')
                
                setPannelOne(p)
                writeCharacterToDb()
            }
            setPannelToAdd(null)
            setTransitionActive(false)
        }, 500)
    }

    return (
        <div id="pannels-container">
            <Roller formula={formula} setFormula={setFormula} />
            <div>
                <SideNav addPannel={addPannel} pannels={[pannelOne, pannelTwo]} />
            </div>
            <div id="all-the-pannels" >
                <div id="pannel-window">
                    <div id="area-to-add-new-window" className={`${pannelToAdd !== null ? 'add-in' : ''} ${transitionActive ? 'in-transition' : ''}`}>
                        {getPannel(-1)}
                    </div>
                    <div 
                        className={`pannel-in-viewer ${pannelToAdd !== null ? 'move-right' : ''} ${transitionActive ? 'in-transition' : ''}`}> 
                        {getPannel(0)}
                    </div>
                    {
                    windowWidth > 1100 && 
                    <div className={`pannel-in-viewer second-pannel ${pannelToAdd !== null ? 'move-right fade-out' : ''} ${transitionActive ? 'in-transition' : ''}`}> {getPannel(1)}</div>
                    }
                </div>
            </div>
        </div>
    )
}