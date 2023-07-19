import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import {
  TitleAndCreateButton,
  TitleAndCreateButtonProps,
} from './titleAndCreateButton';

export default {
  title: 'Components/TitleAndCreateButton',
  component: TitleAndCreateButton,
} as Meta;

const template: StoryFn<TitleAndCreateButtonProps> = (args) => (
  <TitleAndCreateButton {...args} />
);

export const Default = template.bind({});
Default.args = {
  titleText: 'サンプルタイトル',
  onButtonClick: action('create button clicked'),
};
