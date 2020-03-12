import React from 'react'
import {Checkbox, Grid, Icon, Input, Button, ButtonProps} from 'semantic-ui-react'
import {InputOnChangeData} from 'semantic-ui-react/dist/commonjs/elements/Input/Input'
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox'
import {createRefreshScheduler} from '@dfuse/client'

interface AllowancesListFilterProps {
    addressFilterValue: string,
    showZeroAllowances: boolean,
    toggleShowZeroAllowances: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void,
    handleAddressFilterChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void,
    clearAddressFilter: (input: void)=>void,
    refresh: (event: React.MouseEvent, data: ButtonProps)=>void
}

const AllowancesListFilter = ( { showZeroAllowances,
                                  toggleShowZeroAllowances,
                                  addressFilterValue,
                                  handleAddressFilterChange,
                                  refresh,
                                  clearAddressFilter }:AllowancesListFilterProps ) => {
    return (
        <Grid verticalAlign='middle' centered textAlign={'center'} columns={2} divided>
            <Grid.Row>
                <Grid.Column width={9}>
                    <Input label='Tokenfilter'
                           name='filter'
                           placeholder='Enter name, symbol or contract address'
                           onChange={handleAddressFilterChange}
                           value={addressFilterValue}
                           icon={<Icon name='eraser' circular link onClick={clearAddressFilter} />}
                           fluid
                    />
                </Grid.Column>
                <Grid.Column width={6}>
                    <Checkbox
                        toggle
                        label='Include zero allowances'
                        checked={showZeroAllowances}
                        onChange={toggleShowZeroAllowances}
                    />
                </Grid.Column>
                <Grid.Column width={1}>
                    <Button circular icon={'refresh'} onClick={refresh} title={'Refresh allowances'} size={'small'} compact/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}


export default AllowancesListFilter