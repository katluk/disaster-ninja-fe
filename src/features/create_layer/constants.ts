import {
  UserDataFieldImage,
  UserDataFieldLink,
  UserDataFieldLongTextType,
  UserDataFieldShortTextType,
} from '~core/logical_layers/types/userData';

export const CREATE_LAYER_CONTROL_ID = 'CreateLayer';

export const USER_LAYER_FIELDS = [
  {
    label: 'Short Text',
    type: UserDataFieldShortTextType
  },
  {
    label: 'Long Text',
    type: UserDataFieldLongTextType
  },
  {
    label: 'Link',
    type: UserDataFieldLink
  },
  {
    label: 'Image',
    type: UserDataFieldImage
  }
];
