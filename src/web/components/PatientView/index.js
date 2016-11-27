/* @flow */

import React, { Component } from 'react';

import Header from './Header';
import RecordsTab from './RecordsTab';
import Footer from './Footer';

import RecordChartToggle from '../../containers/PatientView/RecordChartToggle';
import RecordChartSelector from '../../containers/PatientView/RecordChartSelector';
import DynamicForm from '../../forms/DynamicForm';

type Props = {
  init: () => void,
  isFetching: boolean,
  patient: PatientObject,
  records: Array<RecordObject>,
  addNewActiveRecord: () => void,
  putActivePatient: () => void,
  putActiveRecord: (index: number) => void,
  removeActivePatient: () => void,
  isNew: boolean,
  isPuttingPatient: boolean,
  isPuttingRecord: boolean,
  patientFormVisibility: boolean,
  setPatientFormVisibility: (visibility: boolean) => void,
  selectedActiveRecordIndex: number,
  selectActiveRecord: (id: string) => void,
  setRecordFormStyleId: (styleId: string) => void,
  patientFormStyle: Array<Object>,
  recordFormStyles: Array<Object>,
  recordFormStyleId: string,
  recordFormStyle: ?string,
  params: ?Object,
  patientId: ?string,
  duplicatedPatientsExist: {
    name: boolean,
    number: boolean,
  },
  activeRecordsFormPristineness: Array<boolean>,
};

export default class PatientView extends Component {
  componentWillMount() {
    this.props.init();
  }

  props: Props;

  render() {
    const {
      isFetching,
      patient,
      records,
      addNewActiveRecord,
      putActivePatient,
      putActiveRecord,
      removeActivePatient,
      isNew,
      isPuttingPatient,
      isPuttingRecord,
      patientFormVisibility,
      setPatientFormVisibility,
      selectedActiveRecordIndex,
      selectActiveRecord,
      setRecordFormStyleId,
      patientFormStyle,
      recordFormStyles,
      recordFormStyleId,
      recordFormStyle,
      duplicatedPatientsExist,
      activeRecordsFormPristineness,
    } = this.props;

    if (isFetching) {
      return <div>Fetching...</div>;
    }

    return (
      <div className="header-fixed-container footer-fixed-container">
        <Header
          patient={patient}
          verbose={!isNew && !patientFormVisibility}
          onPatientFormShowRequested={() => setPatientFormVisibility(true)}
        />

        {(isNew || patientFormVisibility) &&
          <section className="section">
            <div className="card is-fullwidth">
              <div className="card-content">
                <div className="container">
                  <DynamicForm
                    model="activePatient"
                    style={patientFormStyle}
                    freeze={isPuttingPatient}
                    onSubmit={putActivePatient}
                    onRemove={isNew ? null : (() => {
                      if (confirm('Are you sure?')) {
                        removeActivePatient();
                      }
                    })}
                    warnings={duplicatedPatientsExist ? {
                      name: duplicatedPatientsExist.name && 'Duplicated',
                      number: duplicatedPatientsExist.number && 'Duplicated',
                    } : undefined}
                  />
                </div>
              </div>
              {!isNew &&
                <footer className="card-footer">
                  <a
                    className="card-footer-item"
                    onClick={e => {
                      e.preventDefault();
                      setPatientFormVisibility(false);
                    }}
                  >
                    <i className="fa fa-caret-square-o-up" />
                  </a>
                </footer>
              }
            </div>
          </section>
        }

        {!isNew &&
          <section className="section">
            <div className="container">
              <div className="columns">
                <RecordsTab
                  records={records}
                  selectedActiveRecordIndex={selectedActiveRecordIndex}
                  selectActiveRecord={selectActiveRecord}
                  addNewActiveRecord={addNewActiveRecord}
                  pristinenessList={activeRecordsFormPristineness}
                />
                <div className="column is-narrow control">
                  <span className="select">
                    <select
                      value={recordFormStyleId}
                      onChange={e => {
                        setRecordFormStyleId(e.target.value);
                      }}
                    >
                    {recordFormStyles.map(style =>
                      <option key={style.id} value={style.id}>{style.label}</option>
                    )}
                    </select>
                  </span>
                  <RecordChartToggle />
                </div>
              </div>

              <RecordChartSelector records={records} />

              {selectedActiveRecordIndex > -1 && (
                <div className="container">
                  <DynamicForm
                    model={`activeRecords[${selectedActiveRecordIndex}]`}
                    style={recordFormStyle}
                    freeze={isPuttingRecord}
                  />
                </div>
              )}
            </div>
          </section>
        }

        {!isNew &&
          <Footer
            onSubmit={() => putActiveRecord(selectedActiveRecordIndex)}
            freeze={isPuttingRecord}
          />
        }
      </div>
    );
  }
}
