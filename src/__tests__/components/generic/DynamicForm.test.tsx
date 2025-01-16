// src/__tests__/components/generic/DynamicForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicForm from '../../../components/generic/DynamicForm';
import { Field } from '../../../types';
import { useForm } from 'react-hook-form';

const mockFields: Field[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: false,
  },
    {
        name: 'dropdown',
        label: 'Dropdown',
        type: 'dropdown',
        required: false,
        options: {
            static: ["option1", "option2"]
        }
    },
    {
        name: 'lookup',
        label: 'Lookup',
        type: 'lookup',
        required: false,
        options: {
            dynamic: {
                 objectName: 'account',
                 displayField: "name",
                valueField: "_id"
            }
        }
    }
];

const onSubmit = jest.fn()
const onCancel = jest.fn()


describe('DynamicForm', () => {
    it('should render form fields based on config', () => {
        render(
           <DynamicForm
                fields={mockFields}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Dropdown')).toBeInTheDocument();
      expect(screen.getByLabelText('Lookup')).toBeInTheDocument();

    });

    it('should handle form submission', () => {
        render(
            <DynamicForm
                fields={mockFields}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Test Name' } });
        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);

       expect(onSubmit).toHaveBeenCalledTimes(1)
       expect(onSubmit).toHaveBeenCalledWith({name: 'Test Name', email: 'test@example.com'})
    });


   it('should handle form submission with dropdown and lookup', async () => {
        render(
            <DynamicForm
                fields={mockFields}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
         const dropdown = screen.getByLabelText('Dropdown');
           fireEvent.mouseDown(dropdown);
           const dropdownOption = screen.getByRole('option', { name: 'option2' });
           fireEvent.click(dropdownOption);

         const lookup = screen.getByLabelText('Lookup');
          fireEvent.mouseDown(lookup);
           const lookupOption = screen.getByRole('option', { name: 'option2' });
           fireEvent.click(lookupOption);

          const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit).toHaveBeenCalledWith({dropdown: 'option2', lookup: 'option2'})
    });

  it('should handle cancel button', () => {
    render(<DynamicForm fields={mockFields} onSubmit={onSubmit} onCancel={onCancel} />)
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});
      fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  })
});