import { MemoryRouter } from 'react-router-dom';
import { TaskListItem } from './TaskListItem';

export default {
  title: 'Components/TaskListItem',
  component: TaskListItem,
  decorators: [
    (Story) => (
      // Routerコンポーネントのコンテキスト内でのみ機能するコンポーネント(Linkなど)がある
      // Storybookでは、通常このRouterコンテキストが存在しない
      // 		解決策1. Linkコンポーネントの代わりにダミーのコンポーネントを使用する
      // 		解決策2. MemoryRouterを使ってRouterのコンテキストを提供する
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = (args) => <TaskListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
  },
  index: 1,
  checked: [],
  handleToggle: () => console.log('Toggle'),
};

export const Checked = Template.bind({});
Checked.args = {
  task: {
    id: '2',
    title: 'Test Task Checked',
  },
  index: 2,
  checked: [2],
  handleToggle: () => console.log('Toggle'),
};
