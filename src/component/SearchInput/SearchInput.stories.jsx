import { action } from '@storybook/addon-actions';
import SearchInput from './SearchInput';

export default {
  title: 'Components/SearchInput',
  component: SearchInput,
};

const Template = (args) => <SearchInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  // テキストフィールドへの入力時、そのアクションをStorybookのアクションロガーに表示
  handleFilter: action('Filtered'),
};
