/* @flow */

import React from 'react';

export default ({
  records,
  selectedActiveRecordIndex,
  selectActiveRecord,
  addNewActiveRecord,
}: {
  records: Array<RecordObject>,
  selectedActiveRecordIndex: number,
  selectActiveRecord: (id: string) => void,
  addNewActiveRecord: () => void,
}) => (
  <div className="tabs is-boxed column">
    <ul>
      {records.map((record, i) => {
        const timestamp = record.$created_at || record.$initialized_at;
        const date = timestamp && new Date(timestamp);
        const hasAttachments =
          record._attachments && Object.keys(record._attachments).length > 0;

        return (
          <li
            key={record._id}
            className={(selectedActiveRecordIndex === i) && 'is-active'}
          >
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                selectActiveRecord(record._id);
              }}
            >
              {hasAttachments &&
                <span className="icon is-small">
                  <i className="fa fa-paperclip" />
                </span>
              }
              {i + 1}
              {date &&
                <small style={{ paddingLeft: 8 }}>
                  {date.toDateString()}
                </small>
              }
            </a>
          </li>
        );
      })}
      <li>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            addNewActiveRecord();
          }}
        >+</a>
      </li>
    </ul>
  </div>
);
