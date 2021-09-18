import { UISchemaElement } from '@jsonforms/core';
import { inject } from '../../config/vue';
import merge from 'lodash/merge';
import { defaultStyles } from './defaultStyles';

const createEmptyStyles = (): Styles => ({
  control: {},
  verticalLayout: {},
  horizontalLayout: {},
  group: {},
  arrayList: {},
  label: {}
});

export interface Styles {
  control: {
    root?: string;
    input?: string;
  };
  verticalLayout: {
    root?: string;
    item?: string;
  };
  horizontalLayout: {
    root?: string;
    item?: string;
  };
  group: {
    root?: string;
    label?: string;
    item?: string;
  };
  arrayList: {
    root?: string;
    toolbar?: string;
    addButton?: string;
    label?: string;
    noData?: string;
    item?: string;
    itemHeader?: string;
    itemLabel?: string;
    itemContent?: string;
    itemMoveUp?: string;
    itemMoveDown?: string;
    itemDelete?: string;
  };
  label: {
    root?: string;
  };
}

export const useStyles = (element?: UISchemaElement) => {
  const userStyles = inject('styles', defaultStyles);
  if (!element?.options?.styles) {
    return userStyles;
  }
  const styles = createEmptyStyles();
  if (userStyles) {
    merge(styles, userStyles);
  } else {
    merge(styles, defaultStyles);
  }
  if (element?.options?.styles) {
    merge(styles, element.options.styles);
  }
  return styles;
};
