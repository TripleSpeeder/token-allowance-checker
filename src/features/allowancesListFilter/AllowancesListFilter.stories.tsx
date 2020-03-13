import React from 'react'
import { action } from '@storybook/addon-actions'
import {Container} from 'semantic-ui-react'
import AllowancesListFilter from './AllowancesListFilter'


export default {
    title: 'AllowancesListFilter',
    component: AllowancesListFilter,
    decorators: [
        (story: () => React.ReactNode) => (
            <Container>
                {story()}
            </Container>
        )
    ]}

export const normal = () => (
    <AllowancesListFilter
        showZeroAllowances={true}
        toggleShowZeroAllowances={action('toggleShowZero')}
        addressFilterValue={''}
        handleAddressFilterChange={action('addressFilterChange')}
        clearAddressFilter={action('clearAddressFilter')}
        refresh={action('refresh')}
    />
)
