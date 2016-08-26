/* @flow */

import React from 'react';
import {
  Link,
} from 'react-router';

export default ({
  patient,
  verbose,
  onPatientFormShowRequested,
}: {
  patient: ?PatientObject,
  verbose: boolean,
  onPatientFormShowRequested: () => void,
}) => (
  <section className="hero is-primary is-bold">
    <div className="hero-head">
      <div className="container">
        <nav className="nav">
          <div className="nav-left">
            <Link className="nav-item" to="/">
              <span className="icon"><i className="fa fa-arrow-left" /></span>
            </Link>
            {verbose && patient && [
              patient.name && <span key="name" className="nav-item">
                <span className="title">{patient.name || ''}</span>
              </span>,
              patient.age &&
                <span key="age" className="nav-item">Age: {patient.age}</span>,
              patient.sex &&
                <span key="sex" className="nav-item">Sex: {patient.sex}</span>,
              patient.address &&
                <span key="address" className="nav-item">Address: {patient.address}</span>,
            ]}
            {verbose &&
              <a
                className="nav-item"
                onClick={e => {
                  e.preventDefault();
                  onPatientFormShowRequested();
                }}
              >
                <span className="icon"><i className="fa fa-pencil-square-o" /></span>
              </a>
            }
          </div>
        </nav>
      </div>
    </div>
  </section>
);