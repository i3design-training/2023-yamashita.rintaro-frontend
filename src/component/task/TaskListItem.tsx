import { Checkbox, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../../types/task';

export type TaskListItemProps = {
  task: Task;
  index: number;
  checkedTaskIds: number[];
  handleToggleTaskCheck: (value: number) => () => void;
};

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  index,
  checkedTaskIds,
  handleToggleTaskCheck,
}) => {
  return (
    <ListItem key={index} dense button>
      <Checkbox
        edge="start"
        checked={checkedTaskIds.includes(index)}
        tabIndex={-1}
        inputProps={{
          'aria-labelledby': `checkbox-list-label-${index}`,
        }}
        onClick={handleToggleTaskCheck(index)}
      />
      <ListItemText id={`checkbox-list-label-${index}`} primary={task.title} />
      <Link to={`/tasks/${task.id}`}>詳細</Link>
    </ListItem>
  );
};
