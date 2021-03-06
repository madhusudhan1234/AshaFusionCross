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

import math from 'lib/mathjs';

export default {
  'asha:bmi': (height, weight) => {
    try {
      const h = math.unit(height.value, height.unit).toNumber('m');
      const w = math.unit(weight.value, weight.unit).toNumber('kg');
      return w / h ** 2;
    } catch (e) {
      return null;
    }
  },
  'asha:math:mul': (...args) => {
    if (args.length === 0) return null;

    return args.reduce((a, b) => a * b, 1);
  },
};
