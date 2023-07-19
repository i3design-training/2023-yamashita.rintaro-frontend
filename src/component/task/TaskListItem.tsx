import { Checkbox, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../../types/task';

export type TaskListItemProps = {
  task: Task;
  index: number;
  checked: number[];
  handleToggleChecked: (value: number) => () => void;
};

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  index,
  checked,
  handleToggleChecked,
}) => {
  return (
    <ListItem key={index} dense button>
      <Checkbox
        edge="start"
        checked={checked.includes(index)}
        tabIndex={-1}
        inputProps={{
          'aria-labelledby': `checkbox-list-label-${index}`,
        }}
        onClick={handleToggleChecked(index)}
      />
      <ListItemText id={`checkbox-list-label-${index}`} primary={task.title} />
      <Link to={`/tasks/${task.id}`}>詳細</Link>
    </ListItem>
  );
};
