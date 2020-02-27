import React from 'react'
import PropTypes from 'prop-types'
import {Checkbox, Grid, Icon, Input} from 'semantic-ui-react'

const AllowancesListFilter = ( { showZeroAllowances,
                                  toggleShowZeroAllowances,
                                  addressFilterValue,
                                  handleAddressFilterChange,
                                  clearAddressFilter } ) => {
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

AllowancesListFilter.propTypes = {
    showZeroAllowances: PropTypes.bool.isRequired,
    toggleShowZeroAllowances: PropTypes.func.isRequired,
    addressFilterValue: PropTypes.string.isRequired,
    handleAddressFilterChange: PropTypes.func.isRequired,
    clearAddressFilter: PropTypes.func.isRequired,
}

export default AllowancesListFilter