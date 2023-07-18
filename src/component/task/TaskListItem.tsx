import React from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';
import { Task } from '../../types/task';
import { Link } from 'react-router-dom';

type TaskListItemProps = {
  task: Task;
  index: number;
  checked: number[];
  handleToggle: (value: number) => () => void;
};

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  index,
  checked,
  handleToggle,
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
        onClick={handleToggle(index)}
      />
      <ListItemText id={`checkbox-list-label-${index}`} primary={task.title} />
      <Link to={`/tasks/${task.id}`}>詳細</Link>
    </ListItem>
  );
};
