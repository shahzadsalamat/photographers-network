import React from "react";
import fire from '../../../config/Fire';
import {Link} from 'react-router-dom';
import {GbCard50} from '../../../components/gbCard50';
import LoadingPage from "../../../components/LoadingPage";
import {MyJobsCategoryView} from "../../../components/my-jobs/MyJobsCategoryView";

export default class MyJobOffers extends React.Component {
  render() {
    return (
      <React.Fragment>
        {
          this.props.loading === false ? (
            <MyJobOffersFetch {...this.props} />
          ) : (
            <LoadingPage/>
          )

        }
      </React.Fragment>
    )
  }
}

class MyJobOffersFetch extends React.Component {
  state = {
    loadingDb: true,
    stage: 0,
    jobsList: [],
    openJobs: [],
    inProgressJobs: [],
    closedJobs: [],
  };

  componentDidMount() {
    /**
     * Check if there is a user on and if it is a company
     **/
    if (!this.props.user || this.props.user.type !== 'company') {
      this.props.history.replace('/');
    } else {
      //First get the data about the current company which jobs they have
      fire.database()
        .ref('company')
        .child(this.props.user.uid)
        .once('value', (snap) => {
          /*After having the keys of the jobs go ahead and get the data about them */
          let jobsIds = Object.keys(snap.val().postedJobs || {});

          if (jobsIds.length === 0) {
            this.setState({
              stage: 2,
              loadingDb: false,
            })
          } else {
            this.setState({
              stage: 1,
            });
            jobsIds = jobsIds.map(el => fire.database().ref('requests').child(el).once('value'));
            Promise.all(jobsIds)
              .then((values) => {
                let allJobs = values.map(el => el.val());
                this.setState({
                  loadingDb: false,
                  stage: 2,
                  jobsList: values.map(el => el.val()),
                  openJobs: allJobs.filter(job => job.status === "open"),
                  inProgressJobs: allJobs.filter(job => job.status === "in progress"),
                  closedJobs: allJobs.filter(job => job.status === "closed"),
                });
              });
          }
        });
    }
  }

  render() {
    const {loadingDb, stage, jobsList} = this.state;
    return (
      <React.Fragment>
        {
          loadingDb ? (
            <h2>Loading db... stage {stage}/2</h2>
          ) : (
            jobsList.length === 0 ? (
              <h2>You have no jobs posted yet, create your first <Link to='/createJob'>here</Link></h2>
            ) : (
              <div className="my-jobs-container">
                <MyJobsCategoryView categoryTitle="Open" jobs={this.state.openJobs}/>
                <MyJobsCategoryView categoryTitle="In Progress" jobs={this.state.inProgressJobs}/>
                <MyJobsCategoryView categoryTitle="Closed" jobs={this.state.closedJobs}/>
              </div>
            )

          )
        }
      </React.Fragment>
    )
  }
}
