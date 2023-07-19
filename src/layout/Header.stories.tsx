import { StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Header, HeaderProps } from './Header';

export default { title: 'Components/Header', component: Header };

const template: StoryFn<HeaderProps> = (args) => (
  <MemoryRouter>
    <Header {...args} />
  </MemoryRouter>
);

export const Default = template.bind({});
Default.args = {
  sections: [
    { title: 'Section 1', url: '/section1' },
    { title: 'Section 2', url: '/section2' },
    { title: 'Section 3', url: '/section3' },
  ],
  title: 'My Header',
};

export const LoggedOut = template.bind({});
LoggedOut.args = {
  sections: [],
  title: 'My Header',
};
