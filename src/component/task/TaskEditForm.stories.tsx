import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import dayjs from 'dayjs';
import { TaskEditForm, TaskEditFormProps } from './TaskEditForm';

export default {
  title: 'Components/TaskEditForm',
  component: TaskEditForm,
};

const template: StoryFn<TaskEditFormProps> = (args) => (
  <TaskEditForm {...args} />
);

export const Default = template.bind({});
Default.args = {
  task: {
    title: 'サンプルタスク',
    description: 'サンプルサンプルサンプルサンプルサンプル',
    due_date: dayjs(),
    category_id: '999dfe0f-e7c8-448b-9c19-2c3bd28db4fe',
    status_id: '999e02d9-e953-4ff6-bdf1-c3c0f736c84c',
  },
  onTaskUpdated: () => action('Task updated'),
  handleClose: () => action('Task closed'),
  taskId: '1',
};
