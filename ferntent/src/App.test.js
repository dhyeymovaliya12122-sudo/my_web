import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MySite header brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/MySite/i);
  expect(brandElement).toBeInTheDocument();
});
