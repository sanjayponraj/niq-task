import { useState } from 'react';
import './MultiSelectDropdownComponent.css';
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface MultiSelectProps {
    selectedState: string[];
    placeholder: string;
    label: string;
    list: string[];
    disable: boolean;
    handleMultiSelectChange: Function;
}


export default function MultiSelectDropdown(props: MultiSelectProps) {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
        const {
            target: { value },
        } = event;
        setSelectedValues(
            typeof value === 'string' ? value.split(',') : value,
        );
        props.handleMultiSelectChange(value)
    };
    const placeholder = props.placeholder;
    const listItems = props.list.map((item, idx) => (
        <MenuItem key={idx} value={item}>
            <Checkbox checked={selectedValues.indexOf(item) > -1} />
            <ListItemText primary={item} />
        </MenuItem>
    ))
    return (
        <div>
            <FormControl className='multiSelectDropdown'>
                <Select
                    labelId="multi-select-label"
                    id="multi-select-checkbox"
                    disabled={props.disable}
                    multiple
                    value={props.selectedState.length > 0 ? props.selectedState : [props.placeholder]}
                    placeholder={placeholder}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length > 1 && selected[0] === props.placeholder) {
                            selected.shift();
                        }
                        return selected.join(', ');
                      }}
                    MenuProps={MenuProps}
                >
                    {(placeholder ? <MenuItem disabled value="">{placeholder}</MenuItem> : '')}
                    {listItems}
                </Select>
            </FormControl>
        </div>
    );
}