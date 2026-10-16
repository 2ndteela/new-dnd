import React, { useEffect, useState } from "react"
import Fight from '../../views/Fight/Fight'
import Pack from '../../views/Pack/Pack'
import Skills from '../../views/Skills/Skills'
import Spells from '../../views/Spells/Spells'
import './MultiPanelViewer.css'
import SideNav from "../SideNav/SideNav"
import BottomNav from "../BottomNav/BottomNav"
import { writeCharacterToDb } from "../../assets/services"
import { FaEdit } from 'react-icons/fa'
import { AiFillSave } from 'react-icons/ai'
import CharacterContextProvider from "./CharacterContext"
import CharacterHistory from "../../views/CharacterHistory/CharacterHistory.js"
import IconButton from '../IconButton/IconButton'
import { isDesktopWidth, useIsDesktop } from '../../assets/breakpoints'

export default function MultiPanelViewer() {
    const isDesktop = isDesktopWidth()
    const [panelOne, setPanelOne] = useState('skills')
    const [panelTwo, setPanelTwo] = useState(isDesktop ? 'fight' : null)
    const [panelOneEditMode, setPanelOneEditMode] = useState(false)
    const [panelTwoEditMode, setPanelTwoEditMode] = useState(false)
    const [panelToAdd, setPanelToAdd] = useState(null)
    const [transitionActive, setTransitionActive] = useState(true)
    const [updateCharacter, setUpdateCharacter] = useState(false)
    // Live so the nav swaps when the window crosses the desktop breakpoint
    const isDesktopLayout = useIsDesktop()

    // The character sheet fills exactly the window (see .fill-window); panels scroll inside it
    useEffect(() => {
        const container = document.getElementById('app-container')
        container?.classList.add('fill-window')
        return () => container?.classList.remove('fill-window')
    }, [])

    useEffect(() => {
        if (updateCharacter) {
            setTimeout(() => { setUpdateCharacter(false) }, 50)
        }
    }, [updateCharacter])

    function saveChanges(panel) {
        if (panel === 'one')
            setPanelOneEditMode(false)

        else setPanelTwoEditMode(false)

        writeCharacterToDb()
    }

    function getPanel(num) {
        let toGet = panelOne
        let isEditMode = panelOneEditMode
        let setEditMode = setPanelOneEditMode


        if (num === -1) {
            if (!panelToAdd)
                return null

            toGet = panelToAdd
        }

        else if (num === 1) {
            toGet = panelTwo
            isEditMode = panelTwoEditMode
            setEditMode = setPanelTwoEditMode
        }

        let header = 'Fight'
        let body = <Fight editMode={isEditMode} />


        if (toGet === 'pack') {
            header = "Pack"
            body = <Pack />
        }
        else if (toGet === 'skills') {
            header = 'Skills'
            body = <Skills editMode={isEditMode} />
        }
        else if (toGet === 'spells') {
            header = 'Spells'
            body = <Spells editMode={isEditMode} />
        }
        else if (toGet === 'history') {
            header = 'Character History'
            body = <CharacterHistory editMode={isEditMode} />
        }

        return (
            <div className="panel-frame">
                <div className="panel-header">
                    {isEditMode ?
                        <IconButton label="Save changes" size="sm" tone="on-color" className="header-action" onClick={() => saveChanges(num === 0 ? 'one' : 'two')}><AiFillSave /></IconButton>
                        : <IconButton label="Edit" size="sm" tone="on-color" className="header-action" onClick={() => setEditMode(true)}><FaEdit /></IconButton>
                    }
                    <h2 >{header}</h2>
                </div>
                <div className="panel-body-container">
                    {body}
                </div>
            </div>
        )
    }

    function addPanel(p) {
        setPanelOneEditMode(false)
        setPanelTwoEditMode(false)

        setPanelToAdd(p)
        setTransitionActive(true)

        setTimeout(() => {
            if (panelOne !== p && panelTwo !== p) {
                if (isDesktop)
                    setPanelTwo(panelOne + '')

                setPanelOne(p)
                writeCharacterToDb()
            }
            setPanelToAdd(null)
            setTransitionActive(false)
        }, 500)

        writeCharacterToDb()
    }

    return (
        <CharacterContextProvider>
            <div id="panels-container">
                {isDesktopLayout && (
                    <div className="side-nav-slot">
                        <SideNav addPanel={addPanel} panels={[panelOne, panelTwo]} />
                    </div>
                )}
                <div id="all-the-panels" >
                    <div id="panel-window">
                        <div id="area-to-add-new-window" className={`${panelToAdd !== null ? 'add-in' : ''} ${transitionActive ? 'in-transition' : ''}`}>
                            {getPanel(-1)}
                        </div>
                        <div
                            className={`panel-in-viewer ${panelToAdd !== null ? 'move-right' : ''} ${transitionActive ? 'in-transition' : ''}`}>
                            {getPanel(0)}
                        </div>
                        {
                            isDesktop &&
                            <div className={`panel-in-viewer second-panel ${panelToAdd !== null ? 'move-right fade-out' : ''} ${transitionActive ? 'in-transition' : ''}`}> {getPanel(1)}</div>
                        }
                    </div>
                </div>
                {!isDesktopLayout && <BottomNav addPanel={addPanel} panels={[panelOne, panelTwo]} />}
            </div>
        </CharacterContextProvider>
    )
}