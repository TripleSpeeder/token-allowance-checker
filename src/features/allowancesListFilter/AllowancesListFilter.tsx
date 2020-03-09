import React from 'react'
import {Checkbox, Grid, Icon, Input} from 'semantic-ui-react'
import {InputOnChangeData} from 'semantic-ui-react/dist/commonjs/elements/Input/Input'
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox'

interface AllowancesListFilterProps {
    showZeroAllowances: boolean,
    toggleShowZeroAllowances: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void,
    addressFilterValue: string,
    handleAddressFilterChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void,
    clearAddressFilter: (input: void)=>void,
}

const AllowancesListFilter = ( { showZeroAllowances,
                                  toggleShowZeroAllowances,
                                  addressFilterValue,
                                  handleAddressFilterChange,
                                  clearAddressFilter }:AllowancesListFilterProps ) => {
    return (
        <Grid verticalAlign='middle' centered textAlign={'center'} columns={2} divided>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Input label='Tokenfilter'
                           name='filter'
                           placeholder='Enter name, symbol or contract address'
                           onChange={handleAddressFilterChange}
                           value={addressFilterValue}
                           icon={<Icon name='eraser' circular link onClick={clearAddressFilter} />}
                           fluid
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <Checkbox
                        toggle
                        label='Include zero allowances'
                        checked={showZeroAllowances}
                        onChange={toggleShowZeroAllowances}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}


export default AllowancesListFilter