import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ToolBar from '../index';
import type { DraftInlineStyleType } from 'draft-js'
import type { ToolbarOption } from '../../types/toolbar-option';;

describe('ToolBar compnent', () => {
    const mockCallback = vi.fn();

    beforeEach(() => {
        mockCallback.mockClear();
    });


    test('renders default options when no options prop is provided', () => {
        //Arrange

        //Act
        render(<ToolBar callback={mockCallback} />);

        //Assert
        // Check if default buttons are rendered using their titles
        expect(screen.getByTitle('Bold')).toBeInTheDocument();
        expect(screen.getByTitle('Italic')).toBeInTheDocument();
        expect(screen.getByTitle('Underline')).toBeInTheDocument();
        expect(screen.getByTitle('Strike through')).toBeInTheDocument();

        // Ensure no extra buttons are rendered if default options length is known
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(4);
    });

    test('renders custom options in addition to default options when provided', () => {
        //Arrange
        const customOptions: ToolbarOption[] = [
            { title: 'Code', icon: <span style={{ fontWeight: 'bold' }}>{`</>`}</span>, command: 'CODE' },
        ];

        //Act
        render(<ToolBar callback={mockCallback} options={customOptions} />);

        //Assert
        // Check for default buttons
        expect(screen.getByTitle('Bold')).toBeInTheDocument();
        expect(screen.getByTitle('Italic')).toBeInTheDocument();
        // Check for custom buttons
        expect(screen.getByTitle('Code')).toBeInTheDocument();

        // Verify total number of buttons
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(5);
    });

    test('calls the callback with the correct command when a button is clicked', () => {
        // Arrange
        render(<ToolBar callback={mockCallback} />);
        const boldButton = screen.getByTitle('Bold');
        const italicButton = screen.getByTitle('Italic');


        //Act
        fireEvent.mouseDown(boldButton);

        // Assert
        // Verify that mockCallback was called once with 'BOLD'
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith('BOLD');

        //Act
        fireEvent.mouseDown(italicButton);

        // Assert
        // Verify that mockCallback was called twice in total, and last call was 'ITALIC'
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith('ITALIC');
    });

    test('renders custom content when renderToolbar prop is provided', () => {
        // Arrange
        const customRenderFunction = (options: ToolbarOption[], callback: (value: DraftInlineStyleType) => void) => (
            <div data-testid="custom-toolbar">
                <span>This is a custom toolbar with these options</span>
                {options.map((option) => <li key={option.title}>{option.title}</li>)}
                <button onClick={() => callback('BOLD')}>Bold Button</button>
            </div>
        );

        render(<ToolBar callback={mockCallback} renderToolbar={customRenderFunction} />);

        // Assert
        // Check if the custom div is rendered
        expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
        expect(screen.getByText('This is a custom toolbar', {exact: false})).toBeInTheDocument();

        // Ensure the default buttons are NOT rendered, and only render the bold button
        expect(screen.queryByTitle('Italic')).not.toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(1);
    });
});