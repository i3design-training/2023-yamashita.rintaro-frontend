import { StoryFn } from '@storybook/react';
import dayjs from 'dayjs';
import { MemoryRouter } from 'react-router-dom';
import { TaskListItem, TaskListItemProps } from './TaskListItem';

const checked_task_index = 2;

export default {
  title: 'Components/TaskListItem',
  component: TaskListItem,
  decorators: [
    (Story: StoryFn) => (
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

const template: StoryFn<TaskListItemProps> = (args) => (
  <TaskListItem {...args} />
);

export const Default = template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    description: 'サンプルサンプルサンプルサンプルサンプル',
    due_date: dayjs(),
    category_id: '999dfe0f-e7c8-448b-9c19-2c3bd28db4fe',
    status_id: '999e02d9-e953-4ff6-bdf1-c3c0f736c84c',
    user_id: '1',
  },
  index: 1,
  checked: [],
  handleToggleChecked: (value: number) => () => {
    console.log(`Toggle for ${value}`);
    return () => {
      // This function intentionally left blank.
    };
  },
};

export const Checked = template.bind({});
Checked.args = {
  task: {
    id: '2',
    title: 'Test Task Checked',
    description: 'サンプルサンプルサンプルサンプルサンプル',
    due_date: dayjs(),
    category_id: '999dfe0f-e7c8-448b-9c19-2c3bd28db4fe',
    status_id: '999e02d9-e953-4ff6-bdf1-c3c0f736c84c',
    user_id: '1',
  },
  index: checked_task_index,
  checked: [checked_task_index],
  handleToggleChecked: (value: number) => () => {
    console.log(`Toggle for ${value}`);
    return () => {
      // This function intentionally left blank.
    };
  },
};
