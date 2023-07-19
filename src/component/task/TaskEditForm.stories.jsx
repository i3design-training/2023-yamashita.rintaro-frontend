import TaskEditForm from './TaskEditForm';
import dayjs from 'dayjs';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/TaskEditForm',
  component: TaskEditForm,
};

const Template = (args) => <TaskEditForm {...args} />;

export const Default = Template.bind({});
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
