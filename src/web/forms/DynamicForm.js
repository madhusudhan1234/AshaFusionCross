/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form';
import _get from 'lodash.get';
import {
  TextInput,
  TextUnitInput,
  TextArea,
  RadioGroup,
  Attachment,
  AttachmentInput,
  AttachmentViewer,
  Accordion,
  Checkbox,
  CheckGroup,
  AutoCalc,
  GuideTools,
  Diagnoses,
  MultiInput,
  MultiDoubleInput,
  Block,
} from './fields';

const fieldComponents = {
  textinput: TextInput,
  textunitinput: TextUnitInput,
  textarea: TextArea,
  radio: RadioGroup,
  attachment: Attachment,
  attachmentinput: AttachmentInput,
  attachmentviewer: AttachmentViewer,
  accordion: Accordion,
  check: Checkbox,
  checkgroup: CheckGroup,
  autocalc: AutoCalc,
  guide: GuideTools,
  diagnoses: Diagnoses,
  multiinput: MultiInput,
  multidoubleinput: MultiDoubleInput,
  block: Block,
};

export function checkVisibility(state: Object, rootModel: string, showProp: string|boolean) {
  if (showProp === false) {
    return false;
  }

  if (typeof showProp === 'string') {
    const [referPath, containedInArray] = showProp.split(':');
    const referent = _get(state, `${rootModel}.${referPath}`, false);

    if (!referent) { return false; }

    if (containedInArray) {
      return referent.indexOf(containedInArray) > -1;
    }
  }

  return true;
}

function createChildFields(state, rootModel, fields, warnings) {
  if (!fields) { return []; }
  return fields.map((field, i) => {
    // Handle "show" prop
    if (!checkVisibility(state, rootModel, field.show)) {
      return null;
    }

    const component = fieldComponents[field.class] || TextInput;
    let children = null;

    if (field.class === 'block' || field.class === 'accordion') {
      children = createChildFields(state, rootModel, field.children, warnings);
    }

    return React.createElement(
      component,
      {
        key: i,
        model: `${rootModel}.${field.field}`,
        label: field.label,
        warning: warnings[field.field],
        rootModel,
        ...field,
      },
      children
    );
  });
}

export const DynamicFormComponent = ({
  state,
  model,
  style,
  onSubmit,
  onRemove,
  freeze,
  warnings = {},
}: {
  state: Object,
  model: string,
  style: Array<Object>,
  onSubmit?: (data: Object) => void,
  onRemove: ?() => void,
  freeze: boolean,
  warnings?: Object,
}) => (
  <Form
    model={model}
    onSubmit={onSubmit}
  >
    {createChildFields(state, model, style, warnings)}

    {(onSubmit || onRemove) &&
      <div className="level">
        {onSubmit &&
          <p className="level-left">
            <button type="submit" className="button is-primary" disabled={freeze}>
              Submit
            </button>
          </p>
        }
        {onRemove &&
          <p className="level-right">
            <a
              className="button is-danger"
              disabled={freeze}
              onClick={e => {
                e.preventDefault();
                if (!freeze && onRemove) { onRemove(); }
              }}
            ><i className="fa fa-times" />Remove</a>
          </p>
        }
      </div>
    }
  </Form>
);

export default connect(
  state => ({ state })
)(DynamicFormComponent);