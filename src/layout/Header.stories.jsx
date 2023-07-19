import React from 'react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/Header',
  component: Header,
};

// routerで囲わないとuseNavigateが使えない
// MemoryRouterの子要素にすることでエラーを回避できる
const Template = (args) => (
  <MemoryRouter>
    <Header {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  sections: [
    { title: 'Section 1', url: '/section1' },
    { title: 'Section 2', url: '/section2' },
    { title: 'Section 3', url: '/section3' },
  ],
  title: 'My Header',
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  sections: [],
  title: 'My Header',
};
