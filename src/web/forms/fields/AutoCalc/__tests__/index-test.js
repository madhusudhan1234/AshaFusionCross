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

/* eslint-env jest */

jest.unmock('react-redux');
jest.unmock('lodash.get');
jest.unmock('../index');

import { shallow } from 'enzyme';
import React from 'react';
import { AutoCalcComponent, getArgs, getValue } from '../index';

describe('<AutoCalcComponent />', () => {
  it('shows value with given precision', () => {
    const wrapper = shallow(
      <AutoCalcComponent
        value={1.234567}
        precision={2}
      />
    );

    expect(wrapper.find('span').first().text())
      .toEqual('1.23');
  });

  it('shows nothing if value is null', () => {
    const wrapper = shallow(
      <AutoCalcComponent
        value={null}
        precision={2}
      />
    );

    expect(wrapper.find('span').first().text())
      .toEqual('');
  });
});

describe('getArgs', () => {
  describe('with string inputs', () => {
    it('gets values from referenceObject by specified keys', () => {
      const referenceObject = {
        foo: 100,
        bar: 20,
        baz: {
          yo: 30,
          ho: 40,
        },
      };

      expect(getArgs(['foo', 'bar'], referenceObject))
        .toEqual([100, 20]);

      expect(getArgs(['baz.yo', 'baz.ho'], referenceObject))
        .toEqual([30, 40]);

      expect(getArgs(['baz.yo', 'hoge'], referenceObject))
        .toEqual([30, undefined]);
    });
  });

  describe('with object inputs', () => {
    describe('with `const` key', () => {
      it('returns const values directly', () => {
        const inputs = [
          { const: 10 },
          { const: 20 },
        ];

        expect(getArgs(inputs, {}))
          .toEqual([10, 20]);
      });
    });
  });
});

describe('getValue', () => {
  it('gets argeumsnts by getArgs and applies them to specified function', () => {
    const targetModel = {
      foo: 100,
      bar: 20,
      baz: {
        yo: 30,
        ho: 40,
      },
    };

    const calc = (arg1, arg2) => arg1 + arg2;

    expect(getValue(targetModel, ['foo', 'bar'], calc))
      .toEqual(120);

    expect(getValue(targetModel, ['baz.yo', 'baz.ho'], calc))
      .toEqual(70);

    expect(getValue(targetModel, ['baz.yo', 'hoge'], calc))
      .toBe(null);
  });

  it('returns null if targetModel is not object', () => {
    const argKeys = [];
    const calc = () => 100;

    expect(getValue(null, argKeys, calc)).toBe(null);
    expect(getValue(0, argKeys, calc)).toBe(null);
  });

  it('returns null if calc is not callable', () => {
    expect(getValue({}, [], null)).toBe(null);
  });
});
