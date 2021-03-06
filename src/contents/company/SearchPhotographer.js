import React, {Component} from "react";
import {SearchInput} from "../../components/form/SearchInput";
import fire from "../../config/Fire";
import {PhotographerResults} from "../../components/PhotographerResults";
import NavFooterWrapper from "../shared/NavFooterWrapper";

class SearchPhotographers extends Component {
  state = {
    searchValue: "",
    photographerResults: []
  };
  database = fire.database().ref();

  /**
   * Updates state to the current value of a certain target.
   * @param e
   */
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  /**
   * Looks for all photographers in the certain location.
   *
   * @param e
   * @param location
   */
  search = (e, location) => {
    e.preventDefault();
    let photographers = [];
    this.database.child("locations").child(location).child("photographer").once("value")
      .then(snapshots => {
        snapshots.forEach(snap => {
          let data = snap.val();
          photographers.push({
            uid: snap.key,
            photoURL: data.photoURL,
            displayName: data.displayName,
            location: location
          });
        });
      })
      .then(() => {
        this.setState({photographerResults: photographers});
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className='search-photographer section-content normalized'>
          <h1 className="gb-title-medium">Search for a photographer in</h1>
          <SearchInput name="searchValue" value={this.state.searchValue}
                       placeholder="Type in a city/location..." changeHandler={this.handleChange}
                       searchHandler={this.search}/>
          <PhotographerResults photographers={this.state.photographerResults}/>
        </div>
      </React.Fragment>
    );
  }
}

const SearchPhotographer = NavFooterWrapper(SearchPhotographers);
export default SearchPhotographer;