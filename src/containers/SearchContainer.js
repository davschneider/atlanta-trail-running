import React from 'react'
import SearchInput from '../components/SearchInput'
import SearchResults from '../components/SearchResults'
import TrailPage from '../components/TrailPage'
import styled from 'styled-components'
import axios from 'axios'

const atlantaAreas = [
    { label: 'Atlanta', value: 1, lat: 33.753746, lon: -84.386330 },
    { label: 'Augusta', value: 2, lat: 33.466667, lon: -81.966667 },
    { label: 'Columbus', value: 3, lat: 32.492222, lon: -84.940277 },
    { label: 'Macon', value: 4, lat: 32.838131, lon: -83.634705 },
    { label: 'Savannah', value: 5, lat: 32.076176, lon: -81.088371 },
    { label: 'Athens', value: 6, lat: 33.950001, lon: -83.383331 },
    { label: 'Valdosta', value: 7, lat: 30.832703, lon: -83.278488 }
]

const StyledSearchContainer = styled.div`
    width: 100%;
    height: 100%;
    margin-top: 1em;
    margin-left: 0px;
    
    @media (min-width: 450px) {
        min-width: 450px;
    }
`;

export default class SearchContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: { label: 'Marietta', value: 1, lat: 33.952602, lon: -84.549934 },
            maxDistance: 30,
            minDistance: 0,
            sortBy: 'quality',
            minNumStars: 2,
            searchIncomplete: true,
            trailSelected: false,
            trailIdSelected: null,
            currentTrailInfo: null,
            favTrailSelected: false,
            resultArray: null,
        }
    }

    _updateSelectedOption(selectedOption) {
        // console.log(selectedOption);
        this.setState({ selectedOption })
    }
    
    _updateMaxDist = (event) => {
        // console.log(event.target.value);
        this.setState({
            maxDistance: event.target.value
        })
    }
    
    _updateMinDist = (event) => {
        // console.log(event.target.value);
        this.setState({
            minDistance: event.target.value
        })
    }
    
    _updateSortBy = (event) => {
        // console.log(event.target.value);
        this.setState({
            sortBy: event.target.value
        });
    }

    _updateSearchIncomplete = () => {
        this.setState({
            searchIncomplete: true
        });
    }

    _clearCurrentTrailInfo = () => {
        this.setState({
            currentTrailInfo: null
        });
    }

    _updateFavTrailSelected = () => {
        // console.log('fav trail selected');
        this.setState({
            favTrailSelected: true
        })
    }

    async _updateTrailIdSelected(id) {
        // console.log(id);
        await this.setState({
            trailIdSelected: id,
            trailSelected: true
        })
        await this._getTrailInformation();
    }
    
    _printState = (event) => {
        event.preventDefault();
        console.table(this.state);
    }
    
    _getResults = (event) => {
        event.preventDefault();
        // console.table(this.state);
        axios.get(`https://www.trailrunproject.com/data/get-trails?lat=${this.state.selectedOption.lat}&lon=${this.state.selectedOption.lon}&maxDistance=${this.state.maxDistance}&minLength=${this.state.minDistance}&sort=${this.state.sortBy}&key=200688416-477b9e0468e40695259891ec8a715b01`)
            .then(response => {
                // console.log(response.data.trails);
                this.setState({
                    resultArray: response.data.trails,
                    searchIncomplete: false
                });
            })
            .catch(err => {
                console.log("Could not get search results.")
            });
    }

    _getTrailInformation() {
        axios.get(`https://www.trailrunproject.com/data/get-trails-by-id?ids=${this.state.trailIdSelected}&key=200688416-477b9e0468e40695259891ec8a715b01`)
            .then(response => {
                // console.log(response.data.trails);
                this.setState({
                    currentTrailInfo: response.data.trails
                });
            })
            .catch(err => {
                console.log("Could not get trail data.")
            })
    }

    _onFavClick(trailInfo) {
        this.props.handleFavClick(trailInfo)
    }

    _onLogClick(trailInfo) {
        this.props.handleLogClick(trailInfo)
    }

    render() {
        let { searchIncomplete, trailSelected, currentTrailInfo } = this.state;
        let content;

        if (searchIncomplete) {
            content = <SearchInput
                        dropdownOptions={atlantaAreas}
                        updateArea={this._updateSelectedOption.bind(this)}
                        updateMaxDistance={this._updateMaxDist.bind(this)}
                        updateMinDistance={this._updateMinDist.bind(this)}
                        getResults={this._getResults.bind(this)}/> 
        } else if (trailSelected && currentTrailInfo) {
            content = <TrailPage
                        trailId={this.state.trailIdSelected}
                        trailInfo={this.state.currentTrailInfo}
                        handleReturnToList={this._clearCurrentTrailInfo.bind(this)}
                        handleFavClick={this._onFavClick.bind(this)}
                        handleLogClick={this._onLogClick.bind(this)}
                         />
        } else {
            content = <SearchResults
                        onReturnToSearch={this._updateSearchIncomplete.bind(this)} 
                        searchResults={this.state.resultArray}
                        handleTrailClick={this._updateTrailIdSelected.bind(this)}/>
        }
        return(
            <StyledSearchContainer>
                {content}
            </StyledSearchContainer>
        );
    }
}