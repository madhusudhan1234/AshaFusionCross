/* @flow */

import React from 'react';
import { actions, Control } from 'react-redux-form';

const RadioGroupComponent = ({
  options,
  label,
  value,
  onChange,
}: {
  options: Array<{id: string, label: string}>,
  label: string,
  value: string,
  onChange: (newValue: string) => void,
}) => (
  <div className="control">
    <label className="label">{label}</label>
    <div className="tabs is-toggle">
      <ul>
      {options.map(option =>
        <li
          key={option.id}
          className={option.id === value && 'is-active'}
        >
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              onChange(option.id);
            }}
          >{option.label}</a>
        </li>
      )}
      </ul>
    </div>
  </div>
);

export const RadioGroup = ({
  model,
  label,
  options,
}: RadioGroupProps) => (
  <Control
    model={model}
    component={RadioGroupComponent}
    controlProps={{
      label,
      options,
    }}
    mapProps={(p) => ({
      value: p.modelValue,
      onChange: v => p.dispatch(actions.change(model, v)),
    })}
  />
);