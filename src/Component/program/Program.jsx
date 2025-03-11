import React, { useEffect, useState } from 'react'
import dropdown from '../../img/dropdown-2.png'
import filterpic from '../../img/filter.png'
import searchpic from '../../img/search.png'
import '../program/program.css'

const Program = ({bigtitle,searching}) => {
    const [selectedValue, setSelectedValue] = useState('');
  
    const handleSelectChange = (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const displayValue = selectedOption.getAttribute('data-display-value');
      selectedOption.textContent = displayValue;
      
      if (selectedOption.value === "None"){
        selectedOption.value = "Susunan";
      }
      setSelectedValue(selectedOption.value);
      
    };

  return (
    <div className='section'>
    <div className='programsec'>
        <h1 className='title'>
            {bigtitle}
        </h1>
        <div className='features'>
            <form className='search'>
                <div className='searchbox'>
                    <input type="text" placeholder={searching} className='searchtype'/>
                </div>
                <div className='filtericon'>
                    <button type="button" className="searchbutton">
                        <img src={searchpic} alt='This is a search button.' type="submit" className="searchpic"/>
                    </button>
                </div>
            </form>
        </div>
    </div>
    </div>
  )
}

export default Program
