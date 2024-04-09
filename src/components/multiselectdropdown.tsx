"use client"

import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import styles from "./multiselectdropdown.module.scss";

export default function MultiSelectDropdown() {

    const [characters, setCharacters] = useState<any>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<any>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [nextReq, setNextReq] = useState<string>("");
    let [activePage, setActivePage] = useState<number>(0);
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        getCharactersByName("");
        (document.getElementById('dropdownOptionsWrapper') as HTMLElement)?.addEventListener('scroll', (event: any) => {
            const { scrollHeight, scrollTop, clientHeight } = event.target;
            if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
                setActivePage(activePage++);
                if (nextReq) {
                }
            }
        });
    },[])

    useEffect(() => {
        getNextPage(nextReq)
    }, [activePage])

    return (
        <div className={styles.multiselectWrapper}>
            <div className={styles.textInputWrapper}>
                <div className={styles.selectedWrapper}>
                    {
                        selectedCharacters.map((selected: any) => {
                            return <div className={styles.selectedItem} key={selected.id} tabIndex={0} onKeyUp={(e) => handleSelectedItemKeyUp(e, selected)}>
                                <div className={styles.selectedTitle}>{selected.name}</div>
                                <div className={styles.removeButtonWrapper} onClick={() => handleRemove(selected)}><div>x</div></div>
                            </div>

                        })
                    }
                </div>
                <input type="text" name="" id="multiselect-text" onChange={(e) => handleSearchText(e)} />
            </div>
            <div className={styles.optionsWrapper} id="dropdownOptionsWrapper">
                {
                    characters.map((character: any) => {
                        return <div className={styles.option} id={character.id.toString()} key={character.id}>
                            <div className={styles.cbWrapper}>
                                <input id={'multi_cb_' + character.id} onChange={(e) => handleCheckboxChange(e, character)} type="checkbox" />
                            </div>
                            <div className={styles.imgWrapper}>
                                <Image width={48} height={48} src={character.image} alt=""></Image>
                            </div>
                            <div className={styles.contentWrapper}>
                                <div className={styles.title}>{boldedText(character.name, searchText) }</div>
                                <div className={styles.episode}>{character.episode?.length} Episodes</div>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    );

    function handleSelectedItemKeyUp(event: any, character: any){
        if(event.code == 'Space'){
            handleRemove(character)
        }
    }

    function boldedText(text: string, shouldBeBold: string) {
        const textArray = text.split(shouldBeBold);
        return (
          <span>
            {textArray.map((item, index) => (
              <span key={index}>
                {item}
                {index !== textArray.length - 1 && (
                  <b>{shouldBeBold}</b>
                )}
              </span>
            ))}
          </span>
      );
      }

    function handleCheckboxChange(event: any, character: any) {
        if (event.target.checked) {
            setSelectedCharacters([...selectedCharacters, character])

        }
        else {
            setSelectedCharacters(selectedCharacters.filter((char: any) => char.id != character.id))
        }
    }

    function handleRemove(character: any) {
        setSelectedCharacters(selectedCharacters.filter((char: any) => char.id != character.id));
        (document.getElementById("multi_cb_" + character.id) as HTMLInputElement).checked = false;
    }

    function handleSearchText(event: any) {
        const searchText: string = event.target.value.trim();
        setSearchText(searchText)
        getCharactersByName(searchText)
    }

    async function getCharactersByName(name: string) {
        try {
            const response = await fetch('https://rickandmortyapi.com/api/character/?name=' + name);
            if (!response.ok) {
                throw new Error('API Error');
            }
            setLoader(true)
            const jsonData = await response.json();
            setCharacters(jsonData.results);
            setNextReq(jsonData.info.next);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    }

    async function getNextPage(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('API Error');
            }
            setLoader(true)
            const jsonData = await response.json();
            setCharacters([...characters, ...jsonData.results])
            setNextReq(jsonData.info.next);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    }
}


