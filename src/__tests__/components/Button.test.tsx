import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '../../shared/components/Button';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Click me" />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} />);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when isLoading is true', () => {
    render(<Button title="Click me" isLoading />);
    expect(screen.queryByText('Click me')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is disabled when isLoading is true', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} isLoading />);

    // Find the touchable by test ID or accessibility
    const button = screen.root;
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button title="Primary" variant="primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();

    rerender(<Button title="Secondary" variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();

    rerender(<Button title="Outline" variant="outline" />);
    expect(screen.getByText('Outline')).toBeTruthy();

    rerender(<Button title="Danger" variant="danger" />);
    expect(screen.getByText('Danger')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button title="Small" size="sm" />);
    expect(screen.getByText('Small')).toBeTruthy();

    rerender(<Button title="Medium" size="md" />);
    expect(screen.getByText('Medium')).toBeTruthy();

    rerender(<Button title="Large" size="lg" />);
    expect(screen.getByText('Large')).toBeTruthy();
  });
});
