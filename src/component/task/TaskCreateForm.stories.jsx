import { action } from '@storybook/addon-actions';
import TaskCreateForm from './TaskCreateForm';

export default {
  title: 'Components/TaskCreateForm',
  component: TaskCreateForm,
};

const Template = (args) => <TaskCreateForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onTaskCreated: action('Task created'),
  onClose: action('Form closed'),
};
