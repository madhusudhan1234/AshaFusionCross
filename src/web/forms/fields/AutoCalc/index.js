/**
 * Copyright 2017 Yuichiro Tsuchiya, Yu Tachibana
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash.get';
import functions from './functions';
import classNames from 'classnames';

const alertFaIconClasses = {
  danger: 'warning',
  warning: 'warning',
  success: 'check',
};

export const AutoCalcComponent = ({
  value,
  precision,
  alerts,
}: {
  value?: string,
  precision: ?number,
  alerts?: Array<Object>,
}) => {
  let alert = null;
  if (alerts) {
    const numValue = parseFloat(value);

    alert = alerts.find(al =>
        ((al.range[0] == null || numValue >= al.range[0])
          && (al.range[1] == null || al.range[1] > numValue))
      );
  }

  return (
    <span
      className="form-static is-left-inline"
    >
      <span>
      {(precision && typeof value === 'number') ?
    value.toFixed(precision) : value}
      </span>
      <span>
        <div
          className="control"
          data-balloon={alert && alert.label}
          data-balloon-pos="up"
        >
      {alert &&
        <span
          className={classNames(
            'icon',
            { [`has-text-${alert.type}`]: true,
            }
          )}
        >
          <i
            className={`fa fa-${alertFaIconClasses[
            alert.type]}`}
          />
        </span>}
        </div>
      </span>
    </span>
  );
};

export function getValue(targetModel: Object, argKeys: Array<string>, calc: Function) {
  if (!targetModel) return null;
  if (typeof calc !== 'function') return null;

  const args = argKeys.map(argKey => _get(targetModel, argKey));

  if (args.some(arg => typeof arg === 'undefined')) return null;

  return calc.apply(null, args);
}

const mapStateToProps = (state, ownProps) => {
  const targetModel = _get(state, ownProps.rootModel);
  const calc = ownProps.calc || functions[ownProps.func];
  const value = getValue(targetModel, ownProps.inputs, calc);

  return { value };
};

const mapDispatchToProps = null;

export const AutoCalc = connect(
  mapStateToProps, mapDispatchToProps
)(AutoCalcComponent);
