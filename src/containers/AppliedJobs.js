// dependencies
import React, {Component} from "react";
import {Link} from "react-router-dom";
import LoadingPage from "../components/LoadingPage";
import fire from '../config/Fire';

// components
import {GbCard50} from '../components/gbCard50';

export default class AppliedJobs extends Component {
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        {
          this.props.loading === false ?
            <AppliedJobsFetch {...this.props}/> :
            <LoadingPage/>
        }
      </React.Fragment>
    );
  }
}

/**
 * Helper component because we need user information to fetch data from the database.
 */
class AppliedJobsFetch extends Component {
  state = {
    loadedDb: false,
    jobList: []
  };

  database = fire.database().ref();

  componentDidMount() {
    this.fetchJobs();
  }

  /**
   * Fetches applied jobs from current user from database.
   */
  fetchJobs() {
    const {user} = this.props;
    let jobs = [];
    this.database
      .child('photographer')
      .child(user.uid)
      .child('applied-jobs')
      .once('value', snap => {
        snap.forEach(job => {
          jobs.push(job.val());
        });
      })
      .then(() => {
        this.setState({jobList: jobs});
        console.log(jobs);
      });
  }

  render() {
    const { jobList } = this.state;
    return (
      <div>
        {
          jobList.map(job => (
            <Link to={`job/${job.jobDescription.jobbId}`} key={job.jobDescription.jobbId}>
              <GbCard50
                type='half-left'
                source={{
                  txt : job.jobDescription.companyName,
                  link : `/profile/${job.jobDescription.company}`
                }}
                postedTime={job.jobDescription.date}
                category={job.jobDescription.type}
              >
                {job.jobDescription.title}
              </GbCard50>
            </Link>
          ))
        }
      </div>
    );
  }
}