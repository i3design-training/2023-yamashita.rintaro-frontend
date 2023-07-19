import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import { TaskCreateForm, TodoFormProps } from './TaskCreateForm';

export default {
  title: 'Components/TaskCreateForm',
  component: TaskCreateForm,
};

const template: StoryFn<TodoFormProps> = (args) => <TaskCreateForm {...args} />;

export const Default = template.bind({});
Default.args = {
  onTaskCreated: action('Task created'),
  onClose: action('Form closed'),
};
