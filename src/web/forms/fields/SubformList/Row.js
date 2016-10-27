/* @flow */
import React from 'react';
import _get from 'lodash.get';
import type { FormFieldDefinition } from '.';
import {
  TextInputComponent,
  CheckboxComponent,
  RadioGroupComponent,
} from '../index';

const fieldComponents = {
  textinput: TextInputComponent,
  check: CheckboxComponent,
  radio: RadioGroupComponent,
};

function checkVisibility(state: Object, showProp: ?string|boolean) {
  if (showProp === false) {
    return false;
  }

  if (typeof showProp === 'string') {
    const [referPath, containedInArray] = showProp.split(':');
    const referent = _get(state, referPath, false);

    if (!referent) { return false; }

    if (containedInArray) {
      return referent.indexOf(containedInArray) > -1;
    }
  }

  return true;
}

export default ({
  value,
  fields,
  onChange,
  onRemoveItemRequested,
  readonly,
}: {
  value: Object | string,
  fields: Array<FormFieldDefinition>,
  onChange?: (newValue: Object) => void,
  onRemoveItemRequested?: () => void,
  readonly?: boolean,
}) => {
  let _value = {};
  if (typeof value === 'string') {
    // MultiInputからの移行．primary=trueのfieldに当てはめる
    const primaryField = fields.find(f => f.primary);
    if (primaryField) {
      _value[primaryField.field] = value;
    }
  } else {
    _value = value;
  }

  return (
    <div className="panel-block">
      <div className="columns is-mobile">
        <div className="column">
          <div className="control is-grouped" style={{ flexWrap: 'wrap' }} >
          {fields.map((field, i) => {
            if (!checkVisibility(_value, field.show)) {
              return null;
            }

            const component = fieldComponents[field.class];

            return React.createElement(component, {
              key: i,
              ...field,
              readonly,
              size: 'small',
              value: _value[field.field],
              onChange: (v => {
                if (!onChange) { return; }

                const updated = {};
                updated[field.field] = v;

                onChange({
                  ..._value,
                  ...updated,
                });
              }),
            });
          })}
          </div>
        </div>

        {onRemoveItemRequested &&
          <div style={{ position: 'relative' }}>
            <a
              style={{ height: '100%' }}
              className="button is-danger"
              onClick={e => {
                e.preventDefault();
                if (onRemoveItemRequested) onRemoveItemRequested();
              }}
            >
              <i className="fa fa-times" />
            </a>
          </div>
        }
      </div>
    </div>
  );
};
