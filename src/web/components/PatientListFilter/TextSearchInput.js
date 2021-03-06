/**
 * Copyright 2017 Yuichiro Tsuchiya
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

export default ({
  value,
  onChange,
}: {
  value: string,
  onChange: (value: string) => void,
}) => (
  <div className="field">
    <p className="control has-icons-left has-icons-right is-expanded">
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span className="icon is-right">
        <a
          style={{ pointerEvents: 'auto' }}
          className="delete is-small"
          onClick={() => onChange('')}
        />
      </span>
      <span className="icon is-left">
        <i className="fa fa-search" />
      </span>
    </p>
  </div>
);
