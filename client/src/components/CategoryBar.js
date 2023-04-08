import React, { useState } from 'react'

const sports = ['All', 'NCAAF', 'NFL', 'MLB', 'NBA', 'NCAAB', 'NHL', 'MMA', 'WNBA', 'MLS']

const seasons = {
    'NCAAF': {start: new Date('2022-08-27'), end: new Date('2023-01-09')},
    'NFL': {start: new Date('2022-09-08'), end: new Date('2023-02-05')},
    'MLB': {start: new Date('2022-03-31'), end: new Date('2022-10-02')},
    'NBA': {start: new Date('2022-10-19'), end: new Date('2023-04-10')},
    'NCAAB': {start: new Date('2022-11-08'), end: new Date('2023-04-03')},
    'NHL': {start: new Date('2022-10-12'), end: new Date('2023-04-08')},
    'MMA': {start: new Date('2022-10-01'), end: new Date('2023-04-01')},
    'WNBA': {start: new Date('2022-05-13'), end: new Date('2022-09-18')},
    'MLS': {start: new Date('2022-02-26'), end: new Date('2022-10-09')},
};

const CategoryBar = ({ handleSelect }) => {

    const [activeCategory, setActiveCategory] = useState(0)

    const activeCategoryStyle = 'p-2 mx-5 my-2 bg-blue-200 rounded-lg hover:bg-blue-300'
    const notActiveCategoryStyle = 'p-2 mx-5 my-2 bg-gray-200 rounded-lg hover:bg-gray-300'
  
    // Filter out sports that are not currently in season
    const inSeasonSports = sports.filter(sport => {
        const today = new Date();
        const season = seasons[sport];
        if (sport === 'All') {
            return true
        }
        return today >= season.start && today <= season.end;
    });

    // Filter out unwanted sports
    const indexMapping = {}
    sports.forEach((sport, index) => {
        indexMapping[sport] = index
    })

    return (
        <div>
            <div className='flex overflow-x-scroll'>
                {inSeasonSports.map((sport, index) => {
                    return (
                        <button 
                            key={index}
                            onClick={() => {
                                setActiveCategory(index)
                                handleSelect(indexMapping[sport])
                            }}
                            className={activeCategory === index ? activeCategoryStyle : notActiveCategoryStyle}
                        >
                            {sport}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default CategoryBar
