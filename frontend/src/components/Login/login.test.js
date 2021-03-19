import { render, screen } from '@testing-library/react';
import Login from './Login';

test('renders learn react link', () => {
  // eslint-disable-next-line react/react-in-jsx-scope
  render(<Login />);
  const linkElement = screen.getByText(/WELCOME TO SPLITWISE!/i);
  expect(linkElement).toBeInTheDocument();
});
