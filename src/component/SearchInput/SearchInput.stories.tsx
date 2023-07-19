import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import { SearchInput, SearchInputProps } from './SearchInput';

export default {
  title: 'Components/SearchInput',
  component: SearchInput,
};

const template: StoryFn<SearchInputProps> = (args) => <SearchInput {...args} />;
export const Default = template.bind({});
Default.args = {
  // テキストフィールドへの入力時、そのアクションをStorybookのアクションロガーに表示
  handleFilter: action('Filtered'),
};
