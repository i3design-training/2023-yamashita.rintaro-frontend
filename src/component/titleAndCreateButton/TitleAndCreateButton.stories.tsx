import { StoryFn, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TitleAndCreateButton, {
  TitleAndCreateButtonProps,
} from './titleAndCreateButton';

export default {
  title: 'Components/TitleAndCreateButton',
  component: TitleAndCreateButton,
} as Meta;

const Template: StoryFn<TitleAndCreateButtonProps> = (args) => (
  <TitleAndCreateButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  titleText: 'サンプルタイトル',
  onButtonClick: action('create button clicked'),
};
