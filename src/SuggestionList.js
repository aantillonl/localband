import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reactStringReplace from 'react-string-replace'
import suggestionsListSlice from './SuggestionsListSlice'

function SuggestionList({
    suggestions,
    selectedOption,
    changeSelection,
    searchString
}) {
    const onKeyDown = e => {
        // User pressed the enter key
        if (e.keyCode === 13) {
        }
        // User pressed the up arrow, decrement the index
        else if (e.keyCode === 38) {
          changeSelection("UP")
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
          changeSelection("DOWN")
        } 
    }

    if (suggestions && suggestions.length > 0) {
        return <ul className="options" tabIndex="0" onKeyDown={onKeyDown}>
            {suggestions.map((suggestion, index) => (
                <li className={index === selectedOption ? "selected-option": null } key={index}>
                    {reactStringReplace(suggestion.displayName, searchString, (match, i)=><span key={i} style={{fontWeight:"bold"}}>{match}</span>)}
                </li>
            ))
            }
        </ul>
    }
    else {
        return <ul></ul>
    }
}

const mapStateToProps = (state) => ({...state.suggestionsList, searchString: state.searchBox.searchString})
  
const mapDispatch = {changeSelection: suggestionsListSlice.actions.changeSelection}

export default connect(mapStateToProps, mapDispatch)(SuggestionList);
