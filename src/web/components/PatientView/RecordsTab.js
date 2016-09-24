/* @flow */

import React from 'react';

export default ({
  records,
  selectedActiveRecordIndex,
  selectActiveRecord,
  addNewActiveRecord,
  dirtyIndices,
}: {
  records: Array<RecordObject>,
  selectedActiveRecordIndex: number,
  selectActiveRecord: (id: string) => void,
  addNewActiveRecord: () => void,
  dirtyIndices: Array<number>,
}) => (
  <div className="tabs is-boxed column">
    <ul>
      {records.map((record, i) => {
        const createdAt = new Date(record.$created_at);
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
              {isNaN(createdAt.getTime()) ||
                <small style={{ paddingLeft: 8 }}>
                  {createdAt.toDateString()}
                </small>
              }
              {dirtyIndices.indexOf(i) > -1 &&
                '*'
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
